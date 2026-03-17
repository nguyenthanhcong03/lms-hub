// Enum trạng thái danh mục

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Cơ sở category interface representing the category entity
export interface ICategory {
  _id: string
  name: string
  slug: string
  status: CategoryStatus
  createdAt: string
  updatedAt: string
}

// Interface dữ liệu form để tạo/cập nhật categories
export interface CategoryFormData {
  name: string
  slug: string
  status: CategoryStatus
}

// Interface thống kê cho category metrics
export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  totalCourses?: number // Optional - total courses across all categories
}

// Category with additional computed properties
export interface ICategoryWithStats extends ICategory {
  coursesCount?: number // Number of courses in this category
  studentsCount?: number // Number of students enrolled in courses of this category
}

// Interface phân trang cho category lists
export interface CategoryPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

// Response danh sach danh muc
export interface CategoriesListResponse {
  categories: ICategory[]
  pagination: CategoryPagination
}

// Tham số lọc và tìm kiếm cho categories
export interface CategoriesFilterParams {
  page?: number
  limit?: number
  search?: string
  status?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Request tạo danh mục
export interface CreateCategoryRequest {
  name: string
  slug: string
  status?: CategoryStatus
}

// Request cập nhật danh mục
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string
}
