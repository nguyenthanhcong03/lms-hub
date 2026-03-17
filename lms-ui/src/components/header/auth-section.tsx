'use client'

import { UserNav } from '@/components/auth/user-nav'
import { Button } from '@/components/ui/button'
import { ROUTE_CONFIG } from '@/configs/routes'
import { useAuthStore } from '@/stores/auth-store'
import { User } from 'lucide-react'
import Link from 'next/link'

export default function AuthSection() {
  const user = useAuthStore((state) => state.user)

  if (user) {
    return <UserNav />
  }

  return (
    <div className='flex items-center gap-1 sm:gap-2'>
      <Button
        variant='ghost'
        size='sm'
        className='bg-secondary hover:text-primary group hover:bg-primary/10 hover:shadow-primary/20 relative h-8 rounded-full border border-transparent px-2 font-semibold text-gray-600 transition-all duration-300 hover:shadow-lg focus:outline-none sm:h-10 sm:px-4'
        asChild
      >
        <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} aria-label='Đăng nhập vào tài khoản của bạn'>
          <div className='absolute inset-0 rounded-xl transition-all duration-300'></div>
          <User className='relative z-10 h-3 w-3 transition-transform duration-300 group-hover:scale-110 sm:mr-2 sm:h-4 sm:w-4' />
          <span className='relative z-10 hidden sm:inline'>Đăng nhập</span>
        </Link>
      </Button>
      <Button
        size='sm'
        className='bg-primary hover:bg-primary/80 group relative h-8 overflow-hidden rounded-full border border-transparent px-3 font-semibold text-white shadow-lg transition-all duration-300 hover:text-white hover:shadow-xl focus:outline-none sm:h-10 sm:px-6'
        asChild
      >
        <Link href={ROUTE_CONFIG.AUTH.SIGN_UP} aria-label='Đăng ký và bắt đầu học với LMSHub'>
          {/* Hiệu ứng ánh sáng động */}
          <div className='absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]'></div>
          <span className='relative z-10 text-sm transition-transform duration-300 group-hover:scale-105 sm:text-base'>
            <span className='hidden sm:inline'>Bắt đầu</span>
            <span className='sm:hidden'>Học ngay</span>
          </span>
          <span
            className='relative z-10 ml-1 text-xs transition-transform duration-300 group-hover:rotate-12 sm:ml-2 sm:text-base'
            aria-hidden='true'
          >
            🚀
          </span>
        </Link>
      </Button>
    </div>
  )
}
