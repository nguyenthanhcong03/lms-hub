'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Building,
  Calendar,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter
} from 'lucide-react'
import Link from 'next/link'

const ContactInfoSection = () => {
  const offices = [
    {
      city: 'San Francisco',
      type: 'Trụ sở chính',
      address: '123 Innovation Drive, Suite 400',
      zipCode: 'San Francisco, CA 94107',
      country: 'Hoa Kỳ',
      phone: '+1 (555) 123-4567',
      email: 'sf@LMShub.com',
      hours: 'Thứ 2 - Thứ 6: 09:00 - 18:00 (PST)',
      timezone: 'Giờ Thái Bình Dương',
      mapUrl: 'https://maps.google.com',
      isPrimary: true
    },
    {
      city: 'New York',
      type: 'Văn phòng bờ Đông',
      address: '789 Broadway, Floor 15',
      zipCode: 'New York, NY 10003',
      country: 'Hoa Kỳ',
      phone: '+1 (555) 987-6543',
      email: 'ny@LMShub.com',
      hours: 'Thứ 2 - Thứ 6: 09:00 - 18:00 (EST)',
      timezone: 'Giờ miền Đông',
      mapUrl: 'https://maps.google.com',
      isPrimary: false
    },
    {
      city: 'London',
      type: 'Văn phòng châu Âu',
      address: '45 Finsbury Square',
      zipCode: 'London EC2A 1PX',
      country: 'Vương quốc Anh',
      phone: '+44 20 7946 0958',
      email: 'london@LMShub.com',
      hours: 'Thứ 2 - Thứ 6: 09:00 - 17:00 (GMT)',
      timezone: 'Giờ Greenwich',
      mapUrl: 'https://maps.google.com',
      isPrimary: false
    }
  ]

  const socialLinks = [
    {
      name: 'Twitter',
      handle: '@LearnHubEdu',
      url: 'https://twitter.com/LMShub',
      icon: Twitter,
      followers: '45K'
    },
    {
      name: 'LinkedIn',
      handle: 'LMSHub',
      url: 'https://linkedin.com/company/LMShub',
      icon: Linkedin,
      followers: '120K'
    },
    {
      name: 'Facebook',
      handle: 'LearnHubEducation',
      url: 'https://facebook.com/LMShub',
      icon: Facebook,
      followers: '85K'
    },
    {
      name: 'Instagram',
      handle: '@LMShub_edu',
      url: 'https://instagram.com/LMShub',
      icon: Instagram,
      followers: '30K'
    }
  ]

  return (
    <section className='bg-muted py-20'>
      <div className='container mx-auto px-6'>
        {/* Tiêu đề */}
        <div className='mb-16 text-center'>
          <Badge variant='secondary' className='mb-4 inline-flex items-center space-x-2'>
            <MapPin className='h-3 w-3' />
            <span>Tìm chúng tôi trên toàn cầu</span>
          </Badge>
          <h2 className='text-foreground mb-4 text-4xl font-bold md:text-5xl'>Mạng lưới toàn cầu</h2>
          <p className='text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed'>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn ở mọi nơi. Hãy chọn cách liên hệ phù hợp nhất hoặc ghé thăm văn phòng của
            chúng tôi.
          </p>
        </div>

        {/* Văn phòng */}
        <div className='mb-16'>
          <h3 className='text-foreground mb-12 text-center text-2xl font-bold md:text-3xl'>Địa điểm văn phòng</h3>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {offices.map((office, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden border shadow-md transition-all duration-300 hover:shadow-xl ${
                  office.isPrimary ? 'ring-primary/30 ring-2' : ''
                }`}
              >
                {office.isPrimary && (
                  <div className='absolute top-4 right-4 z-10'>
                    <Badge variant='secondary'>Trụ sở chính</Badge>
                  </div>
                )}

                {/* Nền gradient */}
                <div className='from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/20 absolute inset-0 bg-gradient-to-br transition-all duration-300' />

                <CardContent className='relative z-10 p-6'>
                  {/* Thành phố */}
                  <div className='mb-6'>
                    <div className='mb-2 flex items-center space-x-3'>
                      <div className='bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl'>
                        <MapPin className='h-6 w-6' />
                      </div>
                      <div>
                        <h4 className='text-foreground text-xl font-bold'>{office.city}</h4>
                        <p className='text-primary text-sm font-medium'>{office.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className='mb-6 space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <Building className='text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0' />
                      <div className='text-muted-foreground'>
                        <p>{office.address}</p>
                        <p>{office.zipCode}</p>
                        <p className='font-medium'>{office.country}</p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <Phone className='text-muted-foreground h-5 w-5 flex-shrink-0' />
                      <a href={`tel:${office.phone.replace(/\s/g, '')}`} className='text-primary hover:underline'>
                        {office.phone}
                      </a>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <Mail className='text-muted-foreground h-5 w-5 flex-shrink-0' />
                      <a href={`mailto:${office.email}`} className='text-primary hover:underline'>
                        {office.email}
                      </a>
                    </div>

                    <div className='flex items-start space-x-3'>
                      <Clock className='text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0' />
                      <div className='text-muted-foreground'>
                        <p>{office.hours}</p>
                        <p className='text-sm'>{office.timezone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Thao tác */}
                  <div className='space-y-3'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='group-hover:border-primary/30 group-hover:bg-primary/10 w-full'
                      asChild
                    >
                      <Link href={office.mapUrl} target='_blank'>
                        <MapPin className='mr-2 h-4 w-4' />
                        Xem trên bản đồ
                        <ExternalLink className='ml-2 h-3 w-3' />
                      </Link>
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-muted-foreground hover:bg-primary/10 hover:text-primary w-full'
                      asChild
                    >
                      <Link href='#contact-form'>
                        <Calendar className='mr-2 h-4 w-4' />
                        Đặt lịch ghé thăm
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className='text-foreground mb-12 text-center text-2xl font-bold md:text-3xl'>
            Kết nối với chúng tôi trên mạng xã hội
          </h3>

          <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
            {socialLinks.map((social, index) => {
              const Icon = social.icon

              return (
                <Card
                  key={index}
                  className='group border text-center shadow-md transition-all duration-300 hover:shadow-xl'
                >
                  <CardContent className='p-6'>
                    <div className='flex flex-col items-center space-y-4'>
                      <div className='bg-muted flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110'>
                        <Icon className='text-primary h-8 w-8' />
                      </div>

                      <div>
                        <h4 className='text-foreground text-lg font-semibold'>{social.name}</h4>
                        <p className='text-muted-foreground mb-1 text-sm'>{social.handle}</p>
                        <p className='text-muted-foreground text-xs'>{social.followers} người theo dõi</p>
                      </div>

                      <Button variant='outline' size='sm' className='group-hover:bg-muted w-full' asChild>
                        <Link href={social.url} target='_blank'>
                          Theo dõi
                          <ExternalLink className='ml-2 h-3 w-3' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfoSection
