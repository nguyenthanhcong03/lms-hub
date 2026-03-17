import { Role, IRole } from '../models/role'
import { User } from '../models/user'
import { NotFoundError, ConflictError } from '../utils/errors'
import { Permission, SYSTEM_ROLE_NAMES } from '~/configs/permission'

interface RoleWithUserCount extends Record<string, unknown> {
  totalUsers: number
}

interface RoleInput {
  name: string
  permissions: Permission[]
  description?: string
}

interface UpdateRoleInput {
  name?: string
  permissions?: Permission[]
  description?: string
}

export class RoleService {
  // Tạo vai trò mới
  async createRole(roleData: RoleInput): Promise<IRole> {
    const { name, permissions, description } = roleData

    const existingRole = await Role.findOne({ name })
    if (existingRole) {
      throw new ConflictError('Tên vai trò đã tồn tại')
    }

    const newRole = new Role({
      name,
      permissions,
      description
    })

    await newRole.save()

    return newRole
  }

  // Lấy tất cả vai trò kèm số lượng người dùng
  async getAllRoles(): Promise<RoleWithUserCount[]> {
    const roles = await Role.find()

    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const totalUsers = await User.countDocuments({ roles: { $in: [role._id] } })
        return {
          ...role.toObject(),
          totalUsers
        }
      })
    )
    return rolesWithUserCount
  }

  async getPublicRoles(): Promise<IRole[]> {
    const roles = await Role.find().select('-permissions -description -createdAt -updatedAt -__v')
    return roles
  }

  // Lấy vai trò theo ID
  async getRoleById(roleId: string): Promise<IRole | RoleWithUserCount | null> {
    const role = await Role.findById(roleId)

    if (!role) {
      throw new NotFoundError('Không tìm thấy vai trò')
    }

    const totalUsers = await User.countDocuments({ roles: { $in: [role._id] } })

    return {
      ...role.toObject(),
      totalUsers
    }
  }

  // Cập nhật vai trò
  async updateRole(roleId: string, updateData: UpdateRoleInput): Promise<IRole> {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new NotFoundError('Không tìm thấy vai trò')
    }

    const { name, permissions, description } = updateData

    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name })
      if (existingRole) {
        throw new ConflictError('Tên vai trò đã tồn tại')
      }
    }

    if (name) role.name = name
    if (permissions) role.permissions = permissions
    if (description !== undefined) role.description = description

    await role.save()

    return role
  }

  // Xóa vai trò có kiểm tra ràng buộc
  async deleteRole(roleId: string): Promise<void> {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new NotFoundError('Không tìm thấy vai trò')
    }

    const usersWithRole = await User.countDocuments({ roles: { $in: [role._id] } })
    if (usersWithRole > 0) {
      throw new ConflictError('Không thể xóa vai trò. Vai trò này đang được gán cho người dùng')
    }

    await Role.findByIdAndDelete(roleId)
  }

  // Lấy toàn bộ quyền của một vai trò
  async getAllPermissions(roleId: string): Promise<Permission[]> {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new NotFoundError('Không tìm thấy vai trò')
    }

    return this.mergePermissions(role.permissions)
  }

  // Lấy quyền của người dùng từ tất cả vai trò đã gán
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await User.findById(userId).populate('roles')
    if (!user || !user.roles || user.roles.length === 0) {
      return []
    }

    // Gom quyền từ tất cả vai trò của người dùng
    const allPermissions = new Set<Permission>()

    for (const role of user.roles as unknown as Array<{ _id: string }>) {
      const rolePermissions = await this.getAllPermissions(role._id.toString())
      rolePermissions.forEach((permission) => allPermissions.add(permission))
    }

    return Array.from(allPermissions)
  }

  // Gộp các mảng quyền và loại bỏ trùng lặp
  private mergePermissions(...permissionArrays: Permission[][]): Permission[] {
    const allPermissions = permissionArrays.flat()
    return [...new Set(allPermissions)]
  }
}
