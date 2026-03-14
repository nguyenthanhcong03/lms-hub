import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '~/core/error.response'

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError('You do not have permission to access this resource')
    }

    next()
  }
}

export default authorizeRoles
