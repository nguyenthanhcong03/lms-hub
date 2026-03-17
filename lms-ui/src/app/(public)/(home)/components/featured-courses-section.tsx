import { CourseCard } from '@/components/course/course-card'
import { ROUTE_CONFIG } from '@/configs/routes'
import type { IPublicCourse, PublicCoursesListResponse } from '@/types/course'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface FeaturedCoursesSectionProps {
  coursesData: PublicCoursesListResponse
}

const FeaturedCoursesSection = ({ coursesData }: FeaturedCoursesSectionProps) => {
  const featuredCourses = coursesData?.courses || []

  return (
    <section className='bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-20'>
      <div className='container mx-auto px-4 sm:px-6'>
        {/* Tiêu đề phần */}
        <div className='mb-8 text-center sm:mb-10 lg:mb-12'>
          {/* Huy hiệu */}
          <div className='mb-3 inline-flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-2 text-blue-700 sm:mb-4 sm:px-4'>
            <TrendingUp className='h-3 w-3 sm:h-4 sm:w-4' />
            <span className='text-xs font-medium sm:text-sm'>Phổ biến nhất</span>
          </div>

          {/* Tiêu đề chính */}
          <h2 className='mb-3 px-4 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl'>
            Khóa học nổi bật
          </h2>
          <p className='mx-auto max-w-3xl px-4 text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl'>
            Khám phá những khóa học được yêu thích và đánh giá cao nhất, được chọn lọc để giúp bạn làm chủ các kỹ năng
            đang được săn đón và phát triển sự nghiệp.
          </p>
        </div>

        {/* Liên kết xem tất cả */}
        <div className='mb-4 flex justify-center px-4 sm:mb-6 sm:justify-end sm:px-0'>
          <Link
            href={ROUTE_CONFIG.COURSES}
            className='group inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 sm:text-base'
          >
            Xem tất cả khóa học
            <ArrowRight className='ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4' />
          </Link>
        </div>

        {/* Lưới khóa học */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4'>
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course: IPublicCourse) => <CourseCard key={course._id} course={course} />)
          ) : (
            <div className='col-span-full px-4 py-8 text-center sm:py-12'>
              <div className='mx-auto max-w-md'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 sm:h-20 sm:w-20'>
                  <TrendingUp className='h-6 w-6 text-gray-400 sm:h-8 sm:w-8' />
                </div>
                <h3 className='mb-2 text-lg font-semibold text-gray-700 sm:text-xl'>Hiện chưa có khóa học</h3>
                <p className='text-sm text-gray-600 sm:text-base'>
                  Hiện chưa có khóa học nổi bật. Hãy quay lại sớm để xem nội dung mới!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCoursesSection
