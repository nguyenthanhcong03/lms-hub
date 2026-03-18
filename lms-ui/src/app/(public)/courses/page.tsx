import CoursesService from '@/services/courses'
import CoursesContent from './components/courses-content'
import CoursesHeader from './components/courses-header'

// Hàm lấy dữ liệu phía server
async function fetchInitialCoursesData() {
  try {
    const coursesData = await CoursesService.getPublicCourses({
      page: 1,
      limit: 10,
      sortBy: 'newest',
      sortOrder: 'desc'
    })
    return coursesData
  } catch {
    return {
      courses: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }
}

const CoursesPage = async () => {
  // Lấy dữ liệu khóa học ban đầu ở phía server
  const initialCoursesData = await fetchInitialCoursesData()

  return (
    <>
      {/* Phần đầu */}
      <CoursesHeader />

      {/* Truyền dữ liệu ban đầu cho thành phần client để lọc và phân trang */}
      <CoursesContent initialCoursesData={initialCoursesData} />
    </>
  )
}

export default CoursesPage
