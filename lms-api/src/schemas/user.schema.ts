import { z } from 'zod'
import { UserStatus, UserType } from '../enums'
import { paginationSchema } from './common.schema'
import mongoose from 'mongoose'

// Schema dữ liệu user cơ bản
const userDataSchema = z.object({
  username: z
    .string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(50, 'Username không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username chỉ được chứa chữ cái, số, dấu gạch dưới và gạch ngang'),
  email: z.string().email('Email không hợp lệ'),
  userType: z.nativeEnum(UserType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  avatar: z.string().url('URL avatar không hợp lệ').optional().or(z.literal(''))
})

// Schema cập nhật user
export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Định dạng user ID không hợp lệ'
    })
  }),
  body: userDataSchema
    .extend({
      password: z
        .string()
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .max(100, 'Mật khẩu không được vượt quá 100 ký tự')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một số')
        .optional(),
      role: z.string().optional()
    })
    .partial()
})

// Schema cập nhật profile (user tự cập nhật)
export const updateProfileSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, 'Username phải có ít nhất 3 ký tự')
        .max(50, 'Username không được vượt quá 50 ký tự')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username chỉ được chứa chữ cái, số, dấu gạch dưới và gạch ngang')
        .optional(),
      email: z.string().email('Email không hợp lệ').optional(),
      password: z
        .string()
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .max(100, 'Mật khẩu không được vượt quá 100 ký tự')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một số')
        .optional(),
      avatar: z.string().url('URL avatar không hợp lệ').optional().or(z.literal(''))
    })
    .refine(
      (data) => {
        // Phải có ít nhất một field
        return Object.keys(data).length > 0
      },
      {
        message: 'Phải cung cấp ít nhất một field'
      }
    )
})

// Schema admin cập nhật user
export const adminUpdateUserSchema = z.object({
  params: z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Định dạng user ID không hợp lệ'
    })
  }),
  body: z
    .object({
      roles: z.array(z.string()).optional(),
      status: z.nativeEnum(UserStatus).optional()
    })
    .refine(
      (data) => {
        // Phải có ít nhất một field
        return data.roles !== undefined || data.status !== undefined
      },
      {
        message: 'Phải cung cấp ít nhất một field (roles hoặc status)'
      }
    )
})

// Schema lấy danh sách user
export const getUsersSchema = z.object({
  query: paginationSchema.extend({
    status: z
      .union([
        z.nativeEnum(UserStatus),
        z.array(z.nativeEnum(UserStatus)),
        z.string().transform((val) => {
          // Xử lý dạng comma-separated hoặc nhiều query params
          if (val.includes(',')) {
            return val.split(',').map((s) => s.trim())
          }
          return val
        })
      ])
      .optional(),
    userType: z
      .union([
        z.nativeEnum(UserType),
        z.array(z.nativeEnum(UserType)),
        z.string().transform((val) => {
          // Xử lý dạng comma-separated hoặc nhiều query params
          if (val.includes(',')) {
            return val.split(',').map((s) => s.trim())
          }
          return val
        })
      ])
      .optional(),
    role: z.string().optional(),
    search: z.string().optional()
  })
})

// Schema lấy user theo ID
export const getUserByIdSchema = z.object({
  params: z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Định dạng user ID không hợp lệ'
    })
  })
})

// Schema xoá user
export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Định dạng user ID không hợp lệ'
    })
  })
})

// Export type để dùng trong controller
export type UpdateUserParams = z.infer<typeof updateUserSchema>['params']
export type UpdateUserBody = z.infer<typeof updateUserSchema>['body']
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>['body']
export type AdminUpdateUserParams = z.infer<typeof adminUpdateUserSchema>['params']
export type AdminUpdateUserBody = z.infer<typeof adminUpdateUserSchema>['body']
export type GetUsersQuery = z.infer<typeof getUsersSchema>['query']
export type GetUserByIdParams = z.infer<typeof getUserByIdSchema>['params']
export type DeleteUserParams = z.infer<typeof deleteUserSchema>['params']
