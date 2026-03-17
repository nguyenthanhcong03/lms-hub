'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'
import { MdNotifications, MdSecurity } from 'react-icons/md'
import PasswordChangeDialog from './password-change-dialog'

// Thành phần tab cài đặt - Hàm mũi tên
const SettingsTab = () => {
  const user = useAuthStore((state) => state.user)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  // Trạng thái cài đặt tạm - thay bằng quản lý state thực tế
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    darkMode: false,
    language: 'vi'
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    // Tại đây có thể gọi API để lưu cài đặt
  }

  if (!user) return null

  return (
    <div className='space-y-6 sm:space-y-8'>
      {/* Tiêu đề */}
      <div>
        <h1 className='mb-1 text-xl font-bold sm:mb-2 sm:text-2xl'>Cài đặt</h1>
        <p className='text-muted-foreground text-sm sm:text-base'>Quản lý cài đặt tài khoản và tùy chọn cá nhân</p>
      </div>

      <div className='grid gap-4 sm:gap-6'>
        {/* Cài đặt bảo mật */}
        <Card>
          <CardHeader className='px-4 py-4 sm:px-6 sm:py-6'>
            <div className='flex items-center gap-2'>
              <MdSecurity className='h-4 w-4 sm:h-5 sm:w-5' />
              <CardTitle className='text-base sm:text-lg'>Bảo mật</CardTitle>
            </div>
            <CardDescription className='text-xs sm:text-sm'>Quản lý cài đặt bảo mật tài khoản</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 px-4 pb-4 sm:space-y-4 sm:px-6 sm:pb-6'>
            <div className='flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4'>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium sm:text-base'>Mật khẩu</p>
                <p className='text-muted-foreground truncate text-xs sm:text-sm'>
                  Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPasswordDialogOpen(true)}
                disabled={user.userType !== 'default'}
                className='h-8 w-full text-xs sm:h-9 sm:w-auto sm:text-sm'
              >
                {user.userType !== 'default' ? 'Không khả dụng' : 'Đổi mật khẩu'}
              </Button>
            </div>

            {user.userType !== 'default' && (
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4 dark:border-blue-800 dark:bg-blue-950/20'>
                <p className='text-xs text-blue-600 sm:text-sm dark:text-blue-400'>
                  <strong>Lưu ý:</strong> Tài khoản của bạn được liên kết với{' '}
                  {user.userType === 'google' ? 'Google' : 'Facebook'}. Vui lòng thay đổi mật khẩu qua tài khoản{' '}
                  {user.userType === 'google' ? 'Google' : 'Facebook'} của bạn.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cài đặt thông báo */}
        <Card>
          <CardHeader className='px-4 py-4 sm:px-6 sm:py-6'>
            <div className='flex items-center gap-2'>
              <MdNotifications className='h-4 w-4 sm:h-5 sm:w-5' />
              <CardTitle className='text-base sm:text-lg'>Thông báo</CardTitle>
            </div>
            <CardDescription className='text-xs sm:text-sm'>Quản lý cách bạn nhận thông báo</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 px-4 pb-4 sm:space-y-6 sm:px-6 sm:pb-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
              <div className='flex-1 space-y-0.5'>
                <Label htmlFor='email-notifications' className='text-sm sm:text-base'>
                  Thông báo qua email
                </Label>
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  Nhận thông báo về khóa học và hoạt động qua email
                </p>
              </div>
              <Switch
                id='email-notifications'
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                className='self-start sm:self-center'
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog đổi mật khẩu */}
      <PasswordChangeDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />
    </div>
  )
}

export default SettingsTab
