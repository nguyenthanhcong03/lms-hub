'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Import động cho component form (xác thực phía client, ssr: false)
const ForgotPasswordForm = dynamic(() => import('./components/forgot-password-form'), {
  ssr: false
})

// Trang quên mật khẩu - Arrow function
const ForgotPassword = () => {
  return (
    <Card className='gap-4 py-6'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Quên mật khẩu</CardTitle>
        <CardDescription>Không sao, chúng tôi sẽ giúp bạn đặt lại mật khẩu.</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}

export default ForgotPassword
