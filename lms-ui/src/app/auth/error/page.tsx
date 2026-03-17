'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Loader from '@/components/loader'

// Component bên trong cho trang lỗi xác thực - Arrow function
const AuthErrorInner = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Có vấn đề với cấu hình máy chủ.'
      case 'AccessDenied':
        return 'Truy cập bị từ chối. Bạn không có quyền đăng nhập.'
      case 'Verification':
        return 'Mã xác minh đã hết hạn hoặc đã được sử dụng.'
      case 'Default':
        return 'Đã xảy ra lỗi trong quá trình xác thực.'
      default:
        return 'Đã xảy ra lỗi không xác định trong quá trình xác thực.'
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-destructive text-xl'>Lỗi xác thực</CardTitle>
          <CardDescription>{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <div className='bg-destructive/10 rounded-md p-3'>
              <p className='text-destructive text-sm'>Mã lỗi: {error}</p>
            </div>
          )}
          <div className='space-y-2'>
            <Button asChild className='w-full'>
              <Link href='/auth/sign-in'>Thử lại</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/'>Về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Trang lỗi xác thực - Arrow function
const AuthError = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AuthErrorInner />
    </Suspense>
  )
}

export default AuthError
