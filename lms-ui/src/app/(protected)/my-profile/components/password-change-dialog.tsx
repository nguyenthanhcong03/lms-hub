'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/password-input'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { AuthService, ChangePasswordRequest } from '@/services/auth'

// Schema xác thực cho đổi mật khẩu
const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: yup
    .string()
    .required('Mật khẩu mới là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu mới')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>

interface PasswordChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Thành phần dialog đổi mật khẩu - Hàm mũi tên
const PasswordChangeDialog = ({ open, onOpenChange }: PasswordChangeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore((state) => state.user)

  const form = useForm<PasswordChangeFormData>({
    resolver: yupResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true)
    try {
      const changePasswordData: ChangePasswordRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }

      await AuthService.changePassword(changePasswordData)
      toast.success('Đổi mật khẩu thành công!')
      form.reset()
      onOpenChange(false)

      // Có thể đăng xuất để buộc xác thực lại bằng mật khẩu mới
      // Đây là thực hành bảo mật tốt cho thao tác nhạy cảm
      toast.info('Vui lòng đăng nhập lại bằng mật khẩu mới để đảm bảo an toàn.')
      setTimeout(() => {
        useAuthStore.getState().logout()
      }, 2000)
    } catch (error) {
      console.error('Password change error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại và thử lại.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Chỉ hiển thị đổi mật khẩu cho tài khoản mặc định (không phải đăng nhập mạng xã hội)
  if (user?.userType !== 'default') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-lg sm:text-xl'>Đổi mật khẩu</DialogTitle>
            <DialogDescription className='text-xs sm:text-sm'>
              Tính năng đổi mật khẩu không khả dụng với tài khoản đăng nhập mạng xã hội.
            </DialogDescription>
          </DialogHeader>

          <div className='px-4 py-4 text-center sm:py-6'>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Tài khoản của bạn đang liên kết với {user?.userType === 'google' ? 'Google' : 'Facebook'}. Vui lòng thay
              đổi mật khẩu trực tiếp trong cài đặt tài khoản {user?.userType === 'google' ? 'Google' : 'Facebook'}.
            </p>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='h-9 w-full text-sm sm:h-10 sm:w-auto'
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl'>Đổi mật khẩu</DialogTitle>
          <DialogDescription className='text-xs sm:text-sm'>
            Cập nhật mật khẩu tài khoản của bạn. Hãy dùng mật khẩu đủ mạnh.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 sm:space-y-4'>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isLoading}
                      placeholder='Nhập mật khẩu hiện tại'
                      className='h-10 text-sm'
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isLoading}
                      placeholder='Nhập mật khẩu mới'
                      className='h-10 text-sm'
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isLoading}
                      placeholder='Nhập lại mật khẩu mới'
                      className='h-10 text-sm'
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            {/* Yêu cầu mật khẩu */}
            <div className='bg-muted rounded-lg p-2.5 sm:p-3'>
              <p className='mb-1.5 text-xs font-medium sm:mb-2 sm:text-sm'>Yêu cầu mật khẩu:</p>
              <ul className='text-muted-foreground space-y-0.5 text-[10px] sm:space-y-1 sm:text-xs'>
                <li>• Có ít nhất 8 ký tự</li>
                <li>• Có ít nhất một chữ cái viết hoa</li>
                <li>• Có ít nhất một chữ cái viết thường</li>
                <li>• Có ít nhất một chữ số</li>
              </ul>
            </div>

            <DialogFooter className='flex-col gap-2 sm:flex-row'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
                disabled={isLoading}
                className='h-9 w-full text-sm sm:h-10 sm:w-auto'
              >
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading} className='h-9 w-full text-sm sm:h-10 sm:w-auto'>
                {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordChangeDialog
