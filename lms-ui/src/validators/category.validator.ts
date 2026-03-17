import { CategoryStatus } from '@/types/category'
import * as yup from 'yup'

const categorySchema = yup
  .object({
    name: yup
      .string()
      .required('Tên danh mục là bắt buộc')
      .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
      .max(50, 'Tên danh mục không được vượt quá 50 ký tự')
      .matches(
        /^[a-zA-Z0-9\s\-_]+$/,
        'Tên danh mục chỉ được chứa chữ cái, số, khoảng trắng, dấu gạch ngang và dấu gạch dưới'
      ),
    slug: yup
      .string()
      .required('Slug là bắt buộc')
      .min(2, 'Slug phải có ít nhất 2 ký tự')
      .max(50, 'Slug không được vượt quá 50 ký tự')
      .matches(/^[a-z0-9\-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
    status: yup.mixed<CategoryStatus>().oneOf(Object.values(CategoryStatus)).required('Trạng thái là bắt buộc')
  })
  .required()

export type CategorySchema = yup.InferType<typeof categorySchema>
export { categorySchema }
