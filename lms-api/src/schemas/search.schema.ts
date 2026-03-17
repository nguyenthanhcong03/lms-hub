import { z } from 'zod'

/**
 * Schema validation cho tìm kiếm
 */

// Schema query tìm kiếm
export const searchQuerySchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Từ khóa tìm kiếm là bắt buộc').max(100, 'Từ khóa tìm kiếm phải ít hơn 100 ký tự').trim()
  })
})

export type SearchQueryInput = z.infer<typeof searchQuerySchema>
