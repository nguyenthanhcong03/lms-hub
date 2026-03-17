import { z } from 'zod'
import { objectIdSchema, paginationSchema } from './common.schema'

/**
 * Schema validation cho Quiz Question
 */

// Schema cho một câu hỏi
const questionObjectSchema = z.object({
  quizId: objectIdSchema,
  question: z.string().min(1, 'Câu hỏi là bắt buộc').max(1000, 'Câu hỏi quá dài').trim(),
  explanation: z.string().min(1, 'Giải thích là bắt buộc').max(2000, 'Giải thích quá dài').trim(),
  type: z.enum(['multiple_choice', 'true_false', 'single_choice']),
  options: z
    .array(z.string().min(1, 'Lựa chọn không được để trống').trim())
    .min(2, 'Cần ít nhất 2 lựa chọn')
    .max(6, 'Tối đa 6 lựa chọn'),
  correctAnswers: z.array(z.number().int().min(0, 'Chỉ số đáp án phải >= 0')).min(1, 'Cần ít nhất một đáp án đúng'),
  point: z.number().int().min(1, 'Điểm phải >= 1').max(100, 'Điểm không được vượt quá 100')
})

// Schema tạo câu hỏi quiz
export const createQuizQuestionSchema = z.object({
  body: z.object({
    questions: z.array(questionObjectSchema).min(1, 'Cần ít nhất một câu hỏi')
  })
})

// Schema cập nhật câu hỏi quiz
export const updateQuizQuestionSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      quizId: objectIdSchema.optional(),
      question: z.string().min(1, 'Câu hỏi là bắt buộc').max(1000, 'Câu hỏi quá dài').trim().optional(),
      explanation: z.string().min(1, 'Giải thích là bắt buộc').max(2000, 'Giải thích quá dài').trim().optional(),
      type: z.enum(['multiple_choice', 'true_false', 'single_choice']).optional(),
      options: z
        .array(z.string().min(1, 'Lựa chọn không được để trống').trim())
        .min(2, 'Cần ít nhất 2 lựa chọn')
        .max(6, 'Tối đa 6 lựa chọn')
        .optional(),
      correctAnswers: z
        .array(z.number().int().min(0, 'Chỉ số đáp án phải >= 0'))
        .min(1, 'Cần ít nhất một đáp án đúng')
        .optional(),
      point: z.number().int().min(1, 'Điểm phải >= 1').max(100, 'Điểm không được vượt quá 100').optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một field để cập nhật')
})

// Schema query danh sách câu hỏi quiz
export const getQuizQuestionsQuerySchema = z.object({
  query: paginationSchema.extend({
    quizId: objectIdSchema.optional(),
    type: z.enum(['multiple_choice', 'true_false', 'single_choice']).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['question', 'point', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
})

// Schema lấy câu hỏi theo ID
export const getQuizQuestionByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema xoá câu hỏi
export const deleteQuizQuestionSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

// Schema lấy câu hỏi theo quizId
export const getQuestionsByQuizSchema = z.object({
  params: z.object({
    quizId: objectIdSchema
  }),
  query: paginationSchema.extend({
    type: z.enum(['multiple_choice', 'true_false', 'single_choice']).optional(),
    sortBy: z.enum(['question', 'point', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
})

// Schema xoá nhiều câu hỏi quiz
export const bulkDeleteQuizQuestionsSchema = z.object({
  body: z.object({
    questionIds: z.array(objectIdSchema).min(1, 'Cần ít nhất một question ID')
  })
})

// Export type
export type QuizQuestionData = z.infer<typeof questionObjectSchema>
export type CreateQuizQuestionInput = z.infer<typeof createQuizQuestionSchema>['body']
export type UpdateQuizQuestionInput = z.infer<typeof updateQuizQuestionSchema>['body']
export type GetQuizQuestionsQuery = z.infer<typeof getQuizQuestionsQuerySchema>['query']
export type GetQuestionsByQuizQuery = z.infer<typeof getQuestionsByQuizSchema>['query']
