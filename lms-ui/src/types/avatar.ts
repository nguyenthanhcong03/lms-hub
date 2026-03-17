export interface AvatarProps {
  src?: string
  alt: string
  fallbackText?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export interface UserAvatar {
  url?: string
  publicId?: string
  uploadedAt?: string
  mimeType?: string
  size?: number // Kích thước tệp (byte)
}

// Phản hồi khi tải avatar lên
export interface AvatarUploadResponse {
  success: boolean
  avatar: UserAvatar
  message?: string
}

// Cấu hình kích thước avatar
export const AVATAR_SIZES = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg'
} as const

export type AvatarSize = keyof typeof AVATAR_SIZES

// Cấu hình avatar mặc định
export const DEFAULT_AVATAR_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  dimensions: {
    width: 400,
    height: 400
  }
} as const
