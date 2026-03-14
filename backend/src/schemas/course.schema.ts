import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string(),
  slug: z.string()
})
