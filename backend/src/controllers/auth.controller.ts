import { Request, Response } from 'express'
import { CREATED, OK } from '~/core/success.response'
import AuthService from '~/services/auth.service'

const AuthController = {
  register: async (req: Request, res: Response) => {
    const payload = req.body
    const result = await AuthService.register(payload)

    return new CREATED({
      message: 'User registered successfully',
      data: result
    }).send(res)
  },

  login: async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body)

    return new OK({
      message: 'User logged in successfully',
      data: result
    }).send(res)
  },

  getAuthMe: async (req: Request, res: Response) => {
    const userId = req.user?._id as string

    const result = await AuthService.getAuthMe(userId)

    return new OK({
      message: 'User profile retrieved successfully',
      data: result
    }).send(res)
  },

  updateAuthMe: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await AuthService.updateAuthMe(userId, req.body)

    return new OK({
      message: 'User profile updated successfully',
      data: result
    }).send(res)
  },

  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    const result = await AuthService.refreshToken(refreshToken)

    return new OK({
      message: 'Token refreshed successfully',
      data: result
    }).send(res)
  }
}

export default AuthController
