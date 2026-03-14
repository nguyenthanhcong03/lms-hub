// schemas/user.schema.ts
import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().nonempty('Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const updateAuthMeSchema = z
  .object({
    username: z
      .string()
      .optional()
      .refine((val) => val === undefined || val.trim() !== '', {
        message: 'Username is required if provided'
      }),
    avatar: z.string().optional(),
    phone: z.string().optional()
  })
  .strict()
