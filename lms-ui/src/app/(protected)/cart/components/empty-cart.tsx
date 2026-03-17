'use client'

import Link from 'next/link'
import { ShoppingBag, BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTE_CONFIG } from '@/configs/routes'

// Empty cart component - Arrow function
const EmptyCart = () => {
  return (
    <div className='mx-auto max-w-2xl'>
      <Card className='p-6 text-center sm:p-8'>
        <div className='flex flex-col items-center gap-4 sm:gap-6'>
          <div className='bg-muted flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16'>
            <ShoppingBag className='text-muted-foreground h-7 w-7 sm:h-8 sm:w-8' />
          </div>

          <div className='space-y-1.5 sm:space-y-2'>
            <h2 className='text-xl font-bold sm:text-2xl'>Giỏ hàng của bạn đang trống</h2>
            <p className='text-muted-foreground max-w-md px-4 text-xs sm:px-0 sm:text-sm md:text-base'>
              Khám phá các khóa học tuyệt vời của chúng tôi và bắt đầu hành trình học tập của bạn ngay hôm nay. Thêm các
              khóa học vào giỏ hàng của bạn để tiếp tục.
            </p>
          </div>

          <div className='flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:gap-3'>
            <Button asChild className='h-10 flex-1 text-sm sm:h-11 sm:text-base'>
              <Link href={ROUTE_CONFIG.COURSES}>
                <BookOpen className='mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4' />
                Xem khóa học
              </Link>
            </Button>

            <Button variant='outline' asChild className='h-10 flex-1 text-sm sm:h-11 sm:text-base'>
              <Link href={ROUTE_CONFIG.HOME}>
                <ArrowLeft className='mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4' />
                Quay lại trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default EmptyCart
