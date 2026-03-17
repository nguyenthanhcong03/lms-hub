import { z } from 'zod'

// Các schema validate dùng chung

export const emailSchema = z.string().email('Vui lòng cung cấp email hợp lệ').min(1, 'Email là bắt buộc')

export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số')

export const usernameSchema = z
  .string()
  .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
  .max(30, 'Tên người dùng không được vượt quá 30 ký tự')
  .regex(/^[a-zA-Z0-9_]+$/, 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới')

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Định dạng ObjectId không hợp lệ')

// Schema phân trang
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, 'Page phải là số dương'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, 'Limit phải nằm trong khoảng từ 1 đến 100'),
  search: z.string().optional(),
  sort: z.string().optional()
})
