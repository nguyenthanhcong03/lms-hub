'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { usePublicCourses } from '@/hooks/use-courses'
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { PublicCoursesListResponse } from '@/types/course'

// Import động cho các component nặng
const CoursesFilters = dynamic(() => import('./courses-filters'), {
  ssr: false // Component tương tác phía client có state
})

const CoursesGrid = dynamic(() => import('./courses-grid')) // Có thể SSR

const CoursesList = dynamic(() => import('./courses-list')) // Có thể SSR

// Import tĩnh cho component nhẹ
import CoursesPagination from './courses-pagination'

interface CoursesContentProps {
  initialCoursesData: PublicCoursesListResponse
}

const CoursesContent = ({ initialCoursesData }: CoursesContentProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUsingInitialData, setIsUsingInitialData] = useState(true)

  // Tạo tham số API từ state
  const apiParams = {
    page: currentPage,
    limit: 10, // Giới hạn chuẩn cho dạng lưới
    ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
    ...(selectedLevels.length > 0 && { level: selectedLevels }),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    ...(selectedRating > 0 && { minRating: selectedRating }),
    ...(sortBy && {
      sortBy: sortBy === 'price-low' || sortBy === 'price-high' ? 'price' : sortBy,
      sortOrder:
        sortBy === 'price-high' || sortBy === 'rating' || sortBy === 'popular' ? ('desc' as const) : ('asc' as const)
    })
  }

  // Kiểm tra nên dùng dữ liệu ban đầu hay gọi dữ liệu mới
  const shouldUseInitialData =
    isUsingInitialData &&
    currentPage === 1 &&
    selectedCategory === 'all' &&
    priceRange[0] === 0 &&
    priceRange[1] === 5000000 &&
    selectedLevels.length === 0 &&
    selectedRating === 0 &&
    sortBy === 'newest'

  // Lấy danh sách khóa học qua API (chỉ khi không dùng dữ liệu ban đầu)
  const { data: coursesResponse, isLoading } = usePublicCourses(apiParams, {
    enabled: !shouldUseInitialData
  })

  // Xác định nguồn dữ liệu sẽ dùng
  const dataToUse = shouldUseInitialData ? initialCoursesData : coursesResponse
  const courses = dataToUse?.courses || []
  const pagination = dataToUse?.pagination

  // Đặt về trang 1 khi bộ lọc thay đổi và đánh dấu không dùng dữ liệu ban đầu nữa
  useEffect(() => {
    setCurrentPage(1)
    setIsUsingInitialData(false)
  }, [selectedCategory, priceRange, selectedLevels, selectedRating, sortBy])

  // Đánh dấu không dùng dữ liệu ban đầu nữa khi đổi trang (không áp dụng cho trang 1)
  useEffect(() => {
    if (currentPage !== 1) {
      setIsUsingInitialData(false)
    }
  }, [currentPage])

  return (
    <div className='container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
      <div className='flex gap-6 lg:gap-8'>
        {/* Sidebar bộ lọc - màn hình lớn */}
        <div className='hidden w-64 flex-shrink-0 lg:block'>
          <div className='sticky top-32'>
            <CoursesFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedLevels={selectedLevels}
              onLevelsChange={setSelectedLevels}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
            />
          </div>
        </div>

        {/* Nội dung chính */}
        <div className='min-w-0 flex-1'>
          {/* Số lượng kết quả và điều khiển */}
          <div className='mb-4 flex flex-col items-stretch gap-3 sm:mb-6 sm:flex-row sm:items-center'>
            {/* Nút bộ lọc mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' className='w-full sm:w-auto lg:hidden'>
                  <SlidersHorizontal className='mr-2 h-4 w-4' />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-[280px] overflow-y-auto p-0 sm:w-[340px]'>
                <SheetHeader className='sr-only'>
                  <SheetTitle>Bộ lọc</SheetTitle>
                </SheetHeader>
                <div className='px-6 pt-6 pb-6'>
                  <CoursesFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    selectedLevels={selectedLevels}
                    onLevelsChange={setSelectedLevels}
                    selectedRating={selectedRating}
                    onRatingChange={setSelectedRating}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Điều khiển bên phải */}
            <div className='flex items-center gap-2 sm:ml-auto sm:gap-3'>
              {/* Dropdown sắp xếp */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='h-10 w-full sm:w-[160px] md:w-[180px]'>
                  <SelectValue placeholder='Sắp xếp theo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>Mới nhất</SelectItem>
                  <SelectItem value='popular'>Phổ biến nhất</SelectItem>
                  <SelectItem value='rating'>Đánh giá cao nhất</SelectItem>
                  <SelectItem value='price-low'>Giá: thấp đến cao</SelectItem>
                  <SelectItem value='price-high'>Giá: cao đến thấp</SelectItem>
                  <SelectItem value='alphabetical'>A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Chuyển chế độ hiển thị */}
              <div className='flex items-center rounded-lg border border-gray-200 p-1'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className='h-8 w-8 p-0'
                >
                  <Grid3X3 className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className='h-8 w-8 p-0'
                >
                  <List className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Hiển thị khóa học */}
          {viewMode === 'grid' ? (
            <CoursesGrid courses={courses} isLoading={isLoading && !shouldUseInitialData} />
          ) : (
            <CoursesList courses={courses} isLoading={isLoading && !shouldUseInitialData} />
          )}

          {/* Phân trang */}
          <CoursesPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={pagination?.totalPages || 1}
          />
        </div>
      </div>
    </div>
  )
}

export default CoursesContent
