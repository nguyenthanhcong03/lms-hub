export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errorCode?: string

  constructor(message: string, statusCode: number, errorCode?: string, isOperational = true) {
    super(message)

    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errorCode = errorCode

    // Giữ stack trace chính xác tại vị trí lỗi được ném (chỉ có trên V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = this.constructor.name
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errorCode?: string) {
    super(message, 400, errorCode)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Xác thực thất bại', errorCode?: string) {
    super(message, 401, errorCode)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Không đủ quyền truy cập', errorCode?: string) {
    super(message, 403, errorCode)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Không tìm thấy tài nguyên', errorCode?: string) {
    super(message, 404, errorCode)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Xung đột tài nguyên', errorCode?: string) {
    super(message, 409, errorCode)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Thao tác cơ sở dữ liệu thất bại', errorCode?: string) {
    super(message, 500, errorCode)
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'Lỗi dịch vụ bên ngoài', errorCode?: string) {
    super(message, 502, errorCode)
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter?: number
  public readonly limit?: number
  public readonly remaining?: number
  public readonly resetTime?: Date

  constructor(
    message: string = 'Vượt quá giới hạn truy cập',
    errorCode?: string,
    rateLimit?: {
      retryAfter?: number
      limit?: number
      remaining?: number
      resetTime?: Date
    }
  ) {
    super(message, 429, errorCode)
    this.retryAfter = rateLimit?.retryAfter
    this.limit = rateLimit?.limit
    this.remaining = rateLimit?.remaining
    this.resetTime = rateLimit?.resetTime
  }
}

// Mã lỗi dùng để định danh lỗi nhất quán
export const ErrorCodes = {
  // Xác thực
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  ACCOUNT_BANNED: 'ACCOUNT_BANNED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',

  // Xác thực dữ liệu
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
  INVALID_INPUT_FORMAT: 'INVALID_INPUT_FORMAT',

  // Xung đột tài nguyên
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',

  // Không tìm thấy tài nguyên
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
  ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
  COUPON_NOT_FOUND: 'COUPON_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  CHAPTER_NOT_FOUND: 'CHAPTER_NOT_FOUND',
  LESSON_NOT_FOUND: 'LESSON_NOT_FOUND',
  REVIEW_NOT_FOUND: 'REVIEW_NOT_FOUND',
  QUIZ_NOT_FOUND: 'QUIZ_NOT_FOUND',
  QUIZ_QUESTION_NOT_FOUND: 'QUIZ_QUESTION_NOT_FOUND',

  // Xung đột tài nguyên
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Nhóm lỗi đánh giá
  REVIEW_ALREADY_EXISTS: 'REVIEW_ALREADY_EXISTS',
  UNAUTHORIZED_ACTION: 'UNAUTHORIZED_ACTION',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Nhóm lỗi mã giảm giá
  COUPON_CODE_EXISTS: 'COUPON_CODE_EXISTS',
  COUPON_EXPIRED: 'COUPON_EXPIRED',
  COUPON_NOT_ACTIVE: 'COUPON_NOT_ACTIVE',
  COUPON_USAGE_LIMIT_EXCEEDED: 'COUPON_USAGE_LIMIT_EXCEEDED',
  COUPON_NOT_APPLICABLE: 'COUPON_NOT_APPLICABLE',
  INVALID_COUPON_CODE: 'INVALID_COUPON_CODE',

  // Nhóm lỗi câu hỏi quiz
  INVALID_CORRECT_ANSWER_INDEX: 'INVALID_CORRECT_ANSWER_INDEX',
  INVALID_TRUE_FALSE_OPTIONS: 'INVALID_TRUE_FALSE_OPTIONS',
  INVALID_SINGLE_CHOICE_ANSWERS: 'INVALID_SINGLE_CHOICE_ANSWERS',

  // Cơ sở dữ liệu
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_OPERATION_FAILED: 'DB_OPERATION_FAILED',

  // Cấu hình
  CONFIG_MISSING: 'CONFIG_MISSING',
  DEFAULT_ROLE_NOT_CONFIGURED: 'DEFAULT_ROLE_NOT_CONFIGURED',

  // Chung
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const
