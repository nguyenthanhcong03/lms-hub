import mongoose, { FilterQuery } from 'mongoose'
import { UserStatus, UserType } from '../enums'
import { Role } from '../models/role'
import { IUser, User } from '../models/user'
import { GetUsersOptions, UpdateProfileData, UpdateUserData } from '../types/user.type'
import { ConflictError, ErrorCodes, NotFoundError, ValidationError } from '../utils/errors'

/**
 * Dịch vụ quản lý người dùng
 * Xử lý các thao tác CRUD và nghiệp vụ liên quan người dùng
 */

interface GetUsersResult {
  users: IUser[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export class UserService {
  /**
   * Lấy danh sách người dùng có phân trang và lọc
   */
  static async getUsers(options: GetUsersOptions = {}): Promise<GetUsersResult> {
    const { page = 1, limit = 10, search, status, userType, roles } = options

    // Chuyển chuỗi sang số bằng toán tử +
    const pageNum = +page
    const limitNum = +limit
    const skip = (pageNum - 1) * limitNum

    // Tạo điều kiện lọc
    const filter: FilterQuery<IUser> = {}

    if (search) {
      filter.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
    }

    if (status) {
      if (Array.isArray(status)) {
        // Nhiều giá trị trạng thái
        filter.status = { $in: status }
      } else if (typeof status === 'string' && status.includes(',')) {
        // Chuỗi phân tách bằng dấu phẩy
        const statusArray = status.split(',').map((s) => s.trim())
        filter.status = { $in: statusArray }
      } else {
        // Một giá trị trạng thái
        filter.status = status
      }
    }

    if (userType) {
      if (Array.isArray(userType)) {
        // Nhiều giá trị userType
        filter.userType = { $in: userType }
      } else if (typeof userType === 'string' && userType.includes(',')) {
        // Chuỗi phân tách bằng dấu phẩy
        const userTypeArray = userType.split(',').map((s) => s.trim())
        filter.userType = { $in: userTypeArray }
      } else {
        // Một giá trị userType
        filter.userType = userType
      }
    }

    if (roles && roles.length > 0) {
      // Tìm vai trò theo ID hoặc tên
      const roleIds = []
      for (const roleData of roles) {
        let role
        if (mongoose.Types.ObjectId.isValid(roleData)) {
          role = await Role.findById(roleData)
        } else {
          role = await Role.findOne({ name: roleData })
        }
        if (role) {
          roleIds.push(role._id)
        }
      }
      if (roleIds.length > 0) {
        filter.roles = { $in: roleIds }
      }
    }

    // Tạo điều kiện sắp xếp - mặc định createdAt giảm dần
    const sort: Record<string, 1 | -1> = { createdAt: -1 }

    // Thực thi truy vấn song song
    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('roles', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-password')
        .lean(),
      User.countDocuments(filter)
    ])

    const totalPages = Math.ceil(total / limitNum)

    return {
      users: users as IUser[],
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  }

  /**
   * Lấy người dùng theo ID
   */
  static async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId)
      .populate('roles', 'name description permissions')
      .populate('courses', 'title description')
      .select('-password')

    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng', ErrorCodes.USER_NOT_FOUND)
    }

    return user
  }

  /**
   * Cập nhật hồ sơ người dùng (người dùng tự cập nhật)
   */
  static async updateProfile(userId: string, updateData: UpdateProfileData): Promise<IUser> {
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng', ErrorCodes.USER_NOT_FOUND)
    }

    // Kiểm tra username mới có bị trùng không
    if (updateData.username && updateData.username !== user.username) {
      const existingUsername = await User.findOne({
        username: updateData.username,
        _id: { $ne: userId }
      })
      if (existingUsername) {
        throw new ConflictError('Tên người dùng đã tồn tại', ErrorCodes.USERNAME_TAKEN)
      }
      user.username = updateData.username
    }

    // Kiểm tra email mới có bị trùng không
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId }
      })
      if (existingEmail) {
        throw new ConflictError('Email đã tồn tại', ErrorCodes.EMAIL_ALREADY_REGISTERED)
      }
      user.email = updateData.email
    }

    // Cập nhật avatar nếu có
    if (updateData.avatar !== undefined) {
      user.avatar = updateData.avatar
    }

    await user.save()

    return user
  }

  /**
   * Cập nhật người dùng (quyền quản trị)
   */
  static async updateUser(userId: string, updateData: UpdateUserData): Promise<IUser> {
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng', ErrorCodes.USER_NOT_FOUND)
    }

    // Cập nhật vai trò nếu có truyền
    if (updateData.roles && updateData.roles.length > 0) {
      const roles = []
      for (const roleData of updateData.roles) {
        let role
        if (mongoose.Types.ObjectId.isValid(roleData)) {
          role = await Role.findById(roleData)
        } else {
          role = await Role.findOne({ name: roleData })
        }

        if (!role) {
          throw new NotFoundError(`Không tìm thấy vai trò: ${roleData}`, ErrorCodes.ROLE_NOT_FOUND)
        }
        roles.push(role._id)
      }
      user.roles = roles
    }

    // Cập nhật trạng thái nếu có truyền
    if (updateData.status) {
      user.status = updateData.status
    }

    await user.save()

    return user
  }

  /**
   * Xóa người dùng
   */
  static async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng', ErrorCodes.USER_NOT_FOUND)
    }

    await User.findByIdAndDelete(userId)
  }
}
