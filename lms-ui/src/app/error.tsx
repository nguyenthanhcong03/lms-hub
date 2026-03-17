'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Error() {
  const router = useRouter()

  return (
    <div className='h-screen bg-gradient-to-br from-red-50 via-white to-orange-50'>
      {/* Yếu tố trang trí nền */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-4 -right-4 h-72 w-72 rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20 blur-3xl'></div>
        <div className='absolute top-1/3 -left-8 h-96 w-96 rounded-full bg-gradient-to-br from-orange-400/15 to-red-400/15 blur-3xl'></div>
        <div className='absolute right-1/3 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-red-400/10 to-pink-400/10 blur-3xl'></div>
      </div>

      <div className='relative z-10 flex h-full min-h-screen w-full flex-col items-center justify-center gap-2'>
        {/* Số 500 */}
        <h1 className='bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-[12rem] leading-tight font-bold text-transparent drop-shadow-sm md:text-[16rem]'>
          500
        </h1>

        {/* Thông điệp lỗi */}
        <span className='mb-2 text-2xl font-medium text-gray-800 md:text-3xl'>
          Ối! Đã có lỗi xảy ra {'{'}
          <span className='text-red-500'>&apos;</span>
          <span className='text-red-500'>:</span>
          <span className='text-red-500'>)</span>
        </span>

        {/* Mô tả */}
        <p className='text-muted-foreground mb-8 max-w-md px-4 text-center text-base md:text-lg'>
          Chúng tôi xin lỗi vì sự bất tiện này. <br className='hidden md:block' />
          Vui lòng thử lại sau.
        </p>

        {/* Nút hành động */}
        <div className='mt-6 flex flex-col gap-4 sm:flex-row'>
          {/* Nút quay lại */}
          <Button
            variant='outline'
            onClick={() => router.back()}
            className='group relative h-12 rounded-xl border-2 border-gray-200 px-6 font-semibold transition-all duration-300 hover:border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:via-gray-100/50 hover:to-gray-50 hover:shadow-lg hover:shadow-gray-200/20'
          >
            <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-gray-500/0 to-gray-500/0 transition-all duration-300 group-hover:from-gray-500/5 group-hover:to-gray-500/5'></div>
            <ArrowLeft className='relative z-10 mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
            <span className='relative z-10'>Quay lại</span>
          </Button>

          {/* Nút về trang chủ */}
          <Button
            className='group relative h-12 overflow-hidden rounded-xl border border-transparent bg-gradient-to-r from-red-600 via-red-700 to-orange-600 px-6 font-semibold text-white shadow-lg transition-all duration-300 hover:border-red-400 hover:from-red-700 hover:via-red-800 hover:to-orange-700 hover:shadow-xl'
            asChild
          >
            <Link href='/'>
              {/* Hiệu ứng lấp lánh động */}
              <div className='absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]'></div>
              <Home className='relative z-10 mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
              <span className='relative z-10 transition-transform duration-300 group-hover:scale-105'>
                Về trang chủ
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
