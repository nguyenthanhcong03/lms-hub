import { DiscountType } from '@/types/coupon'
import * as yup from 'yup'

const couponFormSchema = yup
  .object({
    title: yup
      .string()
      .required('Tiêu đề là bắt buộc')
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(100, 'Tiêu đề phải dưới 100 ký tự'),

    code: yup
      .string()
      .required('Mã là bắt buộc')
      .min(3, 'Mã phải có ít nhất 3 ký tự')
      .max(50, 'Mã phải dưới 50 ký tự')
      .matches(/^[A-Z0-9_-]+$/, 'Mã chỉ được chứa chữ in hoa, số, dấu gạch ngang và dấu gạch dưới'),

    discountType: yup.string().oneOf(Object.values(DiscountType)).required('Loại giảm giá là bắt buộc'),

    discountValue: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .required('Giá trị giảm giá là bắt buộc')
      .min(0.01, 'Giá trị giảm giá phải lớn hơn 0')
      .test('valid-percentage', 'Phần trăm phải nằm trong khoảng từ 1 đến 100', function (value) {
        const { discountType } = this.parent
        if (discountType === DiscountType.PERCENT && value > 100) {
          return false
        }
        return true
      }),

    courseIds: yup.array().of(yup.string().required()).default([]),

    minPurchaseAmount: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .min(0, 'Giá trị mua tối thiểu phải là số dương')
      .default(0),

    maxUses: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .min(1, 'Số lượt dùng tối đa phải từ 1 trở lên')
      .required('Số lượt dùng tối đa là bắt buộc'),

    startDate: yup
      .date()
      .required('Ngày bắt đầu là bắt buộc')
      .default(() => new Date()),

    endDate: yup
      .date()
      .nullable()
      .default(null)
      .test('end-after-start', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
        const { startDate } = this.parent
        if (value && startDate && new Date(value) <= new Date(startDate)) {
          return false
        }
        return true
      }),

    isActive: yup.boolean().default(true)
  })
  .required()

export type CouponSchema = yup.InferType<typeof couponFormSchema>
export { couponFormSchema }
