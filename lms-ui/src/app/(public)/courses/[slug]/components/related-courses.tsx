'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'
import { useRelatedCourses } from '@/hooks/use-courses'
import { CourseCard } from '@/components/course/course-card'

interface RelatedCoursesProps {
  currentCourseId: string
}

// Component skeleton cho thẻ khóa học
function CourseCardSkeleton() {
  return (
    <Card className='h-full'>
      <CardContent className='p-0'>
        <div className='relative aspect-video'>
          <Skeleton className='h-full w-full rounded-t-lg' />
        </div>
        <div className='space-y-3 p-4'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-12 w-full' />
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-6 w-16' />
          </div>
          <Skeleton className='h-10 w-full' />
        </div>
      </CardContent>
    </Card>
  )
}

const RelatedCourses = ({ currentCourseId }: RelatedCoursesProps) => {
  const { data: relatedCourses, isLoading, error } = useRelatedCourses(currentCourseId)

  // Không render nếu không có khóa học, không còn loading hoặc có lỗi
  if (!isLoading && (!relatedCourses || relatedCourses.length === 0 || error)) {
    return null
  }

  return (
    <div className='relative container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
      {/* Phần đầu khu vực */}
      <div className='mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
        <div>
          <h2 className='mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl'>Khóa học liên quan</h2>
          <p className='text-sm text-gray-600 sm:text-base'>Các khóa học thường được mua cùng với khóa học này</p>
        </div>
        {!isLoading && relatedCourses && relatedCourses.length > 0 && (
          <Button variant='outline' className='hidden h-10 text-sm md:flex'>
            Xem tất cả khóa học liên quan
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Trạng thái đang tải */}
      {isLoading && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
          {Array.from({ length: 4 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Lưới khóa học */}
      {!isLoading && relatedCourses && relatedCourses.length > 0 && (
        <>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
            {relatedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* Nút xem tất cả trên mobile */}
          <div className='mt-6 text-center sm:mt-8 md:hidden'>
            <Button variant='outline' className='h-10 w-full text-sm'>
              Xem tất cả khóa học liên quan
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default RelatedCourses
