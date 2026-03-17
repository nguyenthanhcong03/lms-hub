import { Router } from 'express'
import { PaymentController } from '../controllers/payment.controller'
import { asyncHandler } from '../middlewares/error.middleware'

const router = Router()

/**
 * Public Routes - Webhook endpoints (no authentication required)
 */

// SePay webhook callback
router.post('/sepay-callback', asyncHandler(PaymentController.sepayCallback))

export default router
