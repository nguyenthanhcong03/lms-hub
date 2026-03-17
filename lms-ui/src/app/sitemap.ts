import { SEO_CONFIG } from '@/configs/seo'
import { MetadataRoute } from 'next'
import CoursesService from '@/services/courses'
import BlogsService from '@/services/blogs'

// Khai báo các route tĩnh và mức ưu tiên của chúng
const STATIC_ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const }, // Trang chủ
  { path: 'about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: 'courses', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: 'blogs', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: 'contact', priority: 0.6, changeFrequency: 'monthly' as const }
]

// Hàm lấy route động từ API/cơ sở dữ liệu
async function getDynamicRoutes() {
  try {
    // Lấy khóa học và bài viết song song bằng các service hiện có
    const [coursesData, blogsData] = await Promise.all([
      CoursesService.getPublicCourses({ limit: 1000 }), // Lấy toàn bộ khóa học public cho sitemap
      BlogsService.getPublishedBlogs({ limit: 1000, page: 1 }) // Lấy toàn bộ bài viết đã xuất bản cho sitemap
    ])

    return {
      courses: coursesData.courses || [],
      blogs: blogsData.blogs || []
    }
  } catch (error) {
    console.error('Lỗi khi lấy route động cho sitemap:', error)
    return { courses: [], blogs: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { courses, blogs } = await getDynamicRoutes()
  const currentDate = new Date()

  // Route tĩnh
  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SEO_CONFIG.siteUrl}/${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }))

  // URL khóa học động
  const courseUrls: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SEO_CONFIG.siteUrl}/courses/${course.slug}`,
    lastModified: course.updatedAt || course.createdAt || currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }))

  // URL bài viết động
  const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SEO_CONFIG.siteUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))

  // Gộp toàn bộ URL
  return [...staticUrls, ...courseUrls, ...blogUrls]
}
