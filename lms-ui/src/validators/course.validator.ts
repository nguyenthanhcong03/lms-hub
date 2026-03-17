import { CourseLevel, CourseStatus } from '@/types/course'
import * as yup from 'yup'

const courseFormSchema = yup.object({
  title: yup
    .string()
    .required('Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(100, 'Tiêu đề phải dưới 100 ký tự'),

  slug: yup
    .string()
    .required('Slug là bắt buộc')
    .matches(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),

  excerpt: yup
    .string()
    .default('')
    .test('max-length', 'Mô tả ngắn phải dưới 300 ký tự', (value) => !value || value.length <= 300),

  description: yup
    .string()
    .default('')
    .test('min-length-if-provided', 'Mô tả phải có ít nhất 10 ký tự', (value) => !value || value.length >= 10),

  image: yup
    .string()
    .default('')
    .test('is-url', 'Phải là URL hợp lệ', (value) => !value || yup.string().url().isValidSync(value)),

  introUrl: yup
    .string()
    .default('')
    .test('is-url', 'Phải là URL hợp lệ', (value) => !value || yup.string().url().isValidSync(value)),

  price: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .default(0)
    .test('required-when-not-free', 'Giá là bắt buộc với khóa học trả phí', function (value) {
      const { isFree } = this.parent
      if (!isFree && (!value || value <= 0)) {
        return false
      }
      return true
    })
    .test('reasonable-price', 'Giá có vẻ quá cao (tối đa 1.000.000.000 ₫)', function (value) {
      const { isFree } = this.parent
      if (!isFree && value) {
        return value <= 1000000000
      }
      return true
    }),

  oldPrice: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .default(0)
    .test('greater-than-price', 'Giá cũ phải lớn hơn giá hiện tại', function (value) {
      const { price, isFree } = this.parent
      if (!isFree && value && value > 0 && price) {
        return value > price
      }
      return true
    })
    .test('reasonable-old-price', 'Giá cũ có vẻ quá cao (tối đa 1.000.000.000 ₫)', function (value) {
      if (value && value > 0) {
        return value <= 1000000000
      }
      return true
    }),

  isFree: yup.boolean().required('Trạng thái miễn phí là bắt buộc'),

  status: yup.mixed<CourseStatus>().oneOf(Object.values(CourseStatus)).required('Trạng thái là bắt buộc'),

  categoryId: yup.string().required('Danh mục là bắt buộc'),

  level: yup.mixed<CourseLevel>().oneOf(Object.values(CourseLevel)).required('Trình độ là bắt buộc')
})

export type CourseSchema = yup.InferType<typeof courseFormSchema>
export { courseFormSchema }
