import { Document, Schema } from 'mongoose'
import { CouponStatus, CouponType } from '~/constants/enums'

export interface Coupon extends Document {
  _id: string
  title: string
  code: string
  status: CouponStatus
  used: number
  start_date: Date
  end_date: Date
  max_uses: number
  courses: Schema.Types.ObjectId[]
  type: CouponType
  value: number
}

export type CouponQueryParams = {
  page?: number | string
  limit?: number | string
  search?: string
  status?: CouponStatus
  type?: CouponType
}

export type CreateCouponParams = {
  title: string
  code: string
  type: CouponType
  start_date: Date
  end_date: Date
  value?: number
  status?: boolean
  max_uses?: number
  courses?: string[]
}
