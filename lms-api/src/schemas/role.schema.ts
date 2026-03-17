import { z } from 'zod'
import { ALL_PERMISSIONS } from '~/configs/permission'

/**
 * Schema validation cho Role
 */

// Schema tạo role
export const createRoleSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Tên role phải có ít nhất 2 ký tự')
      .max(50, 'Tên role không được vượt quá 50 ký tự')
      .regex(/^[a-zA-Z\s]+$/, 'Tên role chỉ được chứa chữ cái và khoảng trắng'),
    description: z.string().min(5, 'Mô tả phải có ít nhất 5 ký tự').max(200, 'Mô tả không được vượt quá 200 ký tự'),
    permissions: z.array(z.enum(ALL_PERMISSIONS as [string, ...string[]])).optional()
  })
})

// Schema cập nhật role
export const updateRoleSchema = z.object({
  params: z.object({
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Định dạng role ID không hợp lệ')
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'Tên role phải có ít nhất 2 ký tự')
      .max(50, 'Tên role không được vượt quá 50 ký tự')
      .regex(/^[a-zA-Z\s]+$/, 'Tên role chỉ được chứa chữ cái và khoảng trắng')
      .optional(),
    description: z
      .string()
      .min(5, 'Mô tả phải có ít nhất 5 ký tự')
      .max(200, 'Mô tả không được vượt quá 200 ký tự')
      .optional(),
    permissions: z.array(z.enum(ALL_PERMISSIONS as [string, ...string[]])).optional()
  })
})

// Schema lấy role theo ID
export const getRoleByIdSchema = z.object({
  params: z.object({
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Định dạng role ID không hợp lệ')
  })
})

// Schema xoá role
export const deleteRoleSchema = z.object({
  params: z.object({
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Định dạng role ID không hợp lệ')
  })
})

// Schema query danh sách role
export const getRolesSchema = z.object({
  query: z.object({
    includeInheritance: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || val === 'true' || val === 'false',
        'includeInheritance phải là true hoặc false'
      )
  })
})

// Schema lấy quyền của user
export const getUserPermissionsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Định dạng user ID không hợp lệ')
  })
})
