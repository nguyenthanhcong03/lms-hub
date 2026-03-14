import { reasonPhrases } from '~/constants/reason-phrases'
import { statusCodes } from '~/constants/status-codes'

class ErrorResponse extends Error {
  status: number
  typeError: string

  constructor(message: string, status: number, typeError: string = '') {
    super(message)
    this.status = status
    this.typeError = typeError
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(message = reasonPhrases.CONFLICT, statusCode = statusCodes.CONFLICT, typeError = 'CONFLICT') {
    super(message, statusCode, typeError)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message: string, status = statusCodes.BAD_REQUEST, typeError = 'BAD_REQUEST') {
    super(message, status, typeError)
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message: string, status = statusCodes.UNAUTHORIZED, typeError = 'UNAUTHORIZED') {
    super(message, status, typeError)
  }
}
class NotFoundError extends ErrorResponse {
  constructor(message: string, status = statusCodes.NOT_FOUND, typeError = 'NOT_FOUND') {
    super(message, status, typeError)
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message: string, status = statusCodes.FORBIDDEN, typeError = 'FORBIDDEN') {
    super(message, status, typeError)
  }
}

class UnprocessableEntityError extends ErrorResponse {
  errors: { field: string; message: string }[]
  constructor(
    message: string,
    errors: { field: string; message: string }[],
    status = statusCodes.UNPROCESSABLE_ENTITY,
    typeError = 'UNPROCESSABLE_ENTITY'
  ) {
    super(message, status, typeError)
    this.errors = errors
  }
}
export {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  UnprocessableEntityError
}
