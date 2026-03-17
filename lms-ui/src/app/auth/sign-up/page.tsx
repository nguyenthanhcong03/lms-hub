import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_CONFIG } from '@/configs/routes'
import Link from 'next/link'
import SignUpForm from './components/sign-up-form'

// Trang đăng ký
const SignUp = async () => {
  return (
    <Card className='gap-4 py-6'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Tạo tài khoản</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để tạo tài khoản. <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className='text-muted-foreground w-full px-8 text-center text-sm'>
          Đã có tài khoản?{' '}
          <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} className='hover:text-primary underline underline-offset-4'>
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default SignUp
