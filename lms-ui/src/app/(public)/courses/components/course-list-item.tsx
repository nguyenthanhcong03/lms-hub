'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Users, Clock, BookOpen } from 'lucide-react'
import { IPublicCourse } from '@/types/course'
import { formatPrice, formatStudentCount, formatDuration, formatRating } from '@/utils/format'
import { getRoutes } from '@/configs/routes'
import { DEFAULT_THUMBNAIL } from '@/constants'

interface CourseListItemProps {
  course: IPublicCourse
}

const CourseListItem = ({ course }: CourseListItemProps) => {
  return (
    <div className='group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md'>
      <div className='flex flex-row gap-3 p-3 sm:gap-4 sm:p-4'>
        {/* Ảnh thu nhỏ */}
        <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:aspect-video sm:h-auto sm:w-48 md:w-56 lg:w-64'>
          <Image
            src={course.image || DEFAULT_THUMBNAIL}
            alt={course.title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {/* Huy hiệu trình độ - Ẩn trên mobile */}
          <div className='absolute top-1.5 left-1.5 hidden sm:top-2 sm:left-2 sm:block'>
            <Badge
              variant={
                course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'
              }
              className='px-1.5 py-0.5 text-[10px] font-medium capitalize sm:px-2 sm:py-1 sm:text-xs'
            >
              {course.level}
            </Badge>
          </div>
          {/* Huy hiệu giá - Ẩn trên mobile */}

          <div className='absolute top-1.5 right-1.5 hidden sm:top-2 sm:right-2 sm:block'>
            {course?.isFree ? (
              <Badge className='border border-green-700 bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-green-700 sm:px-2.5 sm:py-1 sm:text-xs'>
                MIỄN PHÍ
              </Badge>
            ) : (
              <div className='flex flex-col items-end space-y-1'>
                {course.oldPrice > 0 && course.oldPrice > course.price && (
                  <div className='relative flex cursor-default items-center gap-1 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-orange-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-red-600 hover:via-red-700 hover:to-orange-600 hover:shadow-xl sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs'>
                    {/* Hiệu ứng phát sáng */}
                    <div className='absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-orange-400 blur-sm'></div>
                    <span className='text-xs text-yellow-200 sm:text-sm'>🔥</span>
                    {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% GIẢM
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nội dung */}
        <div className='flex min-w-0 flex-grow flex-col justify-between'>
          {/* Phần đầu */}
          <div>
            {/* Danh mục, trình độ và giảm giá (Mobile) */}
            <div className='mb-1.5 flex items-center justify-between gap-2 sm:mb-2'>
              <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                <span className='flex-shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 capitalize sm:px-2 sm:py-1 sm:text-xs'>
                  {course.category?.name}
                </span>
                {/* Huy hiệu trình độ - Chỉ mobile */}
                <Badge
                  variant={
                    course.level === 'beginner'
                      ? 'default'
                      : course.level === 'intermediate'
                        ? 'secondary'
                        : 'destructive'
                  }
                  className='px-1.5 py-0.5 text-[10px] font-medium capitalize sm:hidden'
                >
                  {course.level}
                </Badge>
                {/* Huy hiệu miễn phí - Chỉ mobile */}
                {course?.isFree && (
                  <Badge className='bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white sm:hidden'>
                    MIỄN PHÍ
                  </Badge>
                )}
              </div>
              {/* Huy hiệu giảm giá - Mobile */}
              {!course?.isFree && course.oldPrice > 0 && course.oldPrice > course.price && (
                <div className='flex-shrink-0 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white sm:hidden'>
                  {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% GIẢM
                </div>
              )}
            </div>

            {/* Tiêu đề */}
            <Link href={getRoutes.courseDetail(course.slug)} aria-label={`Xem khóa học: ${course.title}`}>
              <h3 className='mb-1 line-clamp-2 text-sm leading-tight font-semibold text-gray-900 transition-colors group-hover:text-blue-600 hover:text-blue-600 sm:mb-2 sm:text-lg md:text-xl'>
                {course.title}
              </h3>
            </Link>

            {/* Giảng viên - Ẩn trên mobile */}
            <p className='mb-2 hidden text-xs text-gray-500 sm:mb-3 sm:block sm:text-sm'>
              bởi <span className='font-medium text-gray-700'>{course.author?.username}</span>
            </p>

            {/* Mô tả/tóm tắt - Ẩn trên mobile */}
            <p className='mb-3 line-clamp-2 hidden text-xs leading-relaxed text-gray-600 sm:mb-4 sm:block sm:text-sm md:line-clamp-3'>
              {course?.excerpt}
            </p>

            {/* Thống kê */}
            <div className='mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-500 sm:mb-4 sm:gap-x-4 sm:text-sm md:gap-x-6'>
              <div className='flex items-center space-x-0.5 sm:space-x-1'>
                <Clock className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                <span>{formatDuration(course.totalDuration || 0)}</span>
              </div>
              <div className='flex items-center space-x-0.5 sm:space-x-1'>
                <Users className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                <span>{formatStudentCount(course.enrolledStudents || 0)}</span>
              </div>
              {/* Đánh giá - Chỉ mobile */}
              <div className='flex items-center space-x-0.5 sm:hidden'>
                <Star className='h-3 w-3 fill-current text-yellow-400' />
                <span className='font-medium text-gray-900'>{formatRating(course.averageRating || 0)}</span>
              </div>
            </div>
          </div>

          {/* Chân thẻ */}
          <div className='flex items-center justify-between gap-2'>
            {/* Đánh giá - Chỉ desktop */}
            <div className='hidden items-center space-x-1 sm:flex'>
              <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      i < Math.floor(course.averageRating || 0) ? 'fill-current text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className='text-xs font-medium text-gray-900 sm:text-sm'>
                {formatRating(course.averageRating || 0)}
              </span>
              <span className='text-xs text-gray-500 sm:text-sm'>({formatStudentCount(course.totalReviews || 0)})</span>
            </div>

            {/* Giá và nút hành động */}
            <div className='ml-auto flex items-center gap-2 sm:gap-3 md:gap-4'>
              {/* Giá */}
              <div className='text-right'>
                {course?.isFree ? (
                  <span
                    className='text-base font-bold text-green-600 sm:text-xl'
                    itemProp='price'
                    content='0'
                    aria-label='Khóa học miễn phí'
                  >
                    Miễn phí
                  </span>
                ) : (
                  <div className='flex flex-col items-end'>
                    {course.oldPrice && course.oldPrice > course.price && (
                      <span className='hidden text-xs text-gray-500 line-through sm:inline sm:text-sm'>
                        {formatPrice(course.oldPrice)}
                      </span>
                    )}
                    <span
                      className='text-sm font-bold text-gray-900 sm:text-lg md:text-xl'
                      itemProp='price'
                      content={course.price.toString()}
                    >
                      {formatPrice(course.price)}
                    </span>
                  </div>
                )}
              </div>

              {/* Nút */}
              <Button className='h-8 flex-shrink-0 px-2 text-[10px] sm:h-10 sm:px-4 sm:text-sm md:px-6' asChild>
                <Link
                  href={getRoutes.courseDetail(course.slug)}
                  aria-label={`${course?.isFree ? 'Bắt đầu học' : 'Đăng ký'} ${course.title}`}
                >
                  <BookOpen className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>{course?.isFree ? 'Bắt đầu học' : 'Đăng ký ngay'}</span>
                  <span className='sm:hidden'>{course?.isFree ? 'Học' : 'Đăng ký'}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseListItem
