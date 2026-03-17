import { z } from 'zod'
import { BlogStatus } from '../enums'

/**
 * Schema xác thực Blog
 */

// Schema tạo blog
export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim(),
    slug: z.string().min(1, 'Slug là bắt buộc').max(200, 'Slug quá dài').trim().toLowerCase(),
    content: z.string().min(1, 'Nội dung là bắt buộc'),
    excerpt: z.string().min(1, 'Tóm tắt là bắt buộc').max(500, 'Tóm tắt quá dài').trim(),
    thumbnail: z.string().optional(),
    status: z.nativeEnum(BlogStatus).optional().default(BlogStatus.DRAFT),
    publishedAt: z.string().datetime('Định dạng ngày không hợp lệ').optional(),
    categoryId: z.string().min(1, 'ID danh mục là bắt buộc').optional()
  })
})

// Schema cập nhật blog
export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim().optional(),
    slug: z.string().min(1, 'Slug là bắt buộc').max(200, 'Slug quá dài').trim().toLowerCase().optional(),
    content: z.string().min(1, 'Nội dung là bắt buộc').optional(),
    excerpt: z.string().min(1, 'Tóm tắt là bắt buộc').max(500, 'Tóm tắt quá dài').trim().optional(),
    thumbnail: z.string().min(1, 'Thumbnail là bắt buộc').url('Thumbnail phải là URL hợp lệ').optional(),
    status: z.nativeEnum(BlogStatus).optional(),
    publishedAt: z.string().datetime('Định dạng ngày không hợp lệ').optional(),
    categoryId: z.string().min(1, 'ID danh mục là bắt buộc').optional()
  })
})

// Schema query lấy danh sách blog
export const getBlogsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Page phải là số').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit phải là số').optional(),
    search: z.string().max(100, 'Từ khóa tìm kiếm quá dài').optional(),
    status: z
      .union([
        z.nativeEnum(BlogStatus),
        z.string().transform((val) => val.split(',').map((s) => s.trim())),
        z.array(z.nativeEnum(BlogStatus))
      ])
      .optional(),
    authorId: z.string().optional(),
    categoryId: z.string().optional(),
    sortBy: z.enum(['title', 'publishedAt', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
})

// Schema params blog theo ID
export const blogParamsSchema = z.object({
  params: z.object({
    blogId: z.string().min(1, 'Blog ID là bắt buộc')
  })
})

// Schema params blog theo slug
export const blogSlugParamsSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug blog là bắt buộc')
  })
})

// Schema xóa nhiều blog
export const bulkDeleteBlogsSchema = z.object({
  body: z.object({
    blogIds: z
      .array(z.string().min(1, 'Blog ID là bắt buộc'))
      .min(1, 'Phải có ít nhất một blog ID')
      .max(100, 'Không thể xóa quá 100 blog cùng lúc')
  })
})

// Export type
export type CreateBlogInput = z.infer<typeof createBlogSchema>['body']
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>['body']
export type GetBlogsQuery = z.infer<typeof getBlogsSchema>['query']
export type BlogParamsInput = z.infer<typeof blogParamsSchema>['params']
export type BlogSlugParamsInput = z.infer<typeof blogSlugParamsSchema>['params']
export type BulkDeleteBlogsInput = z.infer<typeof bulkDeleteBlogsSchema>['body']
