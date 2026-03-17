import { Metadata } from 'next'
import { generateMetadata } from './seo-head'
import { PAGE_SEO, SEO_TEMPLATES } from '@/configs/seo'

// SEO trang chủ - dùng trực tiếp tiêu đề mặc định để tránh lặp lại
export function generateHomeMetadata(): Metadata {
  return generateMetadata({
    title: '', // Tiêu đề rỗng nghĩa là dùng tiêu đề mặc định không kèm template
    description: PAGE_SEO.home.description,
    canonical: '/',
    openGraph: {
      type: 'website',
      title: PAGE_SEO.home.title, // Dùng tiêu đề trang cho OpenGraph
      description: PAGE_SEO.home.description
    }
  })
}

// SEO trang giới thiệu
export function generateAboutMetadata(): Metadata {
  return generateMetadata({
    title: PAGE_SEO.about.title,
    description: PAGE_SEO.about.description,
    canonical: '/about',
    openGraph: {
      type: 'website',
      title: PAGE_SEO.about.title,
      description: PAGE_SEO.about.description
    }
  })
}

// SEO trang khóa học
export function generateCoursesMetadata(): Metadata {
  return generateMetadata({
    title: PAGE_SEO.courses.title,
    description: PAGE_SEO.courses.description,
    canonical: '/courses',
    openGraph: {
      type: 'website',
      title: PAGE_SEO.courses.title,
      description: PAGE_SEO.courses.description
    }
  })
}

// SEO trang blog
export function generateBlogMetadata(): Metadata {
  return generateMetadata({
    title: PAGE_SEO.blog.title,
    description: PAGE_SEO.blog.description,
    canonical: '/blogs',
    openGraph: {
      type: 'website',
      title: PAGE_SEO.blog.title,
      description: PAGE_SEO.blog.description
    }
  })
}

// SEO trang liên hệ
export function generateContactMetadata(): Metadata {
  return generateMetadata({
    title: PAGE_SEO.contact.title,
    description: PAGE_SEO.contact.description,
    canonical: '/contact',
    openGraph: {
      type: 'website',
      title: PAGE_SEO.contact.title,
      description: PAGE_SEO.contact.description
    }
  })
}

// SEO trang giỏ hàng
export function generateCartMetadata(): Metadata {
  return generateMetadata({
    title: 'Giỏ hàng - Hoàn tất mua khóa học',
    description:
      'Xem lại các khóa học đã chọn và hoàn tất thanh toán. Thanh toán an toàn với quyền truy cập trọn đời vào khóa học.',
    canonical: '/cart',
    openGraph: {
      type: 'website',
      title: 'Giỏ hàng - Hoàn tất mua khóa học',
      description: 'Xem lại các khóa học đã chọn và hoàn tất thanh toán.'
    },
    noIndex: true // Trang giỏ hàng không nên được lập chỉ mục
  })
}

// SEO trang hồ sơ
export function generateProfileMetadata(): Metadata {
  return generateMetadata({
    title: 'Hồ sơ của tôi - Quản lý hành trình học tập',
    description: 'Quản lý hồ sơ LMSHub, theo dõi tiến độ học, xem chứng chỉ và tùy chỉnh trải nghiệm học tập của bạn.',
    canonical: '/my-profile',
    openGraph: {
      type: 'profile',
      title: 'Hồ sơ của tôi - Quản lý hành trình học tập',
      description: 'Quản lý hồ sơ LMSHub và theo dõi tiến độ học tập của bạn.'
    },
    noIndex: true // Trang hồ sơ không nên được lập chỉ mục
  })
}

