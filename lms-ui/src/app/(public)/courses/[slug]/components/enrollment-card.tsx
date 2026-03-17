'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTE_CONFIG, getRoutes } from '@/configs/routes'
import { DEFAULT_THUMBNAIL } from '@/constants'
import { useAddToCart, useCart } from '@/hooks/use-cart'
import { useEnrollFree } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
import { IPublicCourse } from '@/types/course'
import { formatDuration, formatPrice } from '@/utils/format'
import { getLastLessonForCourse } from '@/utils/last-course-lesson'
import {
  Award,
  Clock,
  Download,
  Gift,
  Heart,
  Infinity,
  PlayCircle,
  Share2,
  ShoppingCart,
  Smartphone
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface EnrollmentCardProps {
  course: IPublicCourse
  lastLessonId: string
}

const EnrollmentCard = ({ course, lastLessonId }: EnrollmentCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  // Check if user is already enrolled in the course
  const isEnrolled = user?.courses?.includes(course._id) ?? false

  // Free enrollment mutation using the custom hook
  const enrollFreeMutation = useEnrollFree()

  // Add to cart mutation using the custom hook
  const addToCartMutation = useAddToCart()
  const { data: cart, refetch: refetchCart } = useCart({ enabled: !!user })

  const handleEnrollNow = () => {
    if (!user) {
      toast.warning('Please login to enroll in the course')
      return
    }

    enrollFreeMutation.mutate(course._id, {
      onSuccess: () => {
        toast.success('Successfully enrolled in the course!')
        router.push(getRoutes.learning(course.slug, getLastLessonForCourse(course.slug) || lastLessonId || undefined))
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to enroll in the course')
      }
    })
  }

  const handleContinueLearning = () => {
    const url = getRoutes.learning(course.slug, getLastLessonForCourse(course.slug) || lastLessonId || undefined)
    router.push(url)
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để mua khóa học')
      return
    }

    const latestCart = cart ?? (await refetchCart()).data
    const isCourseAlreadyInCart = latestCart?.items?.some((item) => item.courseId._id === course._id)

    if (isCourseAlreadyInCart) {
      toast.info('Khóa học đã có trong giỏ hàng của bạn. Chuyển đến giỏ hàng để thanh toán.')
      return
    }

    addToCartMutation.mutate(
      {
        courseId: course._id
      },
      {
        onSuccess: () => {
          toast.success('Khóa học đã được thêm vào giỏ hàng!')
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add course to cart')
        }
      }
    )
  }

  const handleBuyNow = async () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để mua khóa học')
      return
    }

    const latestCart = cart ?? (await refetchCart()).data
    const isCourseAlreadyInCart = latestCart?.items?.some((item) => item.courseId._id === course._id)

    if (isCourseAlreadyInCart) {
      router.push(ROUTE_CONFIG.CART)
      return
    }

    addToCartMutation.mutate(
      {
        courseId: course._id
      },
      {
        onSuccess: () => {
          toast.success('Khóa học đã được thêm vào giỏ hàng! Chuyển đến giỏ hàng để thanh toán.')
          router.push(ROUTE_CONFIG.CART)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add course to cart')
        }
      }
    )
  }

  const discountPercentage = course.oldPrice
    ? Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)
    : 0

  // Calculate days remaining until milestone date
  const calculateDaysRemaining = () => {
    const today = new Date()
    const milestoneDate = new Date('2025-10-20') // Set your milestone date (YYYY-MM-DD)

    // If milestone has passed, return 0
    if (today > milestoneDate) return 0

    // Calculate difference in milliseconds
    const diffTime = milestoneDate.getTime() - today.getTime()
    // Convert to days and round down
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const daysRemaining = calculateDaysRemaining()

  const featureIcons = {
    'Video theo yêu cầu': Clock,
    'Tài nguyên có thể tải xuống': Download,
    'Truy cập trọn đời': Infinity,
    'Xem trên điện thoại và TV': Smartphone,
    'Chứng chỉ hoàn thành': Award
  }

  const features = [
    `${formatDuration(course.totalDuration || 0)} Video theo yêu cầu`,
    `${course.totalLessons || 25} bài học`,
    'Truy cập trọn đời',
    'Xem trên điện thoại và TV',
    'Chứng chỉ hoàn thành'
  ]

  return (
    <div className='overflow-hidden rounded-xs border border-gray-200 bg-white shadow-lg'>
      {/* Video Preview */}
      <div className='group relative aspect-video cursor-pointer bg-gray-900'>
        <Image
          src={course.image || DEFAULT_THUMBNAIL}
          alt={course.title}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>

      {/* Pricing */}
      <div className='p-4 sm:p-6'>
        <div className='mb-4 sm:mb-6'>
          {course.isFree ? (
            <div className='text-2xl font-bold text-green-600 sm:text-3xl'>Miễn phí</div>
          ) : (
            <div className='space-y-2'>
              <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                <span className='text-xl font-bold text-gray-900 sm:text-2xl'>{formatPrice(course.price)}</span>
                {course.oldPrice && (
                  <>
                    <span className='text-lg text-gray-500 line-through sm:text-xl'>
                      {formatPrice(course.oldPrice)}
                    </span>
                    <Badge className='bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-sm hover:bg-red-700 sm:text-sm'>
                      {discountPercentage}% Giảm giá
                    </Badge>
                  </>
                )}
              </div>
              {daysRemaining > 0 && (
                <div className='flex items-center gap-1 text-red-600'>
                  <Clock className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='text-xs font-medium sm:text-sm'>
                    {daysRemaining} {daysRemaining === 1 ? 'ngày' : 'ngày'} còn lại với giá này!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='mb-4 space-y-2 sm:mb-6 sm:space-y-3'>
          {isEnrolled ? (
            // User is already enrolled - show continue learning button
            <Button
              size='lg'
              className='h-12 w-full bg-green-600 text-sm hover:bg-green-700 sm:text-base'
              onClick={handleContinueLearning}
            >
              <PlayCircle className='mr-2 h-4 w-4' />
              Tiếp tục học
            </Button>
          ) : course.isFree ? (
            // Course is free and user is not enrolled - show enroll button
            <Button
              size='lg'
              className='h-12 w-full bg-green-600 text-sm hover:bg-green-700 sm:text-base'
              onClick={handleEnrollNow}
              disabled={enrollFreeMutation.isPending}
            >
              <ShoppingCart className='mr-2 h-4 w-4' />
              {enrollFreeMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký ngay'}
            </Button>
          ) : (
            // Nếu khóa học có phí và người dùng chưa đăng ký - hiển thị nút thêm vào giỏ hàng và mua ngay
            <>
              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 h-12 w-full text-sm sm:text-base'
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className='mr-2 h-4 w-4' />
                {addToCartMutation.isPending ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='h-12 w-full text-sm sm:text-base'
                onClick={handleBuyNow}
                disabled={addToCartMutation.isPending}
              >
                Mua ngay
              </Button>
            </>
          )}
        </div>

        {/* Secondary Actions */}
        <div className='mb-4 grid grid-cols-3 gap-1 sm:mb-6 sm:gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`flex h-auto flex-col items-center justify-center py-2 text-xs sm:flex-row sm:text-sm ${
              isWishlisted ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <Heart className={`h-3 w-3 sm:mr-1 sm:h-4 sm:w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>Yêu thích</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='flex h-auto flex-col items-center justify-center py-2 text-xs text-gray-600 sm:flex-row sm:text-sm'
          >
            <Share2 className='h-3 w-3 sm:mr-1 sm:h-4 sm:w-4' />
            <span>Chia sẻ</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='flex h-auto flex-col items-center justify-center py-2 text-xs text-gray-600 sm:flex-row sm:text-sm'
          >
            <Gift className='h-3 w-3 sm:mr-1 sm:h-4 sm:w-4' />
            <span>Quà tặng</span>
          </Button>
        </div>

        {/* Money-back Guarantee */}
        {!course.isFree && (
          <div className='mb-4 rounded-xs border border-green-200 bg-green-50 p-2.5 text-center sm:mb-6 sm:p-3'>
            <p className='text-xs font-medium text-green-800 sm:text-sm'>Cam kết hoàn tiền trong 30 ngày</p>
          </div>
        )}

        {/* Course Includes */}
        <div>
          <h4 className='mb-2 text-sm font-medium text-gray-900 sm:mb-3 sm:text-base'>Khóa học này bao gồm:</h4>
          <div className='space-y-1.5 sm:space-y-2'>
            {features.map((feature, index) => {
              const getIcon = (feature: string) => {
                const lowerFeature = feature.toLowerCase()
                for (const [key, IconComponent] of Object.entries(featureIcons)) {
                  if (lowerFeature.includes(key.toLowerCase())) {
                    return IconComponent
                  }
                }
                return Award // Default icon
              }

              const IconComponent = getIcon(feature)

              return (
                <div key={index} className='flex items-center space-x-2 text-xs sm:text-sm'>
                  <IconComponent className='h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4' />
                  <span className='text-gray-700'>{feature}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentCard
