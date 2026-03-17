import { Category, ICategory } from '../models/category'
import { Course } from '../models/course'
import { AppError } from '../utils/errors'
import { CategoryStatus, CourseStatus } from '../enums'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  GetCategoriesQuery,
  BulkDeleteCategoriesInput
} from '../schemas/category.schema'

/**
 * Dịch vụ quản lý danh mục
 * Các thao tác tạo, đọc, cập nhật, xóa cơ bản cho danh mục
 */

interface GetCategoriesResult {
  categories: ICategory[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export class CategoryService {
  /**
   * Tạo danh mục mới
   */
  static async createCategory(categoryData: CreateCategoryInput): Promise<ICategory> {
    // Kiểm tra tên đã tồn tại chưa
    const existingCategoryByName = await Category.findOne({ name: categoryData.name })
    if (existingCategoryByName) {
      throw new AppError('Đã tồn tại danh mục với tên này', 400)
    }

    // Kiểm tra slug đã tồn tại chưa
    const existingCategoryBySlug = await Category.findOne({ slug: categoryData.slug })
    if (existingCategoryBySlug) {
      throw new AppError('Đã tồn tại danh mục với slug này', 400)
    }

    const category = new Category(categoryData)
    await category.save()

    return category
  }

  /**
   * Lấy danh sách danh mục có phân trang
   */
  static async getCategories(options: Partial<GetCategoriesQuery> = {}): Promise<GetCategoriesResult> {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = options
    // Chuyển chuỗi sang số bằng toán tử +
    const pageNum = +page
    const limitNum = +limit
    const skip = (pageNum - 1) * limitNum

    // Tạo điều kiện lọc
    const filter: Record<string, unknown> = {}

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: 'i' } }]
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

    // Tạo điều kiện sắp xếp
    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Thực thi truy vấn song song
    const [categories, total] = await Promise.all([
      Category.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Category.countDocuments(filter)
    ])

    const totalPages = Math.ceil(total / limitNum)

    return {
      categories: categories as ICategory[],
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
   * Lấy danh mục theo ID
   */
  static async getCategoryById(categoryId: string): Promise<ICategory> {
    const category = await Category.findById(categoryId)

    if (!category) {
      throw new AppError('Không tìm thấy danh mục', 404)
    }

    return category
  }

  /**
   * Cập nhật danh mục
   */
  static async updateCategory(categoryId: string, updateData: UpdateCategoryInput): Promise<ICategory> {
    const category = await Category.findById(categoryId)
    if (!category) {
      throw new AppError('Không tìm thấy danh mục', 404)
    }

    // Kiểm tra tên mới có bị trùng không
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await Category.findOne({ name: updateData.name })
      if (existingCategory) {
        throw new AppError('Đã tồn tại danh mục với tên này', 400)
      }
    }

    // Kiểm tra slug mới có bị trùng không
    if (updateData.slug && updateData.slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug: updateData.slug })
      if (existingCategory) {
        throw new AppError('Đã tồn tại danh mục với slug này', 400)
      }
    }

    // Cập nhật danh mục
    Object.assign(category, updateData)
    await category.save()

    return category
  }

  /**
   * Xóa danh mục
   */
  static async deleteCategory(categoryId: string): Promise<void> {
    const category = await Category.findById(categoryId)
    if (!category) {
      throw new AppError('Không tìm thấy danh mục', 404)
    }

    // Kiểm tra danh mục có đang được khóa học nào dùng không
    const coursesCount = await Course.countDocuments({ categoryId: categoryId })
    if (coursesCount > 0) {
      throw new AppError(`Không thể xóa danh mục. Đang được ${coursesCount} khóa học sử dụng`, 400)
    }

    await Category.findByIdAndDelete(categoryId)
  }

  /**
   * Xóa hàng loạt danh mục
   */
  static async bulkDeleteCategories(data: BulkDeleteCategoriesInput): Promise<{
    deletedCount: number
    skippedCategories: { id: string; name: string; reason: string }[]
  }> {
    const { categoryIds } = data

    // Loại bỏ phần tử trùng lặp
    const uniqueCategoryIds = [...new Set(categoryIds)]

    // Kiểm tra tất cả danh mục có tồn tại
    const categories = await Category.find({ _id: { $in: uniqueCategoryIds } })
    const foundCategoryIds = categories.map((cat) => cat._id.toString())
    const notFoundIds = uniqueCategoryIds.filter((id) => !foundCategoryIds.includes(id))

    if (notFoundIds.length > 0) {
      throw new AppError(`Không tìm thấy danh mục: ${notFoundIds.join(', ')}`, 404)
    }

    // Kiểm tra danh mục nào đang được khóa học sử dụng
    const courseCounts = await Promise.all(
      uniqueCategoryIds.map(async (categoryId) => {
        const count = await Course.countDocuments({ categoryId })
        return { categoryId, count }
      })
    )

    const categoriesInUse = courseCounts.filter((item) => item.count > 0)

    if (categoriesInUse.length > 0) {
      const categoryNames = await Category.find({
        _id: { $in: categoriesInUse.map((item) => item.categoryId) }
      }).select('name')

      const inUseDetails = categoriesInUse
        .map((item) => {
          const category = categoryNames.find((cat) => cat._id.toString() === item.categoryId)
          return `${category?.name || item.categoryId} (${item.count} khóa học)`
        })
        .join(', ')

      throw new AppError(`Không thể xóa các danh mục đang được sử dụng: ${inUseDetails}`, 400)
    }

    // Xóa tất cả danh mục
    const result = await Category.deleteMany({ _id: { $in: uniqueCategoryIds } })

    return {
      deletedCount: result.deletedCount || 0,
      skippedCategories: []
    }
  }

  /**
   * Lấy tất cả danh mục đang hoạt động kèm số lượng khóa học
   */
  static async getAllCategories(): Promise<Array<{ name: string; courseCount: number }>> {
    // Chỉ lấy danh mục đang hoạt động (chỉ cần trường name)
    const categories = await Category.find({ status: CategoryStatus.ACTIVE }).select('name').sort({ name: 1 }).lean()

    // Lấy số lượng khóa học cho từng danh mục
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const courseCount = await Course.countDocuments({
          categoryId: category._id,
          status: CourseStatus.PUBLISHED // Chỉ đếm khóa học đã xuất bản
        })

        return {
          ...category,
          courseCount
        }
      })
    )

    return categoriesWithCounts
  }
}
