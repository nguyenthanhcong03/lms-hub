import { Request, Response } from 'express'
import { SepayWebhookInput } from '../schemas/payment.schema'
import { PaymentService } from '../services/payment.service'
import { AppError } from '../utils/errors'

/**
 * Payment Controller
 * Handles webhook callbacks and payment operations for payment gateways
 */
export class PaymentController {
  /**
   * SePay webhook callback endpoint
   * Endpoint: POST /payment/sepay-callback
   */
  static async sepayCallback(req: Request, res: Response): Promise<void> {
    // Extract API key from Authorization header
    const authHeader = req.headers.authorization
    const apiKey = authHeader?.replace('Apikey ', '') || ''

    // Validate API key
    if (!PaymentService.validateSepayWebhook(apiKey)) {
      throw new AppError('Invalid API key', 401)
    }

    // Get webhook data from request body
    const webhookData: SepayWebhookInput = req.body

    try {
      // Process webhook
      const result = await PaymentService.handleSepayWebhook(webhookData)

      // Return success response in SePay required format
      res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.order
      })
    } catch (error) {
      // Handle business logic errors gracefully for SePay
      if (error instanceof AppError) {
        // Return success response for ignored cases (SePay expects this)
        res.status(200).json({
          success: true,
          message: `Ignored: ${error.message}`
        })
      } else {
        // Re-throw unexpected errors
        throw error
      }
    }
  }
}
