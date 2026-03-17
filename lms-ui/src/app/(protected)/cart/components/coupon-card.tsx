'use client'

import { Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import CouponConditionsDialog from './coupon-conditions-dialog'
import { useState } from 'react'
import dayjs from 'dayjs'
import type { Coupon } from '@/types/coupon'
import type { Cart } from '@/types/cart'
import { formatPrice } from '@/utils/format'

const isCouponApplicable = (coupon: Coupon, cart: Cart): boolean => {
  // Nếu courseIds rỗng hoặc không có, coupon áp dụng cho toàn bộ giỏ hàng
  if (!coupon.courseIds || coupon.courseIds.length === 0) {
    return true
  }

  // Với khóa học cụ thể, kiểm tra xem khóa học trong giỏ có khớp courseIds của coupon không
  const cartCourseIds = cart.items.map((item) => item.courseId._id)

  const couponCourseIds = coupon.courseIds.map((course) => course._id)

  // Tất cả cartCourseIds phải nằm trong couponCourseIds
  return cartCourseIds.every((courseId: string) => couponCourseIds.includes(courseId))
  // return couponCourseIds.some((courseId: string) =>
  // 	cartCourseIds.includes(courseId)
  // );
}

interface CouponCardProps {
  coupon: Coupon
  cart: Cart
  selectedDiscountCode: string
  isApplyingDiscount: boolean
  onApplyDiscount: (code: string) => void
  onRemoveDiscount: () => void
}

// Component thẻ coupon
const CouponCard = ({
  coupon,
  cart,
  selectedDiscountCode,
  isApplyingDiscount,
  onApplyDiscount,
  onRemoveDiscount
}: CouponCardProps) => {
  const [showConditions, setShowConditions] = useState(false)
  const expiryDate = dayjs(coupon.endDate).format('DD/MM/YYYY')
  const isApplicable = isCouponApplicable(coupon, cart)

  return (
    <>
      <div className='relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md'>
        {/* Nhãn nổi bật */}
        <div className='absolute top-0 left-0'>
          <div className='relative overflow-hidden rounded-br-lg bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-2 py-0.5 text-white sm:px-3 sm:py-1'>
            {/* Họa tiết nền chuyển động giống phần đầu trang */}
            <div className='absolute inset-0 opacity-20'>
              <div className='absolute inset-0 -skew-x-12 transform animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent'></div>
            </div>
            <div className='absolute inset-0 bg-black/10'></div>
            <div className='relative z-10'>
              <div className='text-[10px] font-bold sm:text-xs'>GIẢM GIÁ HOT</div>
              <div className='text-base leading-none font-bold sm:text-lg'>
                {coupon.discountType === 'percent'
                  ? `${coupon.discountValue}%`
                  : `${formatPrice(coupon.discountValue)}`}
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className='px-3 pt-10 pb-2.5 sm:px-4 sm:pt-12 sm:pb-3'>
          {/* Mã coupon */}
          <div className='mb-1.5 sm:mb-2'>
            <h3 className='mb-0.5 truncate text-sm font-bold text-gray-900 sm:text-base'>{coupon.code}</h3>
            <p className='line-clamp-2 text-xs text-gray-600 sm:text-sm'>{coupon.title} </p>
          </div>

          {/* Phần cuối */}
          <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0'>
            {/* Ngày hết hạn */}
            <div className='flex items-center text-xs text-gray-500 sm:text-sm'>
              <Clock className='mr-1 h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
              <span className='truncate'>Hết hạn: {expiryDate}</span>
            </div>

            {/* Nút thao tác */}
            <div className='flex w-full items-center space-x-1.5 sm:w-auto sm:space-x-2'>
              <button
                onClick={() => setShowConditions(true)}
                className='text-xs font-medium whitespace-nowrap text-blue-600 underline hover:text-blue-700 sm:text-sm'
              >
                Điều kiện
              </button>

              {selectedDiscountCode === coupon.code ? (
                <Button
                  variant='outline'
                  onClick={onRemoveDiscount}
                  className='h-8 flex-1 border-red-200 text-xs text-red-600 hover:bg-red-50 sm:h-9 sm:flex-none sm:text-sm'
                  size='sm'
                >
                  Gỡ bỏ
                </Button>
              ) : (
                <Button
                  onClick={() => onApplyDiscount(coupon.code)}
                  disabled={isApplyingDiscount || !isApplicable}
                  className='group relative h-8 flex-1 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-xs text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 hover:shadow-xl disabled:bg-gray-400 sm:h-9 sm:flex-none sm:text-sm'
                  size='sm'
                >
                  {/* Hiệu ứng ánh sáng chuyển động giống phần đầu trang */}
                  <div className='absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]'></div>
                  <span className='relative z-10'>
                    {isApplyingDiscount ? (
                      <div className='flex items-center justify-center gap-0.5 sm:gap-1'>
                        <Loader2 className='mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4' />
                        <span className='hidden sm:inline'>Đang áp dụng...</span>
                        <span className='sm:hidden'>...</span>
                      </div>
                    ) : !isApplicable ? (
                      <>
                        <span className='hidden sm:inline'>Không áp dụng được</span>
                        <span className='sm:hidden'>N/A</span>
                      </>
                    ) : (
                      'Áp dụng'
                    )}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hộp thoại điều kiện */}
      <CouponConditionsDialog coupon={coupon} isOpen={showConditions} onClose={() => setShowConditions(false)} />
    </>
  )
}

export default CouponCard
