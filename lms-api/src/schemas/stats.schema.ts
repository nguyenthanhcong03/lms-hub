import { z } from 'zod'

/**
 * Schema validation cho thống kê
 */

// Schema lấy xu hướng doanh thu theo tháng
export const getMonthlyRevenueTrendSchema = z.object({
  query: z.object({
    months: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true
        const num = parseInt(val)
        return !isNaN(num) && num > 0 && num <= 24
      }, 'Số tháng phải là số từ 1 đến 24')
      .transform((val) => (val ? parseInt(val) : undefined))
  })
})

// Schema lấy xu hướng đăng ký người dùng
export const getUserRegistrationTrendSchema = z.object({
  query: z.object({
    days: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true
        const num = parseInt(val)
        return !isNaN(num) && num > 0 && num <= 365
      }, 'Số ngày phải là số từ 1 đến 365')
      .transform((val) => (val ? parseInt(val) : undefined))
  })
})

// Export type cho TypeScript
export type GetMonthlyRevenueTrendQuery = z.infer<typeof getMonthlyRevenueTrendSchema>['query']
export type GetUserRegistrationTrendQuery = z.infer<typeof getUserRegistrationTrendSchema>['query']
