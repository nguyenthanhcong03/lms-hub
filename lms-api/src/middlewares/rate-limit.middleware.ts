import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import { getEnvironmentConfig, RATE_LIMIT_HEADERS } from '../configs/rate-limit.config'
import { RateLimitError, ErrorCodes } from '../utils/errors'

// Lấy cấu hình theo từng môi trường
const config = getEnvironmentConfig()

// Hàm hỗ trợ tạo handler giới hạn tỷ lệ theo cấu trúc lỗi của dự án
const createRateLimitHandler = (errorMessage: string, defaultRetryAfter: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil(req.rateLimit.resetTime.getTime() / 1000)
      : defaultRetryAfter

    // Create custom RateLimitError following project's error handling pattern
    const rateLimitError = new RateLimitError(errorMessage, ErrorCodes.RATE_LIMIT_EXCEEDED, {
      retryAfter,
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    })

    // Pass to error middleware for consistent handling
    next(rateLimitError)
  }
}

// Rate limiter mặc định cho việc sử dụng API chung
export const defaultRateLimit = rateLimit({
  windowMs: config.DEFAULT.windowMs,
  limit: config.DEFAULT.limit,
  message: {
    error: config.DEFAULT.message,
    retryAfter: Math.ceil(config.DEFAULT.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  handler: createRateLimitHandler(config.DEFAULT.message, Math.ceil(config.DEFAULT.windowMs / 1000))
})

// Rate limiter nghiêm ngặt cho các endpoint xác thực
export const authRateLimit = rateLimit({
  windowMs: config.AUTH.windowMs,
  limit: config.AUTH.limit,
  message: {
    error: config.AUTH.message,
    retryAfter: Math.ceil(config.AUTH.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  skipSuccessfulRequests: config.AUTH.skipSuccessfulRequests,
  handler: createRateLimitHandler(config.AUTH.message, Math.ceil(config.AUTH.windowMs / 1000))
})

// Rate limiter cho tạo tài khoản
export const passwordResetRateLimit = rateLimit({
  windowMs: config.PASSWORD_RESET.windowMs,
  limit: config.PASSWORD_RESET.limit,
  message: {
    error: config.PASSWORD_RESET.message,
    retryAfter: Math.ceil(config.PASSWORD_RESET.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  handler: createRateLimitHandler(config.PASSWORD_RESET.message, Math.ceil(config.PASSWORD_RESET.windowMs / 1000))
})

// Rate limiter cho đặt lại mật khẩu
export const paymentRateLimit = rateLimit({
  windowMs: config.PAYMENT.windowMs,
  limit: config.PAYMENT.limit,
  message: {
    error: config.PAYMENT.message,
    retryAfter: Math.ceil(config.PAYMENT.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  handler: createRateLimitHandler(config.PAYMENT.message, Math.ceil(config.PAYMENT.windowMs / 1000))
})

// Rate limiter cho thanh toán
export const searchRateLimit = rateLimit({
  windowMs: config.SEARCH.windowMs,
  limit: config.SEARCH.limit,
  message: {
    error: config.SEARCH.message,
    retryAfter: Math.ceil(config.SEARCH.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  handler: createRateLimitHandler(config.SEARCH.message, Math.ceil(config.SEARCH.windowMs / 1000))
})

// Rate limiter cho tìm kiếm
export const uploadRateLimit = rateLimit({
  windowMs: config.UPLOAD.windowMs,
  limit: config.UPLOAD.limit,
  message: {
    error: config.UPLOAD.message,
    retryAfter: Math.ceil(config.UPLOAD.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  handler: createRateLimitHandler(config.UPLOAD.message, Math.ceil(config.UPLOAD.windowMs / 1000))
})

// Rate limiter cho tải lên
export const createAccountRateLimit = rateLimit({
  windowMs: config.CREATE_ACCOUNT.windowMs,
  limit: config.CREATE_ACCOUNT.limit,
  message: {
    error: config.CREATE_ACCOUNT.message,
    retryAfter: Math.ceil(config.CREATE_ACCOUNT.windowMs / 1000)
  },
  ...RATE_LIMIT_HEADERS,
  handler: createRateLimitHandler(config.CREATE_ACCOUNT.message, Math.ceil(config.CREATE_ACCOUNT.windowMs / 1000))
})
