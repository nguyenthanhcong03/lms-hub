import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import CartService from '~/services/cart.service'

const CartController = {
  addItemToCart: async (req: Request, res: Response) => {
    const userId = req.user?._id as string

    const result = await CartService.addItemToCart(userId, req.body)

    return new OK({
      message: 'Item added to cart successfully',
      data: result
    }).send(res)
  },

  removeItemFromCart: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const courseId = req.params?.id
    const result = await CartService.removeItemFromCart(userId, courseId)
    return new OK({
      message: 'Item removed from cart successfully',
      data: result
    }).send(res)
  },

  getCartByUser: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await CartService.getCartByUser(userId)
    return new OK({
      message: 'Cart retrieved successfully',
      data: result
    }).send(res)
  }
}

export default CartController
