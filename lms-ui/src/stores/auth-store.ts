'use client'

import { Permission } from '@/configs/permission'
import { AuthService, type CurrentUser } from '@/services/auth'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Dùng kiểu CurrentUser từ auth service
export type AuthUser = CurrentUser

// Trạng thái của auth store
interface AuthState {
  // Trạng thái người dùng
  user: AuthUser | null
  isLoading: boolean

  // Các hành động xác thực
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void

  // Hàm hỗ trợ quyền - chỉ giữ các hàm đang dùng
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Trạng thái khởi tạo
      user: null,
      isLoading: true,

      // Các hành động
      setUser: (user) => {
        set({ user })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      // Lấy thông tin người dùng hiện tại từ /auth/me
      getCurrentUser: async () => {
        try {
          const token = getTokenFromStorage()
          if (!token) {
            set({ isLoading: false, user: null })
            return
          }

          const userData = await AuthService.getAuthMe()

          set({ user: userData, isLoading: false })
          setUserDataToStorage(userData)
        } catch {
          // Xóa token không hợp lệ
          clearTokenFromStorage()
          clearUserDataFromStorage()
          set({ user: null, isLoading: false })
        }
      },

      // Đăng xuất và xóa trạng thái xác thực cục bộ
      logout: async () => {
        try {
          await AuthService.logout()
        } catch {
          // Bỏ qua lỗi mạng/xác thực và luôn xóa trạng thái auth phía client.
        }

        clearTokenFromStorage()
        clearUserDataFromStorage()
        set({ user: null, isLoading: false })
      },

      hasPermission: (permission) => {
        const state = get()
        const userPermissions = state?.user?.userPermissions || []
        return userPermissions.includes(permission)
      },

      hasAnyPermission: (permissions) => {
        const state = get()
        const userPermissions = state?.user?.userPermissions || []
        return permissions.some((perm) => userPermissions.includes(perm))
      }
    }),
    {
      name: 'auth-store'
    }
  )
)

// Hàm trợ giúp quản lý token (chỉ lưu token, không lưu dữ liệu người dùng)
function getTokenFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

function clearTokenFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}

function setUserDataToStorage(user: CurrentUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user))
  }
}

function getUserDataFromStorage(): CurrentUser | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('user_data')
    if (!data) {
      return null
    }

    try {
      return JSON.parse(data) as CurrentUser
    } catch {
      localStorage.removeItem('user_data')
      return null
    }
  }

  return null
}

function clearUserDataFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data')
  }
}
