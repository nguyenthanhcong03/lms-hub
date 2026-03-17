import { z } from 'zod'
import { objectIdSchema, paginationSchema } from './common.schema'
import { ReviewStatus } from '../enums'

// Schema tạo đánh giá
export const createReviewSchema = z.object({
  body: z.object({
    courseId: objectIdSchema,
    star: z.number().int('Số sao phải là số nguyên').min(1, 'Số sao phải >= 1').max(5, 'Số sao không được vượt quá 5'),
    content: z
      .string()
      .trim()
      .min(1, 'Nội dung đánh giá phải có ít nhất 1 ký tự')
      .max(1000, 'Nội dung đánh giá không được vượt quá 1000 ký tự')
  })
})

// Schema cập nhật đánh giá
export const updateReviewSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),

  body: z
    .object({
      star: z
        .number()
        .int('Số sao phải là số nguyên')
        .min(1, 'Số sao phải >= 1')
        .max(5, 'Số sao không được vượt quá 5')
        .optional(),
      content: z
        .string()
        .trim()
        .min(1, 'Nội dung đánh giá phải có ít nhất 1 ký tự')
        .max(1000, 'Nội dung đánh giá không được vượt quá 1000 ký tự')
        .optional(),
      status: z.enum([ReviewStatus.ACTIVE, ReviewStatus.INACTIVE]).optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một field để cập nhật')
})

// Schema query danh sách đánh giá
export const getReviewsQuerySchema = z.object({
  query: paginationSchema.extend({
    courseId: objectIdSchema.optional(),
    userId: objectIdSchema.optional(),
    status: z.enum([ReviewStatus.ACTIVE, ReviewStatus.INACTIVE]).optional(),
    star: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => !val || (val >= 1 && val <= 5), 'Số sao phải nằm trong khoảng 1 đến 5'),
    sortBy: z.enum(['createdAt', 'updatedAt', 'star']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy đánh giá theo ID
export const getReviewByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá đánh giá
export const deleteReviewSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema lấy đánh giá theo course
export const getCourseReviewsSchema = z.object({
  params: z.object({
    courseId: objectIdSchema
  }),
  query: paginationSchema.extend({
    status: z.enum([ReviewStatus.ACTIVE, ReviewStatus.INACTIVE]).optional(),
    minStar: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => !val || (val >= 1 && val <= 5), 'Số sao tối thiểu phải từ 1 đến 5'),
    sortBy: z.enum(['createdAt', 'updatedAt', 'star']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy đánh giá theo user
export const getUserReviewsSchema = z.object({
  params: z.object({
    userId: objectIdSchema
  }),
  query: paginationSchema.extend({
    status: z.enum([ReviewStatus.ACTIVE, ReviewStatus.INACTIVE]).optional(),
    star: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => !val || (val >= 1 && val <= 5), 'Số sao phải nằm trong khoảng 1 đến 5'),
    sortBy: z.enum(['createdAt', 'updatedAt', 'star']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema thống kê rating của course
export const getCourseRatingStatsSchema = z.object({
  params: z.object({
    courseId: objectIdSchema
  })
})

// Export type
export type CreateReviewInput = z.infer<typeof createReviewSchema>['body']
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>['body']
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>['query']
export type GetCourseReviewsQuery = z.infer<typeof getCourseReviewsSchema>['query']
export type GetUserReviewsQuery = z.infer<typeof getUserReviewsSchema>['query']
