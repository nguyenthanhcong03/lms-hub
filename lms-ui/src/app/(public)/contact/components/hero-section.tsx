'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, HeadphonesIcon, Mail, MessageCircle, Phone, Star, Users } from 'lucide-react'
import Link from 'next/link'

const HeroSection = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Hỗ trợ qua điện thoại',
      description: 'Thứ 2 - Thứ 6, 9:00 - 18:00 (EST)',
      value: '+1 (555) 123-4567',
      action: 'Gọi ngay',
      href: 'tel:+15551234567'
    },
    {
      icon: Mail,
      title: 'Hỗ trợ qua email',
      description: 'Phản hồi trong vòng 2 giờ',
      value: 'support@LMShub.com',
      action: 'Gửi email',
      href: 'mailto:support@LMShub.com'
    },
    {
      icon: MessageCircle,
      title: 'Chat trực tiếp',
      description: 'Sẵn sàng 24/7',
      value: 'Trò chuyện với đội ngũ',
      action: 'Bắt đầu chat',
      href: '#chat'
    }
  ]

  return (
    <section className='from-primary/10 via-background to-secondary/20 relative overflow-hidden bg-gradient-to-br'>
      {/* Họa tiết nền */}
      <div className='bg-grid-slate-100 absolute inset-0 -z-10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]' />

      {/* Các phần tử nổi */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='animate-float-slow bg-primary/20 absolute top-20 left-10 h-32 w-32 rounded-full blur-xl' />
        <div className='animate-float-medium bg-secondary/20 absolute top-40 right-20 h-24 w-24 rounded-full blur-2xl' />
        <div className='animate-float-fast bg-primary/10 absolute bottom-32 left-1/4 h-40 w-40 rounded-full blur-3xl' />

        {/* Biểu tượng nổi */}
        <div className='animate-float-medium absolute top-16 right-1/4'>
          <div className='bg-primary/10 flex h-12 w-12 rotate-12 items-center justify-center rounded-xl'>
            <HeadphonesIcon className='text-primary h-6 w-6' />
          </div>
        </div>
        <div className='animate-float-slow absolute right-8 bottom-20'>
          <div className='bg-secondary/10 flex h-10 w-10 -rotate-12 items-center justify-center rounded-lg'>
            <MessageCircle className='text-secondary h-5 w-5' />
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-20'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Bên trái */}
          <div className='space-y-8'>
            <Badge variant='secondary' className='inline-flex items-center space-x-2'>
              <HeadphonesIcon className='h-3 w-3' />
              <span>Chúng tôi luôn sẵn sàng hỗ trợ</span>
            </Badge>

            <div className='space-y-4'>
              <h1 className='text-foreground text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'>
                Liên hệ{' '}
                <span className='from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent'>ngay</span>{' '}
                với chúng tôi
              </h1>
              <p className='text-muted-foreground max-w-lg text-xl leading-relaxed'>
                Có câu hỏi về khóa học? Cần hỗ trợ kỹ thuật? Đội ngũ thân thiện của chúng tôi luôn sẵn sàng giúp bạn
                thành công trên hành trình học tập.
              </p>
            </div>

            {/* Thống kê */}
            <div className='flex flex-wrap gap-6'>
              <div className='text-muted-foreground flex items-center space-x-2'>
                <Clock className='text-primary h-5 w-5' />
                <span className='text-sm font-medium'>Phản hồi trong vòng 2 giờ</span>
              </div>
              <div className='text-muted-foreground flex items-center space-x-2'>
                <Star className='text-primary h-5 w-5 fill-current' />
                <span className='text-sm font-medium'>Đánh giá hỗ trợ 4.9/5</span>
              </div>
              <div className='text-muted-foreground flex items-center space-x-2'>
                <Users className='text-primary h-5 w-5' />
                <span className='text-sm font-medium'>Hỗ trợ cộng đồng 24/7</span>
              </div>
            </div>

            {/* Nút kêu gọi hành động */}
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button size='lg' className='px-8 text-base' asChild>
                <Link href='#contact-form'>
                  Gửi tin nhắn cho chúng tôi
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button variant='outline' size='lg' className='px-8 text-base' asChild>
                <Link href='/help'>
                  <HeadphonesIcon className='mr-2 h-4 w-4' />
                  Xem trung tâm trợ giúp
                </Link>
              </Button>
            </div>
          </div>

          {/* Bên phải */}
          <div className='space-y-6'>
            <div className='mb-8 text-center lg:text-left'>
              <h2 className='text-foreground mb-4 text-2xl font-bold md:text-3xl'>Chọn cách liên hệ phù hợp nhất</h2>
              <p className='text-muted-foreground'>
                Nhiều cách để kết nối với chúng tôi - hãy chọn cách thuận tiện nhất cho bạn.
              </p>
            </div>

            <div className='space-y-4'>
              {contactMethods.map((method, index) => {
                const Icon = method.icon

                return (
                  <div
                    key={index}
                    className='group bg-background hover:border-primary/30 relative rounded-2xl border p-6 shadow-md transition-all duration-300 hover:shadow-xl'
                  >
                    {/* Gradient khi di chuột */}
                    <div className='from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/20 absolute inset-0 rounded-2xl bg-gradient-to-r transition-all duration-300' />

                    <div className='relative z-10 flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110'>
                          <Icon className='text-primary h-6 w-6' />
                        </div>

                        <div>
                          <h3 className='text-foreground text-lg font-semibold'>{method.title}</h3>
                          <p className='text-muted-foreground mb-1 text-sm'>{method.description}</p>
                          <p className='text-primary text-sm font-medium'>{method.value}</p>
                        </div>
                      </div>

                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-primary hover:bg-primary/10 opacity-0 transition-all duration-300 group-hover:opacity-100'
                        asChild
                      >
                        <Link href={method.href}>
                          {method.action}
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Hỗ trợ khẩn cấp */}
            <div className='bg-destructive/10 rounded-2xl border p-6'>
              <div className='flex items-center space-x-3'>
                <div className='bg-destructive/20 flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Phone className='text-destructive h-5 w-5' />
                </div>
                <div>
                  <h4 className='text-foreground font-semibold'>Hỗ trợ khẩn cấp</h4>
                  <p className='text-muted-foreground text-sm'>
                    Với vấn đề kỹ thuật khẩn cấp:{' '}
                    <span className='text-destructive font-medium'>+1 (555) 999-0000</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
