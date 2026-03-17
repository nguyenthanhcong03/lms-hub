'use client'

import { CourseCard } from '@/components/course/course-card'
import { Button } from '@/components/ui/button'
import type { IPublicCourse } from '@/types/course'
import { Filter } from 'lucide-react'

interface CoursesGridProps {
  courses: IPublicCourse[]
  isLoading: boolean
}

const CoursesGrid = ({ courses, isLoading }: CoursesGridProps) => {
  // Trạng thái đang tải
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white sm:rounded-xl'
          >
            <div className='aspect-video bg-gray-200'></div>
            <div className='space-y-3 p-4 sm:space-y-4 sm:p-6'>
              <div className='h-3 rounded bg-gray-200 sm:h-4'></div>
              <div className='h-3 w-3/4 rounded bg-gray-200 sm:h-4'></div>
              <div className='h-3 w-1/2 rounded bg-gray-200 sm:h-4'></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Không có kết quả */}
      {!isLoading && courses.length === 0 && (
        <div className='px-4 py-12 text-center sm:py-16 lg:py-20'>
          <div className='mb-3 sm:mb-4'>
            <Filter className='mx-auto h-12 w-12 text-gray-400 sm:h-16 sm:w-16' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-900 sm:text-xl'>Không tìm thấy khóa học nào</h3>
          <p className='mx-auto mb-4 max-w-md text-sm text-gray-600 sm:mb-6 sm:text-base'>
            Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để tìm nội dung bạn đang cần.
          </p>
          <Button variant='outline' className='h-9 text-sm sm:h-10 sm:text-base'>
            Xóa tất cả bộ lọc
          </Button>
        </div>
      )}

      {/* Lưới khóa học */}
      {!isLoading && courses.length > 0 && (
        <div className='grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {courses.map((course: IPublicCourse) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CoursesGrid
