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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { AuthService, CurrentUser, UpdateProfileRequest } from '@/services/auth'
import { UploadService } from '@/services/upload'
import { MdDelete } from 'react-icons/md'
import { DEFAULT_AVATAR } from '@/constants'

// Schema xác thực cho chỉnh sửa hồ sơ
const profileSchema = yup.object({
  username: yup
    .string()
    .required('Tên người dùng là bắt buộc')
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(50, 'Tên người dùng không được vượt quá 50 ký tự')
    .trim(),
  email: yup.string().required('Email là bắt buộc').email('Vui lòng nhập địa chỉ email hợp lệ').trim()
})

type ProfileFormData = yup.InferType<typeof profileSchema>

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: CurrentUser
}

// Thành phần dialog chỉnh sửa hồ sơ - Hàm mũi tên
const ProfileEditDialog = ({ open, onOpenChange, user }: ProfileEditDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const { getCurrentUser } = useAuthStore()

  const form = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: user.username || '',
      email: user.email || ''
    }
  })

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh')
      event.target.value = ''
      return
    }

    try {
      setIsUploadingAvatar(true)
      const uploaded = await UploadService.uploadImage(file, 'avatars')
      setAvatarUrl(uploaded.url)
      toast.success('Tải lên ảnh đại diện thành công!')
    } catch (error) {
      console.error('Avatar upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải lên ảnh đại diện. Vui lòng thử lại.'
      toast.error(errorMessage)
    } finally {
      setIsUploadingAvatar(false)
      event.target.value = ''
    }
  }

  const handleAvatarDelete = async () => {
    try {
      setIsDeletingAvatar(true)

      // Xóa trạng thái avatar cục bộ
      setAvatarUrl('')

      // Cập nhật hồ sơ để xóa avatar
      const updateData: UpdateProfileRequest = {
        username: user.username,
        email: user.email,
        avatar: '' // Xóa avatar
      }

      await AuthService.updateProfile(updateData)
      toast.success('Đã xóa ảnh đại diện thành công!')

      // Làm mới dữ liệu người dùng
      await getCurrentUser()
    } catch (error) {
      console.error('Avatar delete error:', error)
      toast.error('Không xóa được ảnh đại diện. Vui lòng thử lại.')
    } finally {
      setIsDeletingAvatar(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      // Cập nhật hồ sơ bằng auth service
      const updateData: UpdateProfileRequest = {
        username: data.username,
        email: data.email
      }

      // Chỉ thêm avatar nếu vừa tải avatar mới
      if (avatarUrl) {
        updateData.avatar = avatarUrl
      }

      await AuthService.updateProfile(updateData)
      toast.success('Cập nhật hồ sơ thành công!')

      // Làm mới dữ liệu người dùng để lấy thông tin mới nhất
      await getCurrentUser()
      onOpenChange(false)
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Không cập nhật được hồ sơ. Vui lòng thử lại.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý URL avatar - lấy từ avatar hiện có hoặc avatar mới tải lên
  const currentAvatarUrl = user.avatar || DEFAULT_AVATAR
  const displayAvatarUrl = avatarUrl || currentAvatarUrl
  const userInitials = user.username ? user.username.slice(0, 2).toUpperCase() : 'U'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl'>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription className='text-xs sm:text-sm'>
            Cập nhật thông tin cá nhân và ảnh đại diện của bạn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6'>
            {/* Khu vực ảnh đại diện */}
            <Card>
              <CardContent className='px-4 pt-4 sm:px-6 sm:pt-6'>
                <div className='flex flex-col items-center space-y-3 sm:space-y-4'>
                  <div className='group relative'>
                    <Avatar className='h-20 w-20 sm:h-24 sm:w-24'>
                      <AvatarImage src={displayAvatarUrl} alt={user.username || 'Người dùng'} />
                      <AvatarFallback className='bg-primary text-primary-foreground text-lg sm:text-xl'>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Lớp phủ icon xóa - chỉ hiển thị khi có avatar tùy chỉnh và khi hover */}
                    {currentAvatarUrl !== DEFAULT_AVATAR && (
                      <Button
                        type='button'
                        size='sm'
                        variant='destructive'
                        onClick={handleAvatarDelete}
                        disabled={isDeletingAvatar || isLoading}
                        className='absolute top-0 right-0 h-5 w-5 rounded-full p-0 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 disabled:hover:scale-100 sm:h-6 sm:w-6'
                      >
                        <MdDelete className='h-3 w-3' />
                      </Button>
                    )}
                  </div>

                  {/* Nút tải lên - chỉ hiển thị khi avatar đang trống */}
                  {currentAvatarUrl === DEFAULT_AVATAR && !isLoading && !isDeletingAvatar && (
                    <div>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={handleAvatarFileChange}
                        disabled={isUploadingAvatar}
                        className='w-full max-w-60 text-xs sm:text-sm'
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <div className='space-y-3 sm:space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} className='h-10 text-sm' />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' disabled={isLoading} className='h-10 text-sm' />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='flex-col gap-2 sm:flex-row'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className='h-9 w-full text-sm sm:h-10 sm:w-auto'
              >
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading} className='h-9 w-full text-sm sm:h-10 sm:w-auto'>
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileEditDialog
