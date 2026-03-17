'use client'

import { useState } from 'react'
import * as React from 'react'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { usePublishedBlogs } from '@/hooks/use-blogs'
import { IBlog } from '@/types/blog'
import { BlogCardSkeleton } from '@/components/blog/blog-card-skeleton'
import { BlogCard } from '@/components/blog/blog-card'

// Thành phần nội dung blog - Hàm mũi tên
const BlogsContent = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [allBlogs, setAllBlogs] = useState<IBlog[]>([])

  // Lấy danh sách blog
  const { data: blogsData, isLoading } = usePublishedBlogs({
    page: currentPage,
    limit: 12
  })

  const pagination = blogsData?.pagination

  // Cập nhật allBlogs khi có dữ liệu mới
  React.useEffect(() => {
    if (blogsData?.blogs) {
      if (currentPage === 1) {
        // Đặt lại cho lần tải đầu tiên
        setAllBlogs(blogsData.blogs)
      } else {
        // Nối thêm khi tải thêm
        setAllBlogs((prev) => [...prev, ...blogsData.blogs])
      }
    }
  }, [blogsData, currentPage])

  // Xử lý tải thêm - Hàm mũi tên
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  return (
    <>
      {/* Lưới/danh sách blog */}
      {isLoading && currentPage === 1 ? (
        <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 12 }, (_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : allBlogs.length > 0 ? (
        <>
          {/* Lưới blog */}
          <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
            {allBlogs.map((blog) => (
              <BlogCard key={blog._id} post={blog} />
            ))}

            {/* Skeleton khi tải thêm */}
            {isLoading &&
              currentPage > 1 &&
              Array.from({ length: 12 }, (_, i) => <BlogCardSkeleton key={`loading-${i}`} />)}
          </div>

          {/* Nút tải thêm */}
          {pagination && pagination.hasNextPage && !isLoading && (
            <div className='flex justify-center'>
              <Button
                variant='outline'
                size='lg'
                onClick={handleLoadMore}
                className='h-10 px-6 py-2.5 text-sm sm:h-12 sm:px-8 sm:py-3 sm:text-base'
              >
                Tải thêm bài viết
              </Button>
            </div>
          )}

          {/* Thông báo hết kết quả */}
          {pagination && !pagination.hasNextPage && allBlogs.length > 0 && (
            <div className='py-6 text-center sm:py-8'>
              <p className='text-xs text-gray-500 sm:text-sm'>Bạn đã xem hết tất cả bài viết</p>
            </div>
          )}
        </>
      ) : (
        <div className='px-4 py-12 text-center sm:py-16 md:py-20'>
          <BookOpen className='mx-auto mb-3 h-10 w-10 text-gray-400 sm:mb-4 sm:h-12 sm:w-12' />
          <h3 className='mb-1.5 text-base font-medium text-gray-900 sm:mb-2 sm:text-lg'>Không tìm thấy bài viết nào</h3>
          <p className='text-sm text-gray-600 sm:text-base'>Hãy quay lại sau để xem các bài viết và chia sẻ mới.</p>
        </div>
      )}
    </>
  )
}

export default BlogsContent
