import { NextFunction, Request, Response } from 'express'
import { CatchAsyncError } from './catch-async-errors.middleware'
import { AuthFailureError } from '~/core/error.response'
import { verifyToken } from '~/utils/jwt'
import { User } from '~/types/user.type'

// authenticated user
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) throw new AuthFailureError('Invalid token')

    const token = authHeader.split(' ')[1]

    if (!token) throw new AuthFailureError('Invalid token')

    const decoded = verifyToken({ token, secret: process.env.ACCESS_TOKEN_SECRET || '' })

    req.user = decoded as User

    next()
  } catch (error) {
    if ((error as { message?: string })?.message?.includes('jwt expired')) {
      throw new AuthFailureError('Token expired')
    }

    throw new AuthFailureError('Invalid token')
  }
})
