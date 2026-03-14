import { model, Schema } from 'mongoose'
import mongoose from 'mongoose'

const CartItemSchema = new Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const CartItemModel = mongoose.model('CartItem', CartItemSchema)

export default CartItemModel
