import { z } from 'zod'
import { emailSchema, passwordSchema, usernameSchema } from './common.schema'

// Auth request schemas
export const registerSchema = z.object({
  body: z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
  })
})

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
  })
})

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required').optional()
  })
})

export const updateProfileSchema = z.object({
  body: z.object({
    username: usernameSchema.optional(),
    avatar: z.string().optional()
  })
})

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema
  })
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema
  })
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: passwordSchema
  })
})

// Auth response types (inferred from schemas)
export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>
