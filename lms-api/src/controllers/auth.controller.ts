import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { ValidationError } from '../utils/errors'
import { sendSuccess } from '../utils/success'

const REFRESH_COOKIE_NAME = 'refresh_token'

const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/api/v1/auth'
  }
}

export class AuthController {
  // Register a new user
  static async register(req: Request, res: Response): Promise<void> {
    // Validation is now handled by Zod middleware
    const { username, email, password, userType } = req.body

    const result = await AuthService.register({
      username,
      email,
      password,
      userType
    })

    sendSuccess.created(res, result.message)
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    // Validation is now handled by Zod middleware
    const { email, password } = req.body

    const result = await AuthService.login({ email, password })

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())

    sendSuccess.ok(res, 'Đăng nhập thành công', { token: result.token })
  }

  // Refresh access token using refresh token rotation
  static async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken

    if (!refreshToken) {
      throw new ValidationError('Refresh token là bắt buộc')
    }

    const result = await AuthService.refreshToken({ refreshToken })

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())

    sendSuccess.ok(res, 'Làm mới token thành công', { token: result.token })
  }

  // Get user profile
  static async getAuthMe(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const user = await AuthService.getAuthMe(userId)

    sendSuccess.ok(res, 'Lấy hồ sơ thành công', user)
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId
    const { username, avatar } = req.body

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const updatedUser = await AuthService.updateProfile(userId, {
      username,
      avatar
    })

    sendSuccess.ok(res, 'Cập nhật hồ sơ thành công', { user: updatedUser })
  }

  // Change password
  static async changePassword(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId
    // Validation is now handled by Zod middleware
    const { currentPassword, newPassword } = req.body

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    await AuthService.changePassword(userId, {
      currentPassword,
      newPassword
    })

    sendSuccess.ok(res, 'Đổi mật khẩu thành công')
  }

  // Đăng xuất và thu hồi refresh token hiện tại
  static async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    await AuthService.logout(userId)

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...getRefreshCookieOptions(),
      maxAge: 0
    })

    sendSuccess.ok(res, 'Đăng xuất thành công')
  }

  // Verify email
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.body

    const result = await AuthService.verifyEmail(token)

    sendSuccess.ok(res, 'Xác minh email thành công', result.message)
  }

  // Forgot password
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body

    const result = await AuthService.forgotPassword({ email })

    sendSuccess.ok(res, 'Đã gửi email đặt lại mật khẩu thành công', result.message)
  }

  // Reset password
  static async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body

    const result = await AuthService.resetPassword({ token, newPassword })

    sendSuccess.ok(res, result.message)
  }
}
