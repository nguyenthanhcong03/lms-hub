import { z } from 'zod'
import { CategoryStatus } from '../enums'

/**
 * Schema xác thực Danh mục (Category) - CRUD đơn giản
 */

// Schema tạo danh mục
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tên là bắt buộc').max(100, 'Tên quá dài').trim(),
    slug: z.string().min(1, 'Slug là bắt buộc').max(100, 'Slug quá dài').trim(),
    status: z.nativeEnum(CategoryStatus).optional().default(CategoryStatus.ACTIVE)
  })
})

// Schema cập nhật danh mục
export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tên là bắt buộc').max(100, 'Tên quá dài').trim().optional(),
    slug: z.string().min(1, 'Slug là bắt buộc').max(100, 'Slug quá dài').trim().optional(),
    status: z.nativeEnum(CategoryStatus).optional()
  })
})

// Schema query lấy danh sách danh mục
export const getCategoriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Page phải là số').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit phải là số').optional(),
    search: z.string().max(100, 'Từ khóa tìm kiếm quá dài').optional(),
    status: z
      .union([
        z.nativeEnum(CategoryStatus),
        z.string().transform((val) => val.split(',').map((s) => s.trim())),
        z.array(z.nativeEnum(CategoryStatus))
      ])
      .optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
})

// Schema xóa nhiều danh mục
export const bulkDeleteCategoriesSchema = z.object({
  body: z.object({
    categoryIds: z
      .array(z.string().min(1, 'Category ID là bắt buộc'))
      .min(1, 'Phải có ít nhất một category ID')
      .max(100, 'Không thể xóa quá 100 danh mục cùng lúc')
  })
})

// Export type
export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body']
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>['body']
export type GetCategoriesQuery = z.infer<typeof getCategoriesSchema>['query']
export type BulkDeleteCategoriesInput = z.infer<typeof bulkDeleteCategoriesSchema>['body']
