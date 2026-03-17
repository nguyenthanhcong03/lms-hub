'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getRoutes, ROUTE_CONFIG } from '@/configs/routes'
import { useSearch } from '@/hooks/use-search'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Sử dụng chức năng tìm kiếm thực với TanStack Query
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError
  } = useSearch(searchQuery)

  const courses = searchData?.courses || []
  const blogs = searchData?.blogs || []

  // Xử lý gửi tìm kiếm
  function handleSearchSubmit(query: string) {
    if (query.trim()) {
      setOpen(false)
      setSearchQuery('')
      router.push(getRoutes.searchWithQuery(query.trim()))
    }
  }

  // Xử lý chọn mục
  function handleItemSelect(type: 'course' | 'blog', slug: string) {
    setOpen(false)
    setSearchQuery('')
    if (type === 'course') {
      router.push(getRoutes.courseDetail(slug))
    } else {
      router.push(getRoutes.blogDetail(slug))
    }
  }

  // Xử lý khi bấm nút "Xem thêm"
  function handleViewMore(type: 'course' | 'blog') {
    setOpen(false)
    setSearchQuery('')
    if (type === 'course') {
      router.push(ROUTE_CONFIG.COURSES)
    } else {
      router.push(ROUTE_CONFIG.BLOGS)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='hover:text-primary group hover:bg-secondary relative h-8 w-8 rounded-full border border-transparent p-0 text-gray-500 transition-all duration-300 focus:outline-none sm:h-10 sm:w-10'
          aria-label='Mở hộp thoại tìm kiếm'
          aria-expanded={open}
          aria-haspopup='dialog'
        >
          <Search
            size={16}
            className='relative z-10 transition-transform duration-300 group-hover:scale-110 sm:h-[18px] sm:w-[18px]'
          />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[95vw] sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Tìm kiếm Khóa học & Bài viết</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Tìm kiếm khóa học, bài viết...'
              value={searchQuery}
              onValueChange={setSearchQuery}
              className='h-10 text-base sm:h-12'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchQuery)
                }
              }}
            />
            <CommandList className='max-h-72 sm:max-h-96'>
              {(searchLoading || searchFetching) && searchQuery.length >= 2 && (
                <div className='flex items-center justify-center py-8'>
                  <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                  <span className='ml-2 text-gray-600'>Đang tìm kiếm...</span>
                </div>
              )}

              {searchError && searchQuery.length >= 2 && (
                <div className='flex flex-col items-center justify-center py-8 text-center'>
                  <Search className='mb-3 h-12 w-12 text-red-400' />
                  <p className='text-lg font-medium text-red-600'>Đã xảy ra lỗi</p>
                  <p className='text-sm text-gray-500'>Vui lòng thử lại sau</p>
                </div>
              )}

              {!searchLoading &&
                !searchFetching &&
                !searchError &&
                searchQuery.length >= 2 &&
                courses.length === 0 &&
                blogs.length === 0 && (
                  <CommandEmpty>
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                      <Search className='text-muted-foreground mb-3 h-12 w-12' />
                      <p className='text-lg font-medium'>Không tìm thấy kết quả</p>
                      <p className='text-muted-foreground text-sm'>Thử tìm kiếm với từ khóa khác</p>
                      <button
                        onClick={() => handleSearchSubmit(searchQuery)}
                        className='mt-3 text-sm text-blue-600 underline hover:text-blue-800'
                        aria-label={`Xem tất cả kết quả tìm kiếm cho "${searchQuery}"`}
                      >
                        Xem tất cả kết quả tìm kiếm
                      </button>
                    </div>
                  </CommandEmpty>
                )}

              {searchQuery.length < 2 && (
                <div className='flex flex-col items-center justify-center py-8 text-center'>
                  <Search className='text-muted-foreground mb-3 h-12 w-12' />
                  <p className='text-lg font-medium'>Tìm kiếm khóa học và bài viết</p>
                  <p className='text-muted-foreground text-sm'>Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm</p>
                </div>
              )}

              {/* Nhóm khóa học */}
              {!searchLoading && !searchFetching && courses.length > 0 && (
                <CommandGroup>
                  <div className='mb-2 flex items-center justify-between border-b px-2 py-3 sm:py-4'>
                    <h3 className='text-sm font-semibold tracking-wide text-gray-900 uppercase'>KHÓA HỌC</h3>
                    <button
                      onClick={() => handleViewMore('course')}
                      className='min-h-[44px] px-2 text-sm text-gray-500 transition-colors hover:text-blue-600'
                      aria-label='Xem thêm khóa học'
                    >
                      Xem thêm
                    </button>
                  </div>
                  {courses.slice(0, 3).map((course) => (
                    <CommandItem
                      key={course._id}
                      value={course.title}
                      onSelect={() => handleItemSelect('course', course.slug)}
                      className='flex min-h-[60px] cursor-pointer items-center gap-3 border-none p-3 hover:bg-gray-50 sm:min-h-[auto] sm:p-2'
                    >
                      <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600'>
                        {course?.image ? (
                          <Image
                            src={course.image}
                            alt={course?.title || 'Khóa học'}
                            fill
                            className='object-cover'
                            sizes='48px'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center'>
                            <span className='text-lg font-semibold text-white'>
                              {course.title?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='truncate text-sm font-medium text-gray-900'>{course?.title}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Nhóm bài viết */}
              {!searchLoading && !searchFetching && blogs.length > 0 && (
                <CommandGroup>
                  <div className='flex items-center justify-between border-b px-2 py-3 sm:p-4'>
                    <h3 className='text-sm font-semibold tracking-wide text-gray-900 uppercase'>BÀI VIẾT</h3>
                    <button
                      onClick={() => handleViewMore('blog')}
                      className='min-h-[44px] px-2 text-sm text-gray-500 transition-colors hover:text-blue-600'
                      aria-label='Xem thêm bài viết'
                    >
                      Xem thêm
                    </button>
                  </div>
                  {blogs.slice(0, 3).map((blog) => (
                    <CommandItem
                      key={blog._id}
                      value={blog.title}
                      onSelect={() => handleItemSelect('blog', blog.slug)}
                      className='flex min-h-[60px] cursor-pointer items-center gap-3 border-none p-3 hover:bg-gray-50 sm:min-h-[auto] sm:p-4'
                    >
                      <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-orange-400'>
                        {blog?.thumbnail ? (
                          <Image
                            src={blog.thumbnail}
                            alt={blog?.title || 'Bài viết'}
                            fill
                            className='object-cover'
                            sizes='48px'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center'>
                            <span className='text-lg font-semibold text-white'>
                              {blog.title?.charAt(0)?.toUpperCase() || 'B'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='line-clamp-2 text-sm leading-relaxed font-medium text-gray-900'>
                          {blog?.title}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}
