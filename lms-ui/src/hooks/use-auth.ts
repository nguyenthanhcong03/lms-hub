import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/services/auth'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterRequest,
  LoginRequest
} from '@/services/auth'
import { ROUTE_CONFIG } from '@/configs/routes'

// Khóa truy vấn cho auth
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const
}

// Hook để get current user profile
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => AuthService.getAuthMe()
  })
}

// Các hook mutation
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: { token: string }) => AuthService.verifyEmail(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Xác minh email thành công!')
    }
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { getCurrentUser } = useAuthStore()

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => AuthService.updateProfile(profileData),
    onSuccess: async () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      // Also update auth store
      await getCurrentUser()
      toast.success('Cập nhật hồ sơ thành công!')
    },
    onError: (error) => {
      toast.error(error?.message || 'Không cập nhật được hồ sơ')
    }
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordRequest) => AuthService.changePassword(passwordData),
    onSuccess: (response) => {
      toast.success(response.message || 'Đổi mật khẩu thành công!')
    },
    onError: (error) => {
      toast.error(error?.message || 'Không đổi được mật khẩu')
    }
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (emailData: ForgotPasswordRequest) => AuthService.forgotPassword(emailData),
    onSuccess: () => {
      toast.success('Đã gửi email đặt lại mật khẩu thành công!')
    },
    onError: (error) => {
      toast.error(error?.message || 'Không gửi được email đặt lại mật khẩu. Vui lòng thử lại.')
    }
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (resetData: ResetPasswordRequest) => AuthService.resetPassword(resetData),
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!')
    },
    onError: (error) => {
      toast.error(error?.message || 'Không đặt lại được mật khẩu. Vui lòng thử lại.')
    }
  })
}

// Regular registration hook
export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.')
      router.push(ROUTE_CONFIG.AUTH.SIGN_IN)
    },
    onError: (error) => {
      toast.error(error?.message || 'Registration failed. Please try again.')
    }
  })
}

// Direct login hook (bypasses NextAuth)
export function useLogin() {
  const { getCurrentUser } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: async (response) => {
      // Handle the login response data directly
      if (response && response.token) {
        // Store access token only. Refresh token is handled via httpOnly cookie.
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', response.token)
        }

        await getCurrentUser()
        toast.success('Đăng nhập thành công!')
      } else {
        toast.error('Phản hồi đăng nhập không hợp lệ')
      }
    },
    onError: (error) => {
      toast.error(error?.message || 'Login failed. Please try again.')
    }
  })
}
