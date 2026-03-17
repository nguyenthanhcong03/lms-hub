'use client'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRegister } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = yup.object({
  username: yup.string().required('Vui lòng nhập tên người dùng').min(2, 'Tên người dùng phải có ít nhất 2 ký tự'),
  email: yup.string().required('Vui lòng nhập email của bạn').email('Vui lòng nhập email hợp lệ'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu của bạn')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một viết thường và một chữ số'
    ),

  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp.')
})

// Component form đăng ký
const SignUpForm = ({ className, ...props }: SignUpFormProps) => {
  const registerMutation = useRegister()

  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  function onSubmit(data: yup.InferType<typeof formSchema>) {
    registerMutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-6', className)} {...props}>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên người dùng' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Nhập email của bạn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Nhập mật khẩu của bạn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Nhập lại mật khẩu của bạn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
