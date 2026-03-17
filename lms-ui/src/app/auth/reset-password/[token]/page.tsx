'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Import động cho component form (xác thực phía client, ssr: false)
const ResetPasswordForm = dynamic(() => import('./components/reset-password-form'), {
  ssr: false
})

interface ResetPasswordPageProps {
  params: Promise<{
    token: string
  }>
}

// Trang đặt lại mật khẩu - Arrow function
const ResetPasswordPage = ({ params }: ResetPasswordPageProps) => {
  const resolvedParams = React.use(params)

  return (
    <Card className='gap-4 py-6'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Đặt lại mật khẩu</CardTitle>
        <CardDescription>Nhập mật khẩu mới để hoàn tất quá trình.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={resolvedParams.token} />
      </CardContent>
    </Card>
  )
}

export default ResetPasswordPage
