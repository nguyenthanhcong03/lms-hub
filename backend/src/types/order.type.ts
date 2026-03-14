import { Document, Schema } from 'mongoose'
import { OrderStatus } from '~/constants/enums'

export interface Order extends Document {
  _id: string
  code: string
  course: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  status: OrderStatus
  created_at: Date
  total: number
  amount: number
  discount: number
  coupon?: Schema.Types.ObjectId
}

export type OrderQueryParams = {
  limit?: number | string
  page?: number | string
  search?: string
  status?: string
}

export interface CreateOrderParams {
  code: string
  course: string
  user: string
  total?: number
  amount?: number
  discount?: number
  coupon?: string
  cartItemId: string
}
export interface UpdateOrderParams {
  orderId: string
  status: OrderStatus
}
