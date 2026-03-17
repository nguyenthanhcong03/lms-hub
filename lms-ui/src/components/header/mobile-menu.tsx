'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ROUTE_CONFIG } from '@/configs/routes'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GiGraduateCap } from 'react-icons/gi'

const navigation = [
  { name: 'Khóa học', href: ROUTE_CONFIG.COURSES },
  { name: 'Bài viết', href: ROUTE_CONFIG.BLOGS },
  { name: 'Giới thiệu', href: ROUTE_CONFIG.ABOUT },
  { name: 'Liên hệ', href: ROUTE_CONFIG.CONTACT }
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((state) => !!state.user)
  const user = useAuthStore((state) => state.user)

  // Đóng menu mobile khi route thay đổi
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-10 w-10 p-0 text-gray-600 hover:bg-blue-50 hover:text-blue-600 lg:hidden'
          aria-label='Bật hoặc tắt menu di động'
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-80 p-0'>
        <SheetHeader className='border-b p-6'>
          <SheetTitle className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600'>
              <GiGraduateCap size={18} className='text-white' />
            </div>
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent'>
              LMSHub
            </span>
          </SheetTitle>
          <SheetDescription className='text-left'>Học tập và phát triển kỹ năng của bạn</SheetDescription>
        </SheetHeader>

        {/* Điều hướng trên di động */}
        <div className='flex h-full flex-col'>
          <nav className='flex-1 p-6'>
            <div className='space-y-4'>
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg p-3 font-medium transition-all duration-200',
                      isActive
                        ? 'border border-blue-200 bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Khu vực xác thực trên di động */}
          <div className='border-t bg-gray-50 p-6'>
            {isAuthenticated && user ? (
              <div className='space-y-3'>
                <div className='flex items-center gap-3 rounded-lg bg-white p-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white'>
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>{user.username}</p>
                    <p className='text-sm text-gray-500'>{user.email}</p>
                  </div>
                </div>
                <Button variant='outline' size='sm' className='w-full' asChild>
                  <Link href={ROUTE_CONFIG.PROFILE.MY_PROFILE}>Xem hồ sơ</Link>
                </Button>
              </div>
            ) : (
              <div className='space-y-3'>
                <Button variant='outline' size='sm' className='w-full' asChild>
                  <Link href={ROUTE_CONFIG.AUTH.SIGN_IN}>Đăng Nhập</Link>
                </Button>
                <Button
                  size='sm'
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  asChild
                >
                  <Link href={ROUTE_CONFIG.AUTH.SIGN_UP}>Bắt đầu</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
