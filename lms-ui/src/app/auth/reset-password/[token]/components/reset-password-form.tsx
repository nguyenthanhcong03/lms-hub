'use client'
import { HTMLAttributes } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { useResetPassword } from '@/hooks/use-auth'
import { KeyRound } from 'lucide-react'
import Link from 'next/link'
import { ROUTE_CONFIG } from '@/configs/routes'

interface ResetPasswordFormProps extends HTMLAttributes<HTMLFormElement> {
  token: string
}

const formSchema = yup.object({
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một viết thường và một chữ số'
    ),
  confirmNewPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu phải khớp')
})

type FormData = yup.InferType<typeof formSchema>

// Component form đặt lại mật khẩu - Arrow function
const ResetPasswordForm = ({ token, className, ...props }: ResetPasswordFormProps) => {
  const router = useRouter()
  const resetPasswordMutation = useResetPassword()

  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  async function onSubmit(data: FormData) {
    await resetPasswordMutation.mutateAsync({
      token,
      newPassword: data.newPassword
    })

    // Chuyển về trang đăng nhập sau một khoảng trễ ngắn
    setTimeout(() => {
      router.push(ROUTE_CONFIG.AUTH.SIGN_IN)
    }, 3000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-6', className)} {...props}>
        <div className='space-y-2 text-center'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <KeyRound className='h-6 w-6 text-blue-600' />
            </div>
          </div>
          <p className='text-muted-foreground text-sm'>
            Nhập mật khẩu mới bên dưới. Hãy đảm bảo mật khẩu mạnh và bảo mật.
          </p>
        </div>

        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Nhập mật khẩu mới' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmNewPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Xác nhận mật khẩu mới' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={resetPasswordMutation.isPending} className='w-full'>
          {resetPasswordMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>

        <div className='text-center'>
          <p className='text-muted-foreground text-sm'>
            Nhớ mật khẩu?{' '}
            <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} className='text-primary hover:underline'>
              Về trang Đăng Nhập
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
