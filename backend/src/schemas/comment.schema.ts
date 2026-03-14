import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().nonempty('Content is required'),
  lessonId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
    .nonempty('Lesson ID is required'),
  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
    .optional()
})
