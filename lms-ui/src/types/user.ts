import { IRole } from './role'

// Giao diện cơ sở biểu diễn thực thể người dùng
export interface IUser {
  _id: string
  username: string
  email: string
  password: string // Mật khẩu đã băm (không trả về trong API)
  status: 'active' | 'inactive' | 'banned'
  avatar?: string
  courses: string[] // Mảng ID khóa học
  userType: 'facebook' | 'google' | 'default'
  roles: IRole[] // Mảng đối tượng vai trò
  createdAt: string
  updatedAt: string
}

// Enum trạng thái người dùng khớp với schema
export type UserStatus = 'active' | 'inactive' | 'banned'

// Enum loại người dùng khớp với schema
export type UserType = 'facebook' | 'google' | 'default'

// Interface dữ liệu form để tạo/cập nhật users
export interface UserFormData {
  username: string
  email: string
  status: UserStatus
  avatar?: string
  courses: string[]
  userType: UserType
  roles: string[]
  password?: string // Chỉ dùng khi tạo mới
}

// Interface thống kê cho user metrics
export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  bannedUsers: number
  facebookUsers: number
  googleUsers: number
  defaultUsers: number
}

// Người dùng với các thuộc tính tính toán bổ sung
export interface IUserWithStats extends IUser {
  coursesCount?: number // Số khóa học người dùng đã ghi danh
  completedCoursesCount?: number // Số khóa học đã hoàn thành
}

// Interface phân trang cho user lists
export interface UserPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

// Phản hồi danh sách người dùng
export interface UsersListResponse {
  users: IUser[]
  pagination: UserPagination
}

// Tham số lọc và tìm kiếm cho người dùng
export interface UsersFilterParams {
  page?: number
  limit?: number
  search?: string
  status?: string[]
  userType?: string[]
  role?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

// Các interface request cho API
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  status?: UserStatus
  avatar?: string
  courses?: string[]
  userType?: UserType
  roles?: string[]
}

export interface UpdateUserRequest {
  id: string
  username?: string
  email?: string
  status?: UserStatus
  avatar?: string
  courses?: string[]
  userType?: UserType
  roles?: string[]
}
export interface UpdateUserStatusRequest {
  id: string
  status: UserStatus
}

export interface UpdateUserRolesRequest {
  id: string
  roles: string[]
}

export interface UpdateUserCoursesRequest {
  id: string
  courses: string[]
}
