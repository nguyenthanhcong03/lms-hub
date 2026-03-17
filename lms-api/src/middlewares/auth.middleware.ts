import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/auth'
import { User, UserStatus } from '../models'
import { AuthenticationError, ErrorCodes } from '../utils/errors'

// Extend Express Request interface to include user

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      throw new AuthenticationError('Access token là bắt buộc', ErrorCodes.TOKEN_INVALID)
    }

    // Xác minh token
    const decoded = verifyToken(token) as { userId: string }

    // Kiểm tra người dùng có tồn tại và đang hoạt động không
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      throw new AuthenticationError('Token không hợp lệ - không tìm thấy người dùng', ErrorCodes.USER_NOT_FOUND)
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new AuthenticationError('Tài khoản chưa được kích hoạt', ErrorCodes.ACCOUNT_INACTIVE)
    }

    if (user.status === UserStatus.BANNED) {
      throw new AuthenticationError('Tài khoản đã bị cấm', ErrorCodes.ACCOUNT_BANNED)
    }

    // Gắn thông tin người dùng vào request
    req.user = {
      userId: user._id.toString(),
      roles: user.roles.map((role) => role.toString())
    }

    next()
  } catch (error) {
    // Nếu đây đã là lỗi tùy chỉnh của hệ thống thì chuyển cho middleware xử lý lỗi
    if (error instanceof AuthenticationError) {
      return next(error)
    }

    next(new AuthenticationError('Token không hợp lệ', ErrorCodes.TOKEN_INVALID))
  }
}
