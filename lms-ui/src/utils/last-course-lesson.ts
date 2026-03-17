// Các hàm tiện ích quản lý bài học gần nhất trong localStorage

export interface LastCourseLesson {
  course: string
  lesson: string
}

const STORAGE_KEY = 'lastCourseLesson'

/**
 * Get all last course lessons from localStorage
 */
export function getAllLastCourseLessons(): LastCourseLesson[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Get the last lesson for a specific course
 */
export function getLastLessonForCourse(courseSlug: string): string | null {
  try {
    const allCourseLessons = getAllLastCourseLessons()
    const courseEntry = allCourseLessons.find((entry) => entry.course === courseSlug)
    return courseEntry?.lesson || null
  } catch {
    return null
  }
}

/**
 * Save or update the last lesson for a specific course
 */
export function saveLastLessonForCourse(courseSlug: string, lessonId: string): void {
  try {
    const allCourseLessons = getAllLastCourseLessons()

    // Tìm mục đã tồn tại của khóa học hiện tại
    const existingIndex = allCourseLessons.findIndex((entry) => entry.course === courseSlug)

    const newEntry: LastCourseLesson = {
      course: courseSlug,
      lesson: lessonId
    }

    if (existingIndex >= 0) {
      // Cập nhật mục đã tồn tại
      allCourseLessons[existingIndex] = newEntry
    } else {
      // Thêm mục mới
      allCourseLessons.push(newEntry)
    }

    // Lưu mảng đã cập nhật vào localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCourseLessons))
  } catch (error) {
    console.error('Không thể lưu bài học gần nhất cho khóa học:', error)
  }
}
