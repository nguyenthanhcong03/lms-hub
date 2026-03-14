import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ZodTypeAny, z } from 'zod'
import { UnprocessableEntityError } from '~/core/error.response'
import { CatchAsyncError } from './catch-async-errors.middleware'

const validate = (schema: ZodTypeAny, source: 'body' | 'params' | 'query'): RequestHandler => {
  return CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[source])
      next()
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new UnprocessableEntityError(
          `Invalid ${source} schema`,
          err.errors.map((error) => ({
            message: error.message,
            field: error.path.join('.')
          }))
        )
      } else {
        next(err)
      }
    }
  })
}

const validateRequestBody = (schema: ZodTypeAny): RequestHandler => {
  return validate(schema, 'body')
}

const validateRequestParams = (schema: ZodTypeAny): RequestHandler => {
  return validate(schema, 'params')
}

const validateRequestQuery = (schema: ZodTypeAny): RequestHandler => {
  return validate(schema, 'query')
}

export { validateRequestBody, validateRequestParams, validateRequestQuery }
