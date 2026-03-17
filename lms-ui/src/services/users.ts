import { ApiService } from '@/lib/api-service'
import { IRole } from '@/types/role'
import type {
  IUser,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UpdateUserRolesRequest,
  UpdateUserCoursesRequest,
  UsersFilterParams,
  UsersListResponse,
  UserStats
} from '@/types/user'

// Endpoint API người dùng
const ENDPOINTS = {
  USERS: '/users',
  USER: (id: string) => `/users/${id}`,
  USER_STATUS: (id: string) => `/users/${id}/status`,
  USER_ROLES: (id: string) => `/users/${id}/roles`,
  USER_COURSES: (id: string) => `/users/${id}/courses`,
  USER_STATS: '/users/stats',
  BULK_DELETE: '/users/bulk-delete'
} as const

// Service người dùng
export class UsersService {
  // Lấy tất cả người dùng với bộ lọc tùy chọn
  static async getUsers(params?: UsersFilterParams): Promise<UsersListResponse> {
    try {
      return await ApiService.get<UsersListResponse>(ENDPOINTS.USERS, params)
    } catch {
      return {
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    }
  }

  // Lấy một người dùng theo ID
  static async getUser(id: string): Promise<IUser> {
    return ApiService.get<IUser>(ENDPOINTS.USER(id))
  }

  // Lưu ý: Tạo người dùng do đăng ký/xác thực ngoài xử lý
  // Chức năng này đã được chủ đích loại bỏ khỏi admin panel

  // Cập nhật người dùng hiện có
  static async updateUser(userData: UpdateUserRequest): Promise<IUser> {
    const { id, ...updateData } = userData
    return ApiService.put<IUser, Omit<UpdateUserRequest, 'id'>>(ENDPOINTS.USER(id), updateData)
  }

  // Cập nhật trạng thái người dùng
  static async updateUserStatus(statusData: UpdateUserStatusRequest): Promise<IUser> {
    const { id, status } = statusData
    return ApiService.put<IUser, { status: string }>(ENDPOINTS.USER_STATUS(id), {
      status
    })
  }

  // Cập nhật vai trò người dùng
  static async updateUserRoles(rolesData: UpdateUserRolesRequest): Promise<IUser> {
    const { id, roles } = rolesData
    return ApiService.put<IUser, { roles: string[] }>(ENDPOINTS.USER_ROLES(id), {
      roles
    })
  }

  // Cập nhật khóa học của người dùng
  static async updateUserCourses(coursesData: UpdateUserCoursesRequest): Promise<IUser> {
    const { id, courses } = coursesData
    return ApiService.put<IUser, { courses: string[] }>(ENDPOINTS.USER_COURSES(id), { courses })
  }

  // Xóa một người dùng
  static async deleteUser(id: string): Promise<void> {
    return ApiService.delete<void>(ENDPOINTS.USER(id))
  }

  // Xóa hàng loạt người dùng
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    return ApiService.post<void, { userIds: string[] }>(ENDPOINTS.BULK_DELETE, {
      userIds
    })
  }

  // Lấy thống kê người dùng
  static async getUserStats(): Promise<UserStats> {
    return ApiService.get<UserStats>(ENDPOINTS.USER_STATS)
  }
}

// Export mặc định để đồng nhất với các service khác
export default UsersService
