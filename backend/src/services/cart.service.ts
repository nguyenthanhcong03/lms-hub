import { BadRequestError } from '~/core/error.response'
import CartItemModel from '~/models/cart-item.model'
import CartModel from '../models/cart.model'

const CartService = {
  getCartByUser: async (userId: string) => {
    const cart = await CartModel.findOne({ user: userId })
      .populate({
        path: 'items',
        model: CartItemModel,
        populate: [
          {
            path: 'course',
            model: 'Course'
          }
        ]
      })
      .populate({
        path: 'user',
        model: 'User',
        select: 'name email'
      })

    return cart
  },

  addItemToCart: async (userId: string, itemData: { courseId: string; price: number; quantity: number }) => {
    const { courseId, price, quantity } = itemData
    let cart = await CartModel.findOne({ user: userId }).populate('items')

    if (!cart) {
      cart = new CartModel({ user: userId, items: [], totalPrice: 0 })
    }

    let cartItem = await CartItemModel.findOne({ cart: cart._id, course: courseId })

    if (cartItem) {
      throw new BadRequestError('Course already exists in the cart')
    } else {
      cartItem = new CartItemModel({
        cart: cart._id,
        course: courseId,
        price,
        quantity
      })
      await cartItem.save()
      cart.items.push(cartItem._id)
    }

    cart.total_price = await CartService.calculateTotalPrice(cart._id.toString())
    await cart.save()

    return cart
  },

  removeItemFromCart: async (userId: string, courseId: string) => {
    const cart = await CartModel.findOne({ user: userId }).populate('items')

    if (!cart) {
      throw new Error('Cart not found')
    }

    const cartItem = await CartItemModel.findOne({ cart: cart._id, course: courseId })

    if (!cartItem) {
      throw new Error('Course not found in the cart')
    }

    await CartItemModel.findByIdAndDelete(cartItem._id)

    cart.items = cart.items.filter((item) => item._id.toString() !== cartItem._id.toString())

    cart.total_price = await CartService.calculateTotalPrice(cart._id.toString())
    await cart.save()

    return cart
  },

  calculateTotalPrice: async (cartId: string) => {
    const items = await CartItemModel.find({ cart: cartId })
    return items.reduce((total, item) => total + item.quantity * item.price, 0)
  }
}

export default CartService
