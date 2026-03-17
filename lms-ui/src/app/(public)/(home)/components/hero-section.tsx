'use client'

import { AnimatedCounter } from '@/components/animated-counter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTE_CONFIG } from '@/configs/routes'
import { ArrowRight, BookOpen, CheckCircle, Star, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
// Thành phần hero - Hàm mũi tên
const HeroSection = () => {
  const stats = [
    { icon: Users, label: 'Học viên', value: '50,000+' },
    { icon: BookOpen, label: 'Khóa học', value: '1,200+' },
    { icon: Star, label: 'Đánh giá', value: '4.9/5' }
  ]

  const features = ['Khóa học từ chuyên gia', 'Truy cập trọn đời', 'Chứng chỉ hoàn thành', 'Học trên mobile & desktop']

  return (
    <section className='relative overflow-hidden bg-white'>
      <div className='container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-20'>
        <div className='grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* Nội dung bên trái */}
          <div className='space-y-6 text-center sm:space-y-8 lg:text-left'>
            {/* Huy hiệu */}
            <Badge
              variant='secondary'
              className='mx-auto inline-flex items-center space-x-1 text-xs sm:text-sm lg:mx-0'
            >
              <Star className='h-3 w-3 fill-current sm:h-4 sm:w-4' />
              <span>Nền tảng học trực tuyến số 1</span>
            </Badge>

            {/* Tiêu đề chính */}
            <div className='space-y-3 sm:space-y-4'>
              <h1 className='text-3xl leading-tight font-bold sm:text-4xl md:text-5xl xl:text-7xl'>
                Học kỹ năng phát triển bản thân
              </h1>
              <p className='mx-auto max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl lg:mx-0'>
                Bứt phá sự nghiệp với các khóa học thực tiễn do giảng viên hàng đầu giảng dạy. Bắt đầu học hôm nay và
                khai phá tiềm năng của bạn.
              </p>
            </div>

            {/* Danh sách tính năng */}
            <div className='mx-auto grid max-w-md grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mx-0'>
              {features.map((feature, index) => (
                <div key={index} className='flex items-center justify-center space-x-2 lg:justify-start'>
                  <CheckCircle className='h-4 w-4 flex-shrink-0 text-green-500 sm:h-5 sm:w-5' />
                  <span className='text-sm text-gray-600 sm:text-base'>{feature}</span>
                </div>
              ))}
            </div>

            {/* Nút kêu gọi hành động */}
            <div className='mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4 lg:mx-0'>
              {/* CTA chính - Bắt đầu học */}
              <Button
                size='lg'
                className='bg-primary group relative h-12 w-full overflow-hidden rounded-sm border-0 px-6 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl sm:h-14 sm:flex-1 sm:px-8 sm:text-base'
                asChild
              >
                <Link href={ROUTE_CONFIG.COURSES}>
                  {/* Hiệu ứng lấp lánh động */}
                  <div className='absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]'></div>
                  <span className='relative z-10 transition-transform duration-300 group-hover:scale-105'>
                    Bắt đầu học
                  </span>
                  <ArrowRight className='relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5' />
                </Link>
              </Button>
            </div>

            {/* Thống kê */}
            <div className='grid grid-cols-3 justify-center gap-4 pt-2 sm:flex sm:flex-wrap sm:gap-6 sm:pt-4 lg:justify-start lg:gap-8'>
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className='flex min-w-0 items-center space-x-2'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 sm:h-10 sm:w-10'>
                      <Icon className='h-4 w-4 text-blue-600 sm:h-5 sm:w-5' />
                    </div>
                    <div className='min-w-0'>
                      <div className='text-lg font-bold text-gray-900 sm:text-xl md:text-2xl'>
                        <AnimatedCounter value={stat.value} duration={2000} />
                      </div>
                      <div className='truncate text-xs text-gray-600 sm:text-sm'>{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Nội dung bên phải - Hình minh họa hero */}
          <div className='relative order-first mx-auto h-[300px] w-full sm:h-[400px] md:h-[450px] lg:order-last lg:mx-0 lg:h-[500px] xl:h-[550px]'>
            {/* Ngôi sao động trang trí */}
            <div className='pointer-events-none absolute inset-0 z-20 overflow-hidden'>
              {/* Ngôi sao 1 - Góc trên bên trái - Gradient tím */}
              <div className='animate-float-slow animate-twinkle-slow absolute top-2 left-4 sm:top-4 sm:left-8 md:top-8 md:left-16'>
                <Star className='star-purple h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7' fill='currentColor' />
              </div>

              {/* Ngôi sao 2 - Góc trên bên phải - Gradient xanh dương */}
              <div className='animate-float-medium animate-twinkle-medium absolute top-3 right-4 sm:top-6 sm:right-8 md:top-12 md:right-16'>
                <Star className='star-blue h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6' fill='currentColor' />
              </div>

              {/* Ngôi sao 3 - Khu vực trên bên trái - Gradient hồng */}
              <div className='animate-float-fast animate-twinkle-slow absolute top-8 left-2 sm:top-16 sm:left-4 md:top-24 md:left-8'>
                <Star className='star-pink h-2 w-2 opacity-80 sm:h-3 sm:w-3 md:h-4 md:w-4' fill='currentColor' />
              </div>

              {/* Ngôi sao 4 - Góc dưới bên phải - Gradient vàng */}
              <div className='animate-float-slow animate-twinkle-fast absolute right-6 bottom-4 sm:right-12 sm:bottom-8 md:right-20 md:bottom-16'>
                <Star className='star-gold h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5' fill='currentColor' />
              </div>

              {/* Ngôi sao 5 - Khu vực trên bên phải - Gradient cyan */}
              <div className='animate-float-medium animate-twinkle-medium absolute top-10 right-2 sm:top-20 sm:right-4 md:top-32 md:right-6'>
                <Star className='star-cyan h-2 w-2 opacity-75 sm:h-3 sm:w-3 md:h-4 md:w-4' fill='currentColor' />
              </div>

              {/* Ngôi sao 6 - Khu vực dưới bên trái - Gradient lục bảo */}
              <div className='animate-float-fast animate-twinkle-slow absolute bottom-6 left-4 sm:bottom-12 sm:left-8 md:bottom-20 md:left-12'>
                <Star className='star-emerald h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5' fill='currentColor' />
              </div>

              {/* Ngôi sao 7 - Mép phải ở giữa - Gradient hồng rose */}
              <div className='animate-float-slow animate-twinkle-fast absolute top-16 right-1 sm:top-32 sm:right-2 md:top-48 md:right-4'>
                <Star className='star-rose h-2 w-2 opacity-70 sm:h-3 sm:w-3 md:h-4 md:w-4' fill='currentColor' />
              </div>

              {/* Ngôi sao 8 - Khu vực giữa phía trên - Gradient tím violet */}
              <div className='animate-float-medium animate-twinkle-slow absolute top-1 left-1/3 sm:top-2 md:top-4 md:left-1/4'>
                <Star className='star-violet h-2 w-2 opacity-85 sm:h-3 sm:w-3 md:h-4 md:w-4' fill='currentColor' />
              </div>

              {/* Ngôi sao 9 - Khu vực giữa phía dưới - Gradient hổ phách */}
              <div className='animate-float-fast animate-twinkle-medium absolute right-1/3 bottom-2 sm:bottom-4 md:right-1/4 md:bottom-8'>
                <Star className='star-amber h-2 w-2 opacity-90 sm:h-3 sm:w-3 md:h-4 md:w-4' fill='currentColor' />
              </div>
            </div>

            {/* Ảnh hero */}
            <Image
              src='/images/hero.png'
              alt='Học viên học tập'
              fill
              fetchPriority='high'
              priority={true}
              quality={85}
              sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 550px'
              className='relative z-10 object-contain object-center'
            />
          </div>
        </div>
      </div>

      {/* Sóng cuối trang */}
      <div className='absolute right-0 bottom-0 left-0'>
        <svg viewBox='0 0 1440 80' className='h-auto w-full'>
          <defs>
            <linearGradient id='waveGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#fef7ff' stopOpacity='0.6' />
              <stop offset='25%' stopColor='#f1f5f9' stopOpacity='0.8' />
              <stop offset='50%' stopColor='white' stopOpacity='1' />
              <stop offset='75%' stopColor='#eff6ff' stopOpacity='0.8' />
              <stop offset='100%' stopColor='#fef7ff' stopOpacity='0.6' />
            </linearGradient>
          </defs>
          <path
            fill='url(#waveGradient)'
            d='M0,40L48,45C96,50,192,60,288,65C384,70,480,70,576,65C672,60,768,50,864,50C960,50,1056,60,1152,65C1248,70,1344,70,1392,70L1440,70L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z'
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
