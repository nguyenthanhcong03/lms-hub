import * as yup from 'yup'
export const roleSchema = yup
  .object({
    name: yup
      .string()
      .required('Tên vai trò là bắt buộc')
      .min(2, 'Tên vai trò phải có ít nhất 2 ký tự')
      .max(50, 'Tên vai trò không được vượt quá 50 ký tự')
      .matches(
        /^[a-zA-Z0-9\s\-_]+$/,
        'Tên vai trò chỉ được chứa chữ cái, số, khoảng trắng, dấu gạch ngang và dấu gạch dưới'
      ),
    description: yup
      .string()
      .required('Mô tả là bắt buộc')
      .min(10, 'Mô tả phải có ít nhất 10 ký tự')
      .max(200, 'Mô tả không được vượt quá 200 ký tự'),
    permissions: yup.array().of(yup.string().required()).default([]).optional()
  })
  .required()

export type RoleSchema = yup.InferType<typeof roleSchema>
