import { NextFunction, Request, RequestHandler, Response } from 'express'

export const CatchAsyncError = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
