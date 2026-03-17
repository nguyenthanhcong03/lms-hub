'use client'

import * as React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBlogBySlug } from '@/hooks/use-blogs'
import { BlogPostSkeleton } from '@/components/blog/blog-post-skeleton'
import { ROUTE_CONFIG } from '@/configs/routes'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Import tĩnh cho nội dung quan trọng ở vùng đầu trang
import BlogHeader from './components/blog-header'

// Tải động cho phần nội dung nặng
const BlogContent = dynamic(() => import('./components/blog-content'))

// Trang chi tiết bài blog - Hàm mũi tên
const BlogPostPage = ({ params }: BlogPostPageProps) => {
  const resolvedParams = React.use(params)

  const { data: blog, isLoading } = useBlogBySlug(resolvedParams.slug)

  if (isLoading || !resolvedParams.slug) {
    return <BlogPostSkeleton />
  }

  if (!blog) {
    return (
      <div className='container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-3 px-4 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl'>
            Không tìm thấy bài viết
          </h1>
          <p className='mb-6 px-4 text-base text-gray-600 sm:mb-8 sm:text-lg md:text-xl'>
            Bài viết bạn đang tìm không tồn tại hoặc đã bị gỡ.
          </p>
          <Link href={ROUTE_CONFIG.BLOGS}>
            <Button className='h-10 text-sm sm:h-11 sm:text-base'>
              <ArrowLeft className='mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4' />
              Về trang blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20'>
        <div className='mx-auto max-w-4xl'>
          {/* Nội dung quan trọng ở vùng đầu trang - tải ngay */}
          <BlogHeader blog={blog} />

          {/* Nội dung phía dưới - tải dần */}
          <BlogContent blog={blog} />
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