// SEO trang khóa học chi tiết
export function generateCourseMetadata(course: {
  title: string
  description: string
  slug: string
  thumbnail?: string
  instructor?: { name: string }
  level?: string
  category?: string
}): Metadata {
  const title = SEO_TEMPLATES.course.title.replace('%s', course.title)
  const description = course.description.slice(0, 160) + (course.description.length > 160 ? '...' : '')

  const keywords = [
    course.title.toLowerCase(),
    `${course.title.toLowerCase()} khóa học`,
    'khóa học online',
    'học ' + course.title.toLowerCase()
  ]

  if (course.category) {
    keywords.push(course.category.toLowerCase())
  }

  if (course.instructor) {
    keywords.push(course.instructor.name.toLowerCase())
  }

  if (course.level) {
    keywords.push(`${course.level.toLowerCase()} trình độ`)
  }

  return generateMetadata({
    title,
    description,
    keywords,
    canonical: `/courses/${course.slug}`,
    openGraph: {
      type: 'article',
      title,
      description,
      image: course.thumbnail
    }
  })
}

// SEO bài viết blog chi tiết
export function generateBlogPostMetadata(blog: {
  title: string
  description: string
  slug: string
  thumbnail?: string
  author?: { name: string }
  createdAt: string
  tags?: string[]
}): Metadata {
  const title = SEO_TEMPLATES.blog.title.replace('%s', blog.title)
  const description = blog.description.slice(0, 160) + (blog.description.length > 160 ? '...' : '')

  const keywords = [blog.title.toLowerCase(), 'blog giáo dục', 'mẹo học tập']

  if (blog.tags) {
    keywords.push(...blog.tags.map((tag) => tag.toLowerCase()))
  }

  if (blog.author) {
    keywords.push(blog.author.name.toLowerCase())
  }

  return generateMetadata({
    title,
    description,
    keywords,
    canonical: `/blogs/${blog.slug}`,
    openGraph: {
      type: 'article',
      title,
      description,
      image: blog.thumbnail
    },
    twitter: {
      title,
      description,
      image: blog.thumbnail
    }
  })
}

// SEO trang học tập (được bảo vệ)
export function generateLearningMetadata(course: { title: string; slug: string }): Metadata {
  return generateMetadata({
    title: `Học tập: ${course.title}`,
    description: `Tiếp tục học ${course.title}. Truy cập tài liệu khóa học, theo dõi tiến độ và hoàn thành bài học.`,
    canonical: `/learning/${course.slug}`,
    noIndex: true, // Trang học tập không nên được lập chỉ mục
    noFollow: true,
    openGraph: {
      type: 'website',
      title: `Học tập: ${course.title}`,
      description: `Tiếp tục học ${course.title}`
    }
  })
}

// SEO kết quả tìm kiếm
export function generateSearchMetadata(query?: string): Metadata {
  const title = query ? `Kết quả tìm kiếm cho "${query}" | LMSHub` : 'Tìm kiếm khóa học và bài viết | LMSHub'

  const description = query
    ? `Tìm khóa học và bài viết liên quan đến "${query}". Khám phá nội dung học tập và tài nguyên giáo dục phù hợp.`
    : 'Tìm kiếm trong thư viện khóa học và bài viết giáo dục phong phú của chúng tôi. Tìm nội dung học tập phù hợp với nhu cầu của bạn.'

  return generateMetadata({
    title,
    description,
    canonical: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    keywords: query ? [query, 'tìm kiếm', 'khóa học', 'bài viết'] : ['tìm kiếm', 'khóa học', 'bài viết'],
    noIndex: !query, // Chỉ lập chỉ mục kết quả tìm kiếm có truy vấn
    openGraph: {
      type: 'website',
      title,
      description
    }
  })
}

// SEO trang danh mục
export function generateCategoryMetadata(category: { name: string; description?: string; slug: string }): Metadata {
  const title = `Khóa học ${category.name} | LMSHub`
  const description =
    category.description ||
    `Khám phá các khóa học ${
      category.name
    } trên LMSHub. Học cùng giảng viên giàu kinh nghiệm và nâng cao kỹ năng của bạn trong lĩnh vực ${category.name.toLowerCase()}.`

  return generateMetadata({
    title,
    description,
    keywords: [category.name.toLowerCase(), `${category.name.toLowerCase()} khóa học`, 'học trực tuyến'],
    canonical: `/categories/${category.slug}`,
    openGraph: {
      type: 'website',
      title,
      description
    }
  })
}
