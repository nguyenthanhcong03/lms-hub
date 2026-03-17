import { Course, ICourse } from '../models/course'
import { Blog, IBlog } from '../models/blog'
import { CourseStatus } from '../enums'

export interface SearchResult {
  courses: ICourse[]
  blogs: IBlog[]
}

/**
 * Dịch vụ tìm kiếm
 * Xử lý tìm kiếm trên khóa học và bài viết
 */
export class SearchService {
  /**
   * Tìm kiếm khóa học và bài viết dựa trên chuỗi truy vấn
   * Trả về 5 khóa học mới nhất và 5 bài viết mới nhất khớp với truy vấn
   */
  static async search(query: string): Promise<SearchResult> {
    // Tạo regex tìm kiếm không phân biệt hoa thường
    const searchRegex = new RegExp(query, 'i')

    // Tìm kiếm khóa học
    const courses = await Course.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { excerpt: { $regex: searchRegex } }
          ],
          status: CourseStatus.PUBLISHED
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          image: 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 }
    ])

    // Tìm kiếm bài viết
    const blogs = await Blog.aggregate([
      {
        $match: {
          $or: [{ title: { $regex: searchRegex } }, { excerpt: { $regex: searchRegex } }],
          status: 'published'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          thumbnail: 1,
          publishedAt: 1
        }
      },
      { $sort: { publishedAt: -1 } },
      { $limit: 5 }
    ])

    return {
      courses,
      blogs
    }
  }
}
