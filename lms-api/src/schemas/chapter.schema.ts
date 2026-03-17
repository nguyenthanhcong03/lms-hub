import { z } from 'zod'
import { objectIdSchema } from './common.schema'

/**
 * Schema xác thực Chương (Chapter)
 */

// Schema tạo chương
export const createChapterSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim(),
    description: z.string().max(2000, 'Mô tả quá dài').trim().optional(),
    courseId: objectIdSchema,
    isPublished: z.boolean().default(false).optional()
  })
})

// Schema cập nhật chương
export const updateChapterSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim().optional(),
      description: z.string().max(2000, 'Mô tả quá dài').trim().optional(),
      isPublished: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một trường để cập nhật')
})

// Schema query lấy danh sách chương
export const getChaptersQuerySchema = z.object({
  query: z.object({
    courseId: objectIdSchema
  })
})

// Schema lấy chương theo ID
export const getChapterByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xóa chương
export const deleteChapterSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema lấy danh sách chương theo khóa học
export const getCourseChaptersSchema = z.object({
  params: z.object({
    courseId: objectIdSchema
  }),
  query: z.object({
    isPublished: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
    sortBy: z.enum(['title', 'order', 'createdAt']).default('order'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
})

// Schema sắp xếp lại thứ tự chương
export const reorderChaptersSchema = z.object({
  body: z.object({
    chapters: z
      .array(
        z.object({
          id: objectIdSchema,
          order: z.number().min(0, 'Thứ tự phải là số không âm')
        })
      )
      .min(1, 'Phải có ít nhất một chương')
  })
})

// Export type
export type CreateChapterInput = z.infer<typeof createChapterSchema>['body']
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>['body']
export type GetChaptersQuery = z.infer<typeof getChaptersQuerySchema>['query']
export type GetCourseChaptersQuery = z.infer<typeof getCourseChaptersSchema>['query']
export type ReorderChaptersInput = z.infer<typeof reorderChaptersSchema>['body']
