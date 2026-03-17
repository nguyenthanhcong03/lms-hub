import { z } from 'zod'

/**
 * Schema validation cho Payment
 */

// Schema dữ liệu webhook từ SePay
export const sepayWebhookSchema = z.object({
  body: z.object({
    id: z.number().int().positive('Transaction ID là bắt buộc'),
    gateway: z.string().min(1, 'Gateway là bắt buộc'),
    transferType: z.enum(['in', 'out'], { message: 'Loại giao dịch là bắt buộc' }),
    transferAmount: z.number().positive('Số tiền giao dịch phải là số dương'),
    accountNumber: z.string().optional(),
    subAccount: z.string().optional(),
    code: z.string().optional(),
    content: z.string().optional(),
    description: z.string().optional(),
    referenceCode: z.string().optional(),
    body: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
  })
})

// Schema validation API key trong header
export const apiKeyHeaderSchema = z.object({
  headers: z.object({
    authorization: z.string().min(1, 'Authorization header là bắt buộc')
  })
})

// Schema query callback từ payment
export const paymentCallbackQuerySchema = z.object({
  query: z.object({
    status: z.enum(['success', 'failed', 'pending']).optional(),
    orderId: z.string().optional(),
    transactionId: z.string().optional()
  })
})

// Export types
export type SepayWebhookInput = z.infer<typeof sepayWebhookSchema>['body']
export type ApiKeyHeaderInput = z.infer<typeof apiKeyHeaderSchema>['headers']
export type PaymentCallbackQuery = z.infer<typeof paymentCallbackQuerySchema>['query']
