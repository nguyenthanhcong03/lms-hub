'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Play, Star, Users, Clock, Globe, Calendar, ChevronLeft } from 'lucide-react'
import { IPublicCourse } from '@/types/course'
import { formatDate, formatDuration, formatStudentCount } from '@/utils/format'
import { ROUTE_CONFIG } from '@/configs/routes'
import { DEFAULT_AVATAR, DEFAULT_THUMBNAIL } from '@/constants'
import dynamic from 'next/dynamic'
import { getCourseLevelLabel } from '@/helpers'
const VideoModal = dynamic(() => import('./video-modal'), { ssr: false })

interface CourseHeroProps {
  course: IPublicCourse
}

const CourseHero = ({ course }: CourseHeroProps) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Nếu có intro video, hiển thị nút play và cho phép mở modal, ngược lại không có tương tác
  const hasIntroVideo = course.introUrl && course.introUrl.trim() !== ''

  return (
    <>
      {/* Video modal - chỉ hiển thị khi có video */}
      {hasIntroVideo && isVideoModalOpen && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={course.introUrl}
          title={`${course.title} - Xem trước`}
        />
      )}

      {/* Phần hero */}
      <div className='relative overflow-hidden bg-gray-900 text-white'>
        {/* Mẫu nền */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20'></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>

        <div className='relative container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
          {/* Đường dẫn điều hướng */}
          <div className='mb-4 sm:mb-6'>
            <Link
              href={ROUTE_CONFIG.COURSES}
              className='inline-flex items-center text-sm text-gray-300 transition-colors hover:text-white sm:text-base'
            >
              <ChevronLeft className='mr-1 h-4 w-4' />
              Trở về
            </Link>
          </div>

          <div className='grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12'>
            {/* Nội dung bên trái */}
            <div className='space-y-4 sm:space-y-6'>
              {/* Huy hiệu danh mục */}
              <Badge variant='secondary' className='w-fit text-xs sm:text-sm'>
                {course.category?.name || 'Tổng quát'}
              </Badge>

              {/* Tiêu đề */}
              <div>
                <h1 className='mb-3 text-2xl leading-tight font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl'>
                  {course.title}
                </h1>
                <div className='prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-blue-400 max-w-none text-base leading-relaxed text-gray-300 sm:text-lg lg:text-xl'>
                  {course.excerpt}
                </div>
              </div>

              {/* Thống kê khóa học */}
              <div className='flex flex-wrap items-center gap-3 text-xs sm:gap-4 sm:text-sm lg:gap-6'>
                <div className='flex items-center space-x-1'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < Math.floor(course.averageRating || 4.5) ? 'fill-current text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='font-medium'>{course.averageRating || 4.5}</span>
                  <span className='hidden text-gray-400 sm:inline'>
                    ({formatStudentCount(course.totalReviews || 0)} đánh giá)
                  </span>
                </div>

                <div className='flex items-center space-x-1 text-gray-300'>
                  <Users className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span>
                    {formatStudentCount(course.enrolledStudents || 0)}{' '}
                    <span className='hidden sm:inline'>học viên</span>
                  </span>
                </div>

                <div className='flex items-center space-x-1 text-gray-300'>
                  <Clock className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span>{formatDuration(course.totalDuration || 0)}</span>
                </div>
              </div>

              {/* Giảng viên */}
              <div className='flex items-center space-x-3'>
                <div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-12 sm:w-12'>
                  <Image
                    src={course.author?.avatar || DEFAULT_AVATAR}
                    alt={course.author?.username || 'Giảng viên'}
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 40px, 48px'
                  />
                </div>
                <div>
                  <p className='text-xs text-gray-400 sm:text-sm'>Giảng viên</p>
                  <p className='text-sm font-medium sm:text-base'>{course.author?.username || 'Chưa rõ giảng viên'}</p>
                </div>
              </div>

              {/* Chi tiết khóa học */}
              <div className='flex flex-wrap items-center gap-3 text-xs text-gray-400 sm:gap-4 sm:text-sm lg:gap-6'>
                <div className='flex items-center space-x-1'>
                  <Calendar className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Cập nhật {formatDate(course.updatedAt)}</span>
                  <span className='sm:hidden'>{formatDate(course.updatedAt)}</span>
                </div>
                <Badge variant='outline' className='border-gray-600 text-xs text-gray-300 sm:text-sm'>
                  {getCourseLevelLabel(course.level)}
                </Badge>
              </div>
            </div>

            {/* Nội dung bên phải - Xem trước video */}
            <div className='relative order-first lg:order-last'>
              <div
                className={`group relative aspect-video overflow-hidden rounded-xl bg-gray-800 shadow-2xl sm:rounded-sm ${
                  hasIntroVideo ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (hasIntroVideo) {
                    setIsVideoModalOpen(true)
                  }
                }}
                role={hasIntroVideo ? 'button' : undefined}
                tabIndex={hasIntroVideo ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasIntroVideo && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setIsVideoModalOpen(true)
                  }
                }}
                aria-label={hasIntroVideo ? 'Phát video xem trước khóa học' : undefined}
              >
                <Image
                  src={course.image || DEFAULT_THUMBNAIL}
                  alt={course.title}
                  fill
                  className='pointer-events-none object-cover transition-transform duration-300 group-hover:scale-105'
                />

                {/* Lớp phủ nút phát - chỉ hiện khi có video */}
                {hasIntroVideo && (
                  <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='flex h-16 w-16 scale-90 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:scale-100 sm:h-20 sm:w-20'>
                      <Play className='ml-1 h-6 w-6 fill-current text-gray-900 sm:h-8 sm:w-8' />
                    </div>
                  </div>
                )}
              </div>

              {/* Điểm nổi bật của khóa học */}
              <div className='mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:gap-4'>
                <div className='rounded-sm bg-white/5 p-3 text-center backdrop-blur-sm sm:p-4'>
                  <div className='text-lg font-bold text-blue-400 sm:text-xl lg:text-2xl'>
                    {course.totalLessons || 0}
                  </div>
                  <div className='text-xs text-gray-400 sm:text-sm'>Bài giảng</div>
                </div>
                <div className='rounded-sm bg-white/5 p-3 text-center backdrop-blur-sm sm:p-4'>
                  <div className='text-lg font-bold text-green-400 sm:text-xl lg:text-2xl'>25</div>
                  <div className='text-xs text-gray-400 sm:text-sm'>Tài nguyên</div>
                </div>
                <div className='rounded-sm bg-white/5 p-3 text-center backdrop-blur-sm sm:p-4'>
                  <div className='text-lg font-bold text-purple-400 sm:text-xl lg:text-2xl'>∞</div>
                  <div className='text-xs text-gray-400 sm:text-sm'>Truy cập trọn đời</div>
                </div>
                <div className='rounded-sm bg-white/5 p-3 text-center backdrop-blur-sm sm:p-4'>
                  <div className='text-lg font-bold text-yellow-400 sm:text-xl lg:text-2xl'>⭐</div>
                  <div className='text-xs text-gray-400 sm:text-sm'>Chứng chỉ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseHero
