'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice } from '@/utils/format'
import dayjs from 'dayjs'

import type { Coupon } from '@/types/coupon'

interface CouponConditionsDialogProps {
  coupon: Coupon
  isOpen: boolean
  onClose: () => void
}

// Thành phần hộp thoại điều kiện coupon
const CouponConditionsDialog = ({ coupon, isOpen, onClose }: CouponConditionsDialogProps) => {
  const expiryDate = dayjs(coupon.endDate).format('DD/MM/YYYY')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[90vw] sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-left text-base sm:text-lg'>{coupon.code}</DialogTitle>
        </DialogHeader>

        <div className='space-y-3 sm:space-y-4'>
          <div>
            <div className='mb-1.5 text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm'>Ngày hết hạn:</div>
            <div className='text-xs text-gray-600 sm:text-sm'>{expiryDate}</div>
          </div>

          <div>
            <div className='mb-1.5 text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm'>Điều kiện</div>
            <div className='space-y-1.5 text-xs text-gray-600 sm:space-y-2 sm:text-sm'>
              <div className='flex items-start space-x-2'>
                <span className='mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400 sm:mt-2'></span>
                <span>
                  Giảm ngay{' '}
                  {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}{' '}
                  trên tổng đơn hàng.
                </span>
              </div>

              <div className='flex items-start space-x-2'>
                <span className='mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400 sm:mt-2'></span>
                <span>
                  {coupon.courseIds && coupon.courseIds.length > 0
                    ? `Áp dụng cho khóa học được chỉ định`
                    : 'Áp dụng cho tất cả khóa học'}{' '}
                </span>
              </div>

              {coupon.minPurchaseAmount > 0 && (
                <div className='flex items-start space-x-2'>
                  <span className='mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400 sm:mt-2'></span>
                  <span>Đơn hàng tối thiểu: {formatPrice(coupon.minPurchaseAmount)}</span>
                </div>
              )}

              {coupon.courseIds && coupon.courseIds.length > 0 && (
                <div className='mt-2 rounded-lg border border-blue-200 bg-blue-50 p-2.5 sm:mt-3 sm:p-3'>
                  <div className='mb-1.5 text-xs font-medium text-blue-800 sm:mb-2 sm:text-sm'>Khóa học áp dụng:</div>
                  <div className='space-y-0.5 sm:space-y-1'>
                    {coupon.courseIds.slice(0, 3).map((course: { _id: string; title: string }, index: number) => (
                      <div key={course._id || index} className='line-clamp-1 text-xs text-blue-700 sm:text-sm'>
                        • {course.title || `Khóa học ${index + 1}`}
                      </div>
                    ))}
                    {coupon.courseIds.length > 3 && (
                      <div className='text-xs font-medium text-blue-600 sm:text-sm'>
                        +{coupon.courseIds.length - 3} khóa học khác
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CouponConditionsDialog
