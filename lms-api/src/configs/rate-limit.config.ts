/**
 * Cấu hình giới hạn tần suất
 *
 * Tệp này chứa cấu hình cho các chiến lược giới hạn tần suất khác nhau
 * được dùng trong toàn bộ ứng dụng. Hãy điều chỉnh các giá trị theo nhu cầu của bạn.
 */

import dotenv from 'dotenv'

dotenv.config()

export const RATE_LIMIT_CONFIG = {
  // Giới hạn tần suất mặc định cho việc sử dụng API chung
  DEFAULT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // requests per window
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
  },

  // Endpoint xác thực (đăng nhập, đăng ký, v.v.)
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // requests per window
    message: 'Quá nhiều lần thử xác thực, vui lòng thử lại sau.',
    skipSuccessfulRequests: false // Đếm tất cả yêu cầu để phục vụ kiểm thử
  },

  // Tạo tài khoản (endpoint đăng ký)
  CREATE_ACCOUNT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 3, // requests per window
    message: 'Quá nhiều lần tạo tài khoản, vui lòng thử lại sau.'
  },

  // Yêu cầu đặt lại mật khẩu
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 3, // requests per window
    message: 'Quá nhiều lần đặt lại mật khẩu, vui lòng thử lại sau.'
  },

  // Xử lý thanh toán
  PAYMENT: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 10, // requests per window
    message: 'Quá nhiều lần thanh toán, vui lòng thử lại sau.'
  },

  // Chức năng tìm kiếm
  SEARCH: {
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 30, // requests per window
    message: 'Quá nhiều yêu cầu tìm kiếm, vui lòng thử lại sau.'
  },

  // Endpoint tải lên (bình luận, tải tệp, v.v.)
  UPLOAD: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 20, // requests per window
    message: 'Quá nhiều lần tải lên, vui lòng thử lại sau.'
  }
} as const

/**
 * Cấu hình giới hạn tần suất theo môi trường
 * Điều chỉnh giới hạn theo môi trường (development, staging, production)
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development'

  // Trong môi trường development, nới lỏng giới hạn hơn
  if (env === 'development') {
    return {
      ...RATE_LIMIT_CONFIG,
      DEFAULT: { ...RATE_LIMIT_CONFIG.DEFAULT, limit: 1000 },
      AUTH: { ...RATE_LIMIT_CONFIG.AUTH, limit: 50 },
      SEARCH: { ...RATE_LIMIT_CONFIG.SEARCH, limit: 100 }
    }
  }

  // Trong môi trường production, dùng giới hạn chặt chẽ hơn
  return RATE_LIMIT_CONFIG
}

/**
 * Cấu hình header giới hạn tần suất
 */
export const RATE_LIMIT_HEADERS = {
  standardHeaders: true, // Trả về thông tin giới hạn trong header `RateLimit-*`
  legacyHeaders: false // Tắt các header `X-RateLimit-*`
} as const
