import { BlogStatus } from '@/types/blog'
import * as yup from 'yup'

export const blogSchema = yup
  .object({
    title: yup.string().required('Tiêu đề là bắt buộc').min(3).max(200),
    slug: yup
      .string()
      .required('Slug là bắt buộc')
      .matches(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
    content: yup.string().required('Nội dung là bắt buộc').min(50, 'Nội dung phải có ít nhất 50 ký tự'),
    excerpt: yup.string().required('Mô tả ngắn là bắt buộc').min(10).max(300),
    thumbnail: yup
      .string()
      .optional()
      .default('')
      .test('is-url', 'Thumbnail phải là một URL hợp lệ', (value) => !value || yup.string().url().isValidSync(value)),
    status: yup.mixed<BlogStatus>().oneOf(Object.values(BlogStatus)).required('Trạng thái là bắt buộc'),
    publishedAt: yup
      .date()
      .required('Ngày xuất bản là bắt buộc')
      .test('is-valid-date', 'Phải là một ngày hợp lệ', function (value) {
        return value instanceof Date && !isNaN(value.getTime())
      }),
    categoryId: yup.string().required('Danh mục là bắt buộc')
  })
  .required()

export type BlogSchema = yup.InferType<typeof blogSchema>
