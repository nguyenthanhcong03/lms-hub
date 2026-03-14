import { z } from 'zod'
import { CouponStatus, CouponType } from '~/constants/enums'

export const couponSchema = z.object({
  title: z.string().nonempty('Title is required'),
  code: z
    .string()
    .nonempty('Code is required')
    .regex(/^[A-Z0-9]{3,10}$/, 'Invalid coupon code'),
  status: z.enum([CouponStatus.ACTIVE, CouponStatus.INACTIVE]).default(CouponStatus.ACTIVE),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  used: z.number().default(0),
  max_uses: z.number().default(0),
  courses: z.array(z.string()).optional(),
  type: z.enum([CouponType.FIXED, CouponType.PERCENT]),
  value: z.number().default(0)
})

export const applyCouponSchema = z.object({
  code: z
    .string()
    .nonempty('Code is required')
    .regex(/^[A-Z0-9]{3,10}$/, 'Invalid coupon code'),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
})
