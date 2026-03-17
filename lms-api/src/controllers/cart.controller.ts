import { Request, Response } from 'express'
import { CartService, AddToCartInput, UpdateCartItemInput } from '../services/cart.service'
import { sendSuccess } from '../utils/success'
import { ValidationError } from '../utils/errors'

export class CartController {
  /**
   * Get user's cart
   */
  static async getCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const cart = await CartService.getCart(userId)

    sendSuccess.ok(res, 'Cart được lấy thành công', cart)
  }

  /**
   * Add item to cart
   */
  static async addToCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const input: AddToCartInput = req.body

    const cart = await CartService.addToCart(userId, input)

    sendSuccess.created(res, 'Mục được thêm vào giỏ hàng thành công', { cart })
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId
    const { courseId } = req.params

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const cart = await CartService.removeFromCart(userId, courseId)

    sendSuccess.ok(res, 'Đã xóa mục khỏi giỏ hàng thành công', { cart })
  }

  /**
   * Update cart item
   */
  static async updateCartItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId
    const { courseId } = req.params

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const input: UpdateCartItemInput = {
      courseId,
      ...req.body
    }

    const cart = await CartService.updateCartItem(userId, input)

    sendSuccess.ok(res, 'Cart item được cập nhật thành công', { cart })
  }

  /**
   * Clear entire cart
   */
  static async clearCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const cart = await CartService.clearCart(userId)

    sendSuccess.ok(res, 'Giỏ hàng được xóa thành công', { cart })
  }

  /**
   * Get cart summary
   */
  static async getCartSummary(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const summary = await CartService.getCartSummary(userId)

    sendSuccess.ok(res, 'Cart summary được lấy thành công', summary)
  }

  /**
   * Validate cart before checkout
   */
  static async validateCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const validation = await CartService.validateCart(userId)

    sendSuccess.ok(res, 'Cart validation completed', validation)
  }
}
