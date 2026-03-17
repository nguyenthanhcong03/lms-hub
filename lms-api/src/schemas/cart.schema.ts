import { z } from 'zod'
import { objectIdSchema } from './common.schema'

/**
 * Schema xác thực Giỏ hàng (Cart)
 */

// Schema thêm vào giỏ hàng
export const addToCartSchema = z.object({
  body: z.object({
    courseId: objectIdSchema
  })
})

// Schema xóa khỏi giỏ hàng
export const removeFromCartSchema = z.object({
  params: z.object({
    courseId: objectIdSchema
  })
})

// Schema cập nhật item trong giỏ hàng
export const updateCartItemSchema = z.object({
  params: z.object({
    courseId: objectIdSchema
  }),
  body: z.object({
    // Dự phòng cho các cập nhật trong tương lai
  })
})

// Export type
export type AddToCartInput = z.infer<typeof addToCartSchema>['body']
export type RemoveFromCartParams = z.infer<typeof removeFromCartSchema>['params']
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body']
export type UpdateCartItemParams = z.infer<typeof updateCartItemSchema>['params']
