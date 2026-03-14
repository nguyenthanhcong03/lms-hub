import { model, Schema } from 'mongoose'
import { OrderStatus } from '~/constants/enums'
import { Order } from '~/types/order.type'

const orderSchema = new Schema<Order>(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    total: {
      type: Number
    },
    amount: {
      type: Number
    },
    discount: {
      type: Number,
      default: 0
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    }
  },
  {
    timestamps: true
  }
)

const OrderModel = model<Order>('Order', orderSchema)
export default OrderModel
