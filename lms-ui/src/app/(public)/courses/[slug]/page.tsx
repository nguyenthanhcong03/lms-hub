import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import CoursesService from '@/services/courses'
import CourseContent from './components/course-content'

// Import động cho các component nặng
const CourseHero = dynamic(() => import('./components/course-hero')) // Có thể SSR

const RelatedCourses = dynamic(() => import('./components/related-courses')) // Có thể SSR

interface CourseDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Hàm lấy dữ liệu phía server
async function fetchCourseData(slug: string) {
  try {
    const course = await CoursesService.getPublicCourseBySlug(slug)
    return course
  } catch {
    return null
  }
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const resolvedParams = await params

  // Lấy dữ liệu khóa học ở phía server
  const course = await fetchCourseData(resolvedParams.slug)

  // Nếu không tìm thấy khóa học, kích hoạt trang not-found của Next.js
  if (!course) {
    notFound()
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Phần hero của khóa học */}
      <CourseHero course={course} />

      <CourseContent course={course} />

      {/* Khóa học liên quan */}
      <RelatedCourses currentCourseId={course._id} />
    </div>
  )
}

export default CourseDetailPage
