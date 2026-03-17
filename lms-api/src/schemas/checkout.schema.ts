import { z } from 'zod'
import { PaymentMethod } from '../enums'

/**
 * Checkout Validation Schemas
 */

// Checkout preview schema
export const checkoutPreviewSchema = z.object({
  body: z.object({
    couponCode: z.string().optional()
  })
})

// Process checkout schema
export const processCheckoutSchema = z.object({
  body: z.object({
    couponCode: z.string().optional(),
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER], {
      message: 'Phương thức thanh toán không hợp lệ'
    })
  })
})

// Export types
export type CheckoutPreviewInput = z.infer<typeof checkoutPreviewSchema>['body']
export type ProcessCheckoutInput = z.infer<typeof processCheckoutSchema>['body']
