'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className='from-primary/5 via-background to-primary/10 h-screen bg-gradient-to-br'>
      {/* Yếu tố trang trí nền */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='bg-primary/20 absolute -top-4 -right-4 h-72 w-72 rounded-full blur-3xl'></div>
        <div className='bg-primary/15 absolute top-1/3 -left-8 h-96 w-96 rounded-full blur-3xl'></div>
        <div className='bg-primary/10 absolute right-1/3 bottom-1/4 h-64 w-64 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 flex h-full min-h-screen w-full flex-col items-center justify-center gap-2'>
        {/* Số 404 */}
        <h1 className='from-primary via-primary/80 to-primary bg-gradient-to-r bg-clip-text text-[12rem] leading-tight font-bold text-transparent drop-shadow-sm md:text-[16rem]'>
          404
        </h1>

        {/* Thông điệp lỗi */}
        <span className='text-foreground mb-2 text-2xl font-medium md:text-3xl'>Ối! Không tìm thấy trang!</span>

        {/* Mô tả */}
        <p className='text-muted-foreground mb-8 max-w-md px-4 text-center text-base md:text-lg'>
          Có vẻ như trang bạn đang tìm kiếm <br className='hidden md:block' />
          không tồn tại hoặc đã bị xóa.
        </p>

        {/* Nút hành động */}
        <div className='mt-6 flex flex-col gap-4 sm:flex-row'>
          {/* Nút quay lại */}
          <Button
            variant='outline'
            onClick={() => router.back()}
            className='group border-primary/20 hover:border-primary/40 hover:bg-primary/5 relative h-12 rounded-xl px-6 font-semibold transition-all duration-300'
          >
            <ArrowLeft className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
            Quay lại
          </Button>

          {/* Nút về trang chủ */}
          <Button
            className='bg-primary hover:bg-primary/90 text-primary-foreground group relative h-12 overflow-hidden rounded-xl px-6 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl'
            asChild
          >
            <Link href='/'>
              {/* Hiệu ứng lấp lánh động */}
              <div className='absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]'></div>

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
