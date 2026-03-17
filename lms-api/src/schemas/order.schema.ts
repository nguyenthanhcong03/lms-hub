import { z } from 'zod'
import { OrderStatus, PaymentMethod } from '../enums'

/**
 * Schema validation cho Order
 */

// Schema tạo đơn hàng
export const createOrderSchema = z.object({
  body: z.object({
    courseIds: z.array(z.string().min(1, 'Course ID là bắt buộc')).min(1, 'Cần ít nhất một khóa học'),
    couponCode: z.string().optional(),
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER], {
      message: 'Phương thức thanh toán không hợp lệ'
    })
  })
})

// Schema tạo đơn hàng từ giỏ hàng
export const createOrderFromCartSchema = z.object({
  body: z.object({
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER], {
      message: 'Phương thức thanh toán không hợp lệ'
    }),
    couponCode: z.string().optional()
  })
})

// Schema cập nhật trạng thái đơn hàng
export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED], {
      message: 'Trạng thái đơn hàng không hợp lệ'
    })
  })
})

// Schema query danh sách đơn hàng
export const getOrdersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
    limit: z.string().optional().default('10').transform(Number).pipe(z.number().min(1).max(100)),
    status: z.enum([OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED]).optional(),
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER]).optional(),
    sortBy: z.enum(['createdAt', 'totalAmount', 'code']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional()
  })
})

// Schema param Order ID
export const orderParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID là bắt buộc')
  })
})

// Schema xoá nhiều đơn hàng
export const bulkDeleteOrdersSchema = z.object({
  body: z.object({
    orderIds: z
      .array(z.string().min(1, 'Order ID là bắt buộc'))
      .min(1, 'Cần ít nhất một Order ID')
      .max(100, 'Không thể xoá quá 100 đơn hàng cùng lúc')
  })
})

// Export types
export type CreateOrderInput = z.infer<typeof createOrderSchema>['body']
export type CreateOrderFromCartInput = z.infer<typeof createOrderFromCartSchema>['body']
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>['body']
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>['query']
export type OrderParams = z.infer<typeof orderParamsSchema>['params']
export type BulkDeleteOrdersInput = z.infer<typeof bulkDeleteOrdersSchema>['body']
