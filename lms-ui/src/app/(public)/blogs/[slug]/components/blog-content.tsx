'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTE_CONFIG } from '@/configs/routes'
import { IBlog } from '@/types/blog'

interface BlogContentProps {
  blog: IBlog
}

// Thành phần nội dung blog (phần dưới) - Hàm mũi tên
const BlogContent = ({ blog }: BlogContentProps) => {
  return (
    <>
      {/* Nội dung bài viết */}
      <article className='mb-8 max-w-none sm:mb-10 md:mb-12'>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} className='rich-content' />
      </article>

      {/* Chân trang bài viết */}
      <footer className='mt-10 border-t border-gray-200 pt-6 sm:mt-12 sm:pt-8 md:mt-16'>
        <div className='flex justify-center'>
          <Link href={ROUTE_CONFIG.BLOGS} aria-label='Quay về tất cả bài viết'>
            <Button variant='outline' size='lg' className='h-10 px-6 text-sm sm:h-12 sm:px-8 sm:text-base'>
              <ArrowLeft className='mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4' />
              Về tất cả bài viết
            </Button>
          </Link>
        </div>
      </footer>
    </>
  )
}

export default BlogContent
