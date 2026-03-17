import { z } from 'zod'
import { objectIdSchema, paginationSchema } from './common.schema'

/**
 * Schema validation cho Lesson và Resource
 */

// Schema tạo lesson (hỗ trợ cả resource và resourceId)
export const createLessonSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim(),
      chapterId: objectIdSchema,
      courseId: objectIdSchema,
      contentType: z.enum(['video', 'quiz', 'article']),
      preview: z.boolean().optional().default(false),
      isPublished: z.boolean().optional().default(false),
      duration: z.number().int().optional(),
      // Có thể truyền resourceId (resource đã tồn tại) HOẶC resource (tạo mới)
      resourceId: objectIdSchema.optional(),
      resource: z.record(z.string(), z.any()).optional()
    })
    .refine((data) => data.resourceId || data.resource, {
      message: 'Phải cung cấp resourceId hoặc resource',
      path: ['resourceId']
    })
})

// Schema cập nhật lesson (có thể kèm resource)
export const updateLessonSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim().optional(),
      chapterId: objectIdSchema.optional(),
      order: z.number().int().min(1, 'Thứ tự phải >= 1').optional(),
      preview: z.boolean().optional(),
      isPublished: z.boolean().optional(),
      duration: z.number().int().min(0, 'Thời lượng phải >= 0 (0 = không giới hạn)').optional(),
      resource: z.record(z.string(), z.any()).optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một field để cập nhật')
})

// Schema query lấy danh sách lesson (bắt buộc chapterId)
export const getLessonsQuerySchema = z.object({
  query: z.object({
    chapterId: objectIdSchema
  })
})

// Schema lấy lesson theo ID
export const getLessonByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá lesson
export const deleteLessonSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema lấy lesson theo chapter
export const getChapterLessonsSchema = z.object({
  params: z.object({
    chapterId: objectIdSchema
  }),
  query: paginationSchema.extend({
    contentType: z.enum(['video', 'quiz', 'article']).optional(),
    isPublished: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
    sortBy: z.enum(['title', 'order', 'createdAt']).default('order'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
})

// Schema lấy lesson theo course
export const getCourseLessonsSchema = z.object({
  params: z.object({
    courseId: objectIdSchema
  }),
  query: paginationSchema.extend({
    chapterId: objectIdSchema.optional(),
    contentType: z.enum(['video', 'quiz', 'article']).optional(),
    isPublished: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
    sortBy: z.enum(['title', 'order', 'createdAt']).default('order'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
})

// Schema sắp xếp lại lesson
export const reorderLessonsSchema = z.object({
  body: z.object({
    lessons: z
      .array(
        z.object({
          id: objectIdSchema,
          order: z.number().min(0, 'Thứ tự phải >= 0')
        })
      )
      .min(1, 'Cần ít nhất một lesson')
  })
})

/**
 * Schema validation cho Video Resource
 */

// Schema tạo video
export const createVideoSchema = z.object({
  body: z.object({
    url: z.string().url('URL không hợp lệ').min(1, 'URL là bắt buộc'),
    description: z.string().min(1, 'Mô tả là bắt buộc').max(1000, 'Mô tả quá dài').trim()
  })
})

// Schema cập nhật video
export const updateVideoSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      url: z.string().url('URL không hợp lệ').min(1, 'URL là bắt buộc').optional(),
      description: z.string().min(1, 'Mô tả là bắt buộc').max(1000, 'Mô tả quá dài').trim().optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một field để cập nhật')
})

// Schema query video
export const getVideosQuerySchema = z.object({
  query: paginationSchema.extend({
    search: z.string().optional(),
    sortBy: z.enum(['url', 'description', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy video theo ID
export const getVideoByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá video
export const deleteVideoSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá nhiều video
export const bulkDeleteVideosSchema = z.object({
  body: z.object({
    videoIds: z.array(objectIdSchema).min(1, 'Cần ít nhất một video ID')
  })
})

/**
 * Schema validation cho Article Resource
 */

// Schema tạo article
export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim(),
    description: z.string().min(1, 'Mô tả là bắt buộc').max(5000, 'Mô tả quá dài').trim()
  })
})

// Schema cập nhật article
export const updateArticleSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim().optional(),
      description: z.string().min(1, 'Mô tả là bắt buộc').max(5000, 'Mô tả quá dài').trim().optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một field để cập nhật')
})

// Schema query article
export const getArticlesQuerySchema = z.object({
  query: paginationSchema.extend({
    search: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy article theo ID
export const getArticleByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá article
export const deleteArticleSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

/**
 * Schema validation cho Quiz Resource
 */

// Schema tạo quiz
export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim(),
    totalAttemptsAllowed: z.number().int().min(1, 'Số lần làm phải >= 1').max(10, 'Số lần làm tối đa là 10'),
    passingScorePercentage: z.number().int().min(1, 'Điểm đạt phải >= 1%').max(100, 'Điểm đạt tối đa là 100%'),
    description: z.string().trim().optional()
  })
})

// Schema cập nhật quiz
export const updateQuizSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim().optional(),
      totalAttemptsAllowed: z
        .number()
        .int()
        .min(1, 'Số lần làm phải >= 1')
        .max(10, 'Số lần làm tối đa là 10')
        .optional(),
      passingScorePercentage: z
        .number()
        .int()
        .min(1, 'Điểm đạt phải >= 1%')
        .max(100, 'Điểm đạt tối đa là 100%')
        .optional(),
      description: z.string().trim().optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một field để cập nhật')
})

// Schema query quiz
export const getQuizzesQuerySchema = z.object({
  query: paginationSchema.extend({
    search: z.string().optional(),
    sortBy: z.enum(['title', 'duration', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy quiz theo ID
export const getQuizByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá quiz
export const deleteQuizSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Type exports for the schemas
export type CreateLessonInput = z.infer<typeof createLessonSchema>['body']
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>['body']
export type GetLessonsQuery = z.infer<typeof getLessonsQuerySchema>['query']
export type GetChapterLessonsQuery = z.infer<typeof getChapterLessonsSchema>['query']
export type GetCourseLessonsQuery = z.infer<typeof getCourseLessonsSchema>['query']
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>['body']

// Video type exports
export type CreateVideoInput = z.infer<typeof createVideoSchema>['body']
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>['body']
export type GetVideosQuery = z.infer<typeof getVideosQuerySchema>['query']

// Article type exports
export type CreateArticleInput = z.infer<typeof createArticleSchema>['body']
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>['body']
export type GetArticlesQuery = z.infer<typeof getArticlesQuerySchema>['query']

// Quiz type exports
export type CreateQuizInput = z.infer<typeof createQuizSchema>['body']
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>['body']
export type GetQuizzesQuery = z.infer<typeof getQuizzesQuerySchema>['query']
