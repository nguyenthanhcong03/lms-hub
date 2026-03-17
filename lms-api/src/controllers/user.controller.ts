import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { AppError } from '../utils/errors'
import { sendSuccess } from '../utils/success'

export class UserController {
  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(req: Request, res: Response) {
    const result = await UserService.getUsers(req.query)

    sendSuccess.ok(res, 'Users được lấy thành công', result)
  }

  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response) {
    const result = await UserService.getUserById(req.params.userId)

    sendSuccess.ok(res, 'User được lấy thành công', result)
  }

  /**
   * Update user (admin-level updates)
   */
  static async updateUser(req: Request, res: Response) {
    const result = await UserService.updateUser(req.params.userId, req.body)

    sendSuccess.ok(res, 'User được cập nhật thành công', result)
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(req: Request, res: Response) {
    await UserService.deleteUser(req.params.userId)

    sendSuccess.ok(res, 'User được xóa thành công')
  }

  /**
   * Get current user profile (from token)
   */
  static async getCurrentUser(req: Request, res: Response) {
    // Get user ID from request (set by auth middleware)
    const userId = req.user?.userId

    if (!userId) {
      throw new AppError('Người dùng chưa được xác thực', 401)
    }

    const result = await UserService.getUserById(userId)

    sendSuccess.ok(res, 'Current user profile được lấy thành công', result)
  }

  /**
   * Update current user profile (from token)
   */
  static async updateProfile(req: Request, res: Response) {
    // Get user ID from request (set by auth middleware)
    const userId = req.user?.userId

    if (!userId) {
      throw new AppError('Người dùng chưa được xác thực', 401)
    }

    const result = await UserService.updateProfile(userId, req.body)

    sendSuccess.ok(res, 'Cập nhật hồ sơ thành công', result)
  }
}
