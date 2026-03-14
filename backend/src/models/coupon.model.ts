import { model, Schema } from 'mongoose'
import { CouponStatus, CouponType } from '~/constants/enums'
import { Coupon } from '~/types/coupon.type'

const couponSchema = new Schema<Coupon>(
  {
    title: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: Object.values(CouponStatus),
      default: CouponStatus.ACTIVE
    },
    start_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    used: {
      type: Number,
      default: 0
    },
    max_uses: {
      type: Number,
      default: 0
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    type: {
      type: String,
      enum: Object.values(CouponType),
      default: CouponType.PERCENT
    },
    value: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const CouponModel = model<Coupon>('Coupon', couponSchema)

export default CouponModel
