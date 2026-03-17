'use client'

import dynamic from 'next/dynamic'
import { BookOpen } from 'lucide-react'

// Tải động nội dung phía dưới màn hình đầu tiên (tải dần)
const BlogsContent = dynamic(() => import('./components/blogs-content'))

// Thành phần tiêu đề (vùng hiển thị đầu tiên, quan trọng) - Hàm mũi tên
const BlogsHeader = () => (
  <div className='mb-10 text-center sm:mb-12 md:mb-16'>
    <div className='mb-3 inline-flex items-center space-x-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-blue-700 sm:mb-4 sm:space-x-2 sm:px-4 sm:py-2'>
      <BookOpen className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
      <span className='text-xs font-medium sm:text-sm'>Blog của chúng tôi</span>
    </div>
    <h1 className='mb-3 px-4 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl'>
      Bài viết và chia sẻ mới nhất
    </h1>
    <p className='mx-auto max-w-3xl px-4 text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl'>
      Khám phá kiến thức, hướng dẫn và tin tức ngành từ đội ngũ chuyên gia. Luôn cập nhật xu hướng mới nhất và các thực
      hành tốt nhất.
    </p>
  </div>
)

// Thành phần trang chính - Hàm mũi tên
const BlogPage = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20'>
        {/* Nội dung quan trọng ở vùng đầu trang - tải ngay */}
        <BlogsHeader />

        {/* Nội dung phía dưới - tải dần, vẫn thân thiện SEO */}
        <BlogsContent />
      </div>
    </div>
  )
}

export default BlogPage
