import { z } from 'zod'
import { CouponDiscountType } from '../enums'

/**
 * Schema xác thực Mã giảm giá (Coupon) - CRUD đơn giản
 */

// Schema tạo coupon
export const createCouponSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100, 'Tiêu đề quá dài').trim(),
      code: z.string().min(3, 'Mã phải có ít nhất 3 ký tự').max(20, 'Mã quá dài').trim().toUpperCase(),
      discountType: z.enum([CouponDiscountType.PERCENT, CouponDiscountType.FIXED]),
      discountValue: z.number().min(0, 'Giá trị phải là số dương'),
      courseIds: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID khóa học không hợp lệ'))
        .optional()
        .default([]),
      minPurchaseAmount: z.number().min(0, 'Giá trị đơn hàng tối thiểu phải là số dương').optional().default(0),
      maxUses: z.number().int().min(1, 'Số lượt sử dụng tối đa phải >= 1').optional(),
      startDate: z.string().datetime('Định dạng ngày bắt đầu không hợp lệ').optional(),
      endDate: z.string().datetime('Định dạng ngày kết thúc không hợp lệ').optional(),
      isActive: z.boolean().optional().default(true)
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.endDate) > new Date(data.startDate)
        }
        return true
      },
      {
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
        path: ['endDate']
      }
    )
    .refine(
      (data) => {
        if (data.discountType === CouponDiscountType.PERCENT) {
          return data.discountValue >= 1 && data.discountValue <= 100
        }
        return true
      },
      {
        message: 'Phần trăm giảm giá phải từ 1 đến 100',
        path: ['discountValue']
      }
    )
})

// Schema cập nhật coupon
export const updateCouponSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100, 'Tiêu đề quá dài').trim().optional(),
      code: z.string().min(3, 'Mã phải có ít nhất 3 ký tự').max(20, 'Mã quá dài').trim().toUpperCase().optional(),
      discountType: z.enum([CouponDiscountType.PERCENT, CouponDiscountType.FIXED]).optional(),
      discountValue: z.number().min(0, 'Giá trị phải là số dương').optional(),
      courseIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID khóa học không hợp lệ')).optional(),
      minPurchaseAmount: z.number().min(0, 'Giá trị đơn hàng tối thiểu phải là số dương').optional(),
      maxUses: z.number().int().min(1, 'Số lượt sử dụng tối đa phải >= 1').optional(),
      startDate: z.string().datetime('Định dạng ngày bắt đầu không hợp lệ').optional(),
      endDate: z.string().datetime('Định dạng ngày kết thúc không hợp lệ').optional(),
      isActive: z.boolean().optional()
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.endDate) > new Date(data.startDate)
        }
        return true
      },
      {
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
        path: ['endDate']
      }
    )
    .refine(
      (data) => {
        if (data.discountType === CouponDiscountType.PERCENT && data.discountValue !== undefined) {
          return data.discountValue >= 1 && data.discountValue <= 100
        }
        return true
      },
      {
        message: 'Phần trăm giảm giá phải từ 1 đến 100',
        path: ['discountValue']
      }
    )
})

// Schema query lấy danh sách coupon
export const getCouponsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Page phải là số').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit phải là số').optional(),
    search: z.string().max(100, 'Từ khóa tìm kiếm quá dài').optional(),
    isActive: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    discountType: z.enum([CouponDiscountType.PERCENT, CouponDiscountType.FIXED]).optional(),
    sortBy: z
      .enum(['title', 'code', 'startDate', 'endDate', 'createdAt', 'updatedAt', 'discountType', 'discountValue'])
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
})

// Schema áp dụng coupon
export const applyCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Mã coupon là bắt buộc').trim().toUpperCase(),
    courseIds: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID khóa học không hợp lệ'))
      .min(1, 'Phải có ít nhất một khóa học')
  })
})

// Export type
export type CreateCouponInput = z.infer<typeof createCouponSchema>['body']
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>['body']
export type GetCouponsQuery = z.infer<typeof getCouponsSchema>['query']
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>['body']
