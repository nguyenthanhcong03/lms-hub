import { FilterQuery } from 'mongoose'
import UserModel from '~/models/user.model'
import { UpdateUserParams, UserQueryParams } from '~/types/user.type'

const UserService = {
  // Fetch user information by ID, excluding the password field
  fetchUserDetails: async (userId: string) => {
    return UserModel.findById(userId).select('-password').populate('courses', 'title slug')
  },

  // Update user information by ID with provided payload
  updateUser: async (id: string, updateData: UpdateUserParams) => {
    return UserModel.findByIdAndUpdate(
      id,
      { ...updateData },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')
  },

  // Fetch all users with optional filters, pagination, and search
  fetchAllUsers: async (params: UserQueryParams) => {
    const limit = +(params?.limit ?? 10)
    const search = params?.search || ''
    const page = +(params?.page ?? 1)
    const status = params?.status || ''
    const role = params?.role || ''

    const query: FilterQuery<typeof UserModel> = {}

    if (role) query.role = role
    if (status) query.status = status
    if (search) {
      query.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
    }

    const skip = (page - 1) * limit

    if (page === -1 && limit === -1) {
      const result = await UserModel.find(query).sort({ createdAt: -1 })
      return { result }
    }

    const [users, total_count] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('courses', 'title slug'),
      UserModel.countDocuments(query)
    ])

    return {
      users,
      pagination: {
        page,
        per_page: limit,
        total_pages: Math.ceil(total_count / limit),
        total_count
      }
    }
  },
  getUserMetrics: async () => {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [thisMonthCount, lastMonthCount, totalCount] = await Promise.all([
      UserModel.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      UserModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }),
      UserModel.countDocuments()
    ])

    const trend = thisMonthCount === lastMonthCount ? 'neutral' : thisMonthCount > lastMonthCount ? 'asc' : 'desc'

    const changePercent =
      lastMonthCount === 0
        ? null // prevent division by zero
        : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100

    return {
      total: totalCount,
      change: changePercent,
      trend
    }
  }
}

export default UserService
