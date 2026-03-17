import { z } from 'zod'
import { objectIdSchema, paginationSchema } from './common.schema'
import { CommentStatus } from '~/enums'

/**
 * Schema xác thực Bình luận (Comment)
 */

// Enum loại cảm xúc (reaction)
const reactionTypeSchema = z.enum(['like', 'love', 'care', 'fun', 'wow', 'sad', 'angry'])

// Schema tạo bình luận
export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Nội dung là bắt buộc').max(2000, 'Nội dung quá dài').trim(),
    lessonId: objectIdSchema,
    parentId: z.union([objectIdSchema, z.null()]).optional(), // Dùng cho reply
    mentions: z.array(objectIdSchema).optional() // Người dùng được mention
  })
})

// Schema thêm cảm xúc
export const addReactionSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    type: reactionTypeSchema
  })
})

// Schema xóa cảm xúc
export const removeReactionSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    type: reactionTypeSchema
  })
})

// Schema cập nhật bình luận
export const updateCommentSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    content: z.string().min(1, 'Nội dung là bắt buộc').max(2000, 'Nội dung quá dài').trim()
  })
})

// Schema lấy bình luận theo ID
export const getCommentByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema lấy bình luận theo bài học
export const getLessonCommentsSchema = z.object({
  params: z.object({
    lessonId: objectIdSchema
  }),
  query: paginationSchema.extend({
    status: z.nativeEnum(CommentStatus).optional(),
    sortBy: z.enum(['createdAt', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy bình luận theo user
export const getUserCommentsSchema = z.object({
  params: z.object({
    userId: objectIdSchema
  }),
  query: paginationSchema.extend({
    status: z.nativeEnum(CommentStatus).optional(),
    sortBy: z.enum(['createdAt', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema lấy tất cả bình luận (admin)
export const getCommentsSchema = z.object({
  query: paginationSchema.extend({
    lessonId: objectIdSchema.optional(),
    userId: objectIdSchema.optional(),
    status: z
      .union([
        z.nativeEnum(CommentStatus),
        z.array(z.nativeEnum(CommentStatus)),
        z.string().transform((val) => {
          // Xử lý dạng "a,b,c"
          if (val.includes(',')) {
            return val.split(',').map((s) => s.trim())
          }
          return val
        })
      ])
      .optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'status', 'content']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Schema duyệt bình luận (approve/reject)
export const moderateCommentSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.enum([CommentStatus.APPROVED, CommentStatus.REJECTED]),
    reason: z.string().optional() // Lý do duyệt/từ chối
  })
})

// Schema xóa bình luận
export const deleteCommentSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  query: z.object({
    deleteReplies: z
      .string()
      .regex(/^(true|false)$/)
      .optional()
      .default('false')
  })
})

// Schema duyệt nhiều bình luận
export const bulkModerateCommentsSchema = z.object({
  body: z.object({
    commentIds: z.array(objectIdSchema).min(1, 'Phải có ít nhất một comment ID'),
    status: z.enum([CommentStatus.APPROVED, CommentStatus.REJECTED]),
    reason: z.string().optional()
  })
})

// Schema lấy reply của bình luận
export const getCommentRepliesSchema = z.object({
  params: z.object({
    commentId: objectIdSchema
  }),
  query: paginationSchema.extend({
    status: z.nativeEnum(CommentStatus).optional(),
    maxLevel: z
      .string()
      .regex(/^[1-5]$/)
      .optional()
      .default('5'), // Độ sâu tối đa
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
})

// Schema lấy danh sách reaction của bình luận
export const getCommentReactionsSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  query: z.object({
    type: reactionTypeSchema.optional() // Lọc theo loại reaction
  })
})

// Export type
export type CreateCommentInput = z.infer<typeof createCommentSchema>['body']
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>['body']
export type AddReactionInput = z.infer<typeof addReactionSchema>['body']
export type RemoveReactionInput = z.infer<typeof removeReactionSchema>['body']
export type GetLessonCommentsQuery = z.infer<typeof getLessonCommentsSchema>['query']
export type GetUserCommentsQuery = z.infer<typeof getUserCommentsSchema>['query']
export type GetCommentsQuery = z.infer<typeof getCommentsSchema>['query']
export type ModerateCommentInput = z.infer<typeof moderateCommentSchema>['body']
export type BulkModerateCommentsInput = z.infer<typeof bulkModerateCommentsSchema>['body']
export type GetCommentRepliesQuery = z.infer<typeof getCommentRepliesSchema>['query']
export type GetCommentReactionsQuery = z.infer<typeof getCommentReactionsSchema>['query']
