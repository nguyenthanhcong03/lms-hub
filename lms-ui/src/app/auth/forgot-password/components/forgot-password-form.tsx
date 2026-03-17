'use client'
import { HTMLAttributes, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForgotPassword } from '@/hooks/use-auth'
import { AlertCircle, CheckCircle, Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { ROUTE_CONFIG } from '@/configs/routes'

type ForgotPasswordFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = yup.object({
  email: yup.string().required('Vui lòng nhập địa chỉ email của bạn').email('Vui lòng nhập email hợp lệ')
})

type FormData = yup.InferType<typeof formSchema>

// Component form quên mật khẩu
const ForgotPasswordForm = ({ className, ...props }: ForgotPasswordFormProps) => {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(data: FormData) {
    try {
      await forgotPasswordMutation.mutateAsync(data)
      setIsEmailSent(true)
    } catch {
      // Xử lý lỗi đã được thực hiện trong hook
    }
  }

  function handleSendAnother() {
    setIsEmailSent(false)
    form.reset()
  }

  if (isEmailSent) {
    return (
      <div className={cn('grid gap-6', className)}>
        <Alert className='border-green-200 bg-green-50'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-800'>
            <strong>Gửi email thành công!</strong>
            <br />
            Chúng tôi đã gửi liên kết đặt lại mật khẩu tới <strong>{form.getValues('email')}</strong>. Vui lòng kiểm tra
            hộp thư và làm theo hướng dẫn để đặt lại mật khẩu.
          </AlertDescription>
        </Alert>

        <div className='space-y-4 text-center'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <Mail className='h-6 w-6 text-green-600' />
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm'>Không nhận được email? Kiểm tra thư rác hoặc</p>
            <Button variant='outline' onClick={handleSendAnother} disabled={forgotPasswordMutation.isPending}>
              Gửi lại email
            </Button>
          </div>

          <div className='border-t pt-4'>
            <p className='text-muted-foreground text-sm'>
              Nhớ mật khẩu?{' '}
              <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} className='text-primary hover:underline'>
                Về trang đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-6', className)} {...props}>
        <div className='space-y-2 text-center'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <AlertCircle className='h-6 w-6 text-blue-600' />
            </div>
          </div>
          <p className='text-muted-foreground text-sm'>
            Nhập địa chỉ email và chúng tôi sẽ gửi cho bạn liên kết đặt lại mật khẩu.
          </p>
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa Chỉ Email</FormLabel>
              <FormControl>
                <Input placeholder='Nhập email của bạn' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={forgotPasswordMutation.isPending} className='w-full'>
          {forgotPasswordMutation.isPending ? 'Đang gửi...' : 'Đặt lại mật khẩu'}
        </Button>

        <div className='text-center'>
          <p className='text-muted-foreground text-sm'>
            Nhớ mật khẩu?{' '}
            <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} className='text-primary hover:underline'>
              Về trang đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
