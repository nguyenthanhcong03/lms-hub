'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAllCategories } from '@/hooks/use-categories'
import type { ICategory } from '@/types/category'
import { Star, TrendingUp, RotateCcw, Folder } from 'lucide-react'

// Mở rộng interface danh mục với số lượng khóa học
interface ICategoryWithCount extends ICategory {
  courseCount?: number
}

interface CoursesFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
  selectedLevels: string[]
  onLevelsChange: (levels: string[]) => void
  selectedRating: number
  onRatingChange: (rating: number) => void
}

const levels = [
  { id: 'beginner', name: 'Cơ bản', count: 623 },
  { id: 'intermediate', name: 'Trung cấp', count: 412 },
  { id: 'advanced', name: 'Nâng cao', count: 212 }
]

const priceRanges = [
  { id: 'free', label: 'Miễn phí', range: [0, 0] },
  { id: 'under-500k', label: 'Dưới 500K', range: [0, 500000] },
  { id: '500k-1m', label: '500K-1M', range: [500000, 1000000] },
  { id: '1m-3m', label: '1M-3M', range: [1000000, 3000000] },
  { id: '3m-5m', label: '3M-5M', range: [3000000, 5000000] },
  { id: '5m-plus', label: '5M+', range: [5000000, 10000000] }
]

const CoursesFilters = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedLevels,
  onLevelsChange,
  selectedRating,
  onRatingChange
}: CoursesFiltersProps) => {
  // Lấy danh mục từ API
  const { data: categoriesData, isLoading: categoriesLoading } = useAllCategories()

  // Chuyển đổi dữ liệu danh mục để khớp cấu trúc component
  const categories = React.useMemo(() => {
    if (!categoriesData) return []

    // Ép kiểu dữ liệu danh mục để có courseCount
    const categoriesWithCount = categoriesData as ICategoryWithCount[]

    // Tính tổng số khóa học của tất cả danh mục
    const totalCourses = categoriesWithCount.reduce((sum, cat) => sum + (cat.courseCount || 0), 0)

    // Thêm tùy chọn "Tất cả danh mục" ở đầu danh sách
    const allCategoriesOption = {
      id: 'all',
      name: 'Tất cả danh mục',
      icon: TrendingUp,
      count: totalCourses
    }

    // Chuyển dữ liệu danh mục từ API sang định dạng component
    const transformedCategories = categoriesWithCount.map((category) => ({
      id: category._id,
      name: category.name,
      icon: Folder,
      count: category.courseCount || 0
    }))

    return [allCategoriesOption, ...transformedCategories]
  }, [categoriesData])

  const handleLevelToggle = (levelId: string) => {
    onLevelsChange(
      selectedLevels.includes(levelId) ? selectedLevels.filter((id) => id !== levelId) : [...selectedLevels, levelId]
    )
  }

  const clearAllFilters = () => {
    onCategoryChange('all')
    onPriceRangeChange([0, 5000000])
    onLevelsChange([])
    onRatingChange(0)
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Phần đầu bộ lọc */}
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-semibold text-gray-900 sm:text-lg'>Bộ lọc</h3>
        <Button
          variant='ghost'
          size='sm'
          onClick={clearAllFilters}
          className='h-8 text-xs text-blue-600 hover:text-blue-700 sm:h-9 sm:text-sm'
        >
          <RotateCcw className='mr-1 h-3 w-3 sm:h-4 sm:w-4' />
          Xóa tất cả
        </Button>
      </div>

      {/* Danh mục */}
      <div>
        <h4 className='mb-2 text-sm font-medium text-gray-900 sm:mb-3 sm:text-base'>Danh mục</h4>
        <div className='space-y-1.5 sm:space-y-2'>
          {categoriesLoading
            ? // Skeleton khi đang tải
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='rounded-lg border border-gray-200 p-2 sm:p-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2 sm:space-x-3'>
                      <Skeleton className='h-3 w-3 rounded sm:h-4 sm:w-4' />
                      <Skeleton className='h-3 w-20 sm:h-4 sm:w-24' />
                    </div>
                    <Skeleton className='h-4 w-6 rounded-full sm:h-5 sm:w-8' />
                  </div>
                </div>
              ))
            : categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2 capitalize transition-all duration-200 sm:p-3 ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex min-w-0 items-center space-x-2 sm:space-x-3'>
                      <IconComponent className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                      <span className='truncate text-xs font-medium sm:text-sm'>{category.name}</span>
                    </div>
                    <Badge
                      variant={selectedCategory === category.id ? 'default' : 'secondary'}
                      className='flex-shrink-0 text-[10px] sm:text-xs'
                    >
                      {category.count}
                    </Badge>
                  </button>
                )
              })}
        </div>
      </div>

      {/* Khoảng giá */}
      <div>
        <h4 className='mb-2 text-sm font-medium text-gray-900 sm:mb-3 sm:text-base'>Khoảng giá</h4>
        <div className='space-y-3 sm:space-y-4'>
          <div className='px-2 sm:px-3'>
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={5000000}
              min={0}
              step={50000}
              className='w-full'
            />
            <div className='mt-1.5 flex items-center justify-between text-[10px] text-gray-600 sm:mt-2 sm:text-xs'>
              <span>{priceRange[0].toLocaleString()} VND</span>
              <span>{priceRange[1].toLocaleString()} VND+</span>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
            {priceRanges.map((pricePreset) => (
              <Button
                key={pricePreset.id}
                variant='outline'
                size='sm'
                onClick={() => onPriceRangeChange(pricePreset.range)}
                className='h-8 flex-1 px-2 text-[10px] sm:h-9 sm:text-xs'
              >
                {pricePreset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Trình độ */}
      <div>
        <h4 className='mb-2 text-sm font-medium text-gray-900 sm:mb-3 sm:text-base'>Trình độ</h4>
        <div className='space-y-2 sm:space-y-3'>
          {levels.map((level) => (
            <div key={level.id} className='flex items-center justify-between'>
              <div className='flex items-center space-x-2 sm:space-x-3'>
                <Checkbox
                  id={level.id}
                  checked={selectedLevels.includes(level.id)}
                  onCheckedChange={() => handleLevelToggle(level.id)}
                  className='h-4 w-4 sm:h-5 sm:w-5'
                />
                <label htmlFor={level.id} className='cursor-pointer text-xs font-medium text-gray-700 sm:text-sm'>
                  {level.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Đánh giá */}
      <div>
        <h4 className='mb-2 text-sm font-medium text-gray-900 sm:mb-3 sm:text-base'>Đánh giá</h4>
        <div className='space-y-1.5 sm:space-y-2'>
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`flex w-full items-center justify-between rounded-lg border p-2 transition-all duration-200 ${
                selectedRating === rating
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center space-x-1.5 sm:space-x-2'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                        i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-xs font-medium sm:text-sm'>{rating} & up</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CoursesFilters
