'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import ManualDiscountInput from './manual-discount-input'
import CouponCard from './coupon-card'
import type { Cart, CartSummary, OrderDiscount } from '@/types/cart'
import type { CouponsData } from '@/types/coupon'

import { formatPrice } from '@/utils/format'

interface DiscountDrawerProps {
  cart: Cart
  summary: CartSummary
  appliedDiscount: OrderDiscount | null
  manualDiscountCode: string
  applyingCouponCode: string
  selectedDiscountCode: string
  couponsData: CouponsData | undefined
  isCouponsLoading: boolean
  onManualDiscountCodeChange: (code: string) => void
  onApplyDiscount: (code: string) => void
  onRemoveDiscount: () => void
  onCheckout: () => void
  onCloseDrawer: () => void
}

// Thành phần ngăn mã giảm giá
const DiscountDrawer = ({
  cart,
  summary,
  appliedDiscount,
  manualDiscountCode,
  applyingCouponCode,
  selectedDiscountCode,
  couponsData,
  isCouponsLoading,
  onManualDiscountCodeChange,
  onApplyDiscount,
  onRemoveDiscount,
  onCheckout,
  onCloseDrawer
}: DiscountDrawerProps) => {
  const handleContinue = () => {
    onCloseDrawer()
    onCheckout()
  }

  return (
    <SheetContent className='w-full px-4 sm:max-w-lg sm:px-6'>
      <SheetHeader className='px-0'>
        <SheetTitle className='text-left text-base sm:text-lg'>Mã giảm giá</SheetTitle>
      </SheetHeader>

      <div className='mt-4 space-y-4 px-0 sm:mt-6 sm:space-y-6'>
        {/* Nhập mã thủ công */}
        <ManualDiscountInput
          manualDiscountCode={manualDiscountCode}
          isApplyingDiscount={applyingCouponCode === manualDiscountCode && manualDiscountCode.length > 0}
          onManualDiscountCodeChange={onManualDiscountCodeChange}
          onApplyDiscount={onApplyDiscount}
        />

        {/* Mã giảm giá có sẵn */}
        <div>
          <h3 className='mb-3 text-xs font-medium text-gray-700 sm:mb-4 sm:text-sm'>Mã giảm giá của chúng tôi</h3>

          {isCouponsLoading && (
            <div className='flex items-center justify-center py-6 sm:py-8'>
              <Loader2 className='h-5 w-5 animate-spin text-gray-400 sm:h-6 sm:w-6' />
              <span className='ml-2 text-xs text-gray-500 sm:text-sm'>Đang tải mã giảm giá...</span>
            </div>
          )}

          {couponsData && couponsData.coupons.length === 0 && (
            <div className='py-6 text-center sm:py-8'>
              <p className='text-xs text-gray-500 sm:text-sm'>Không có mã giảm giá</p>
            </div>
          )}

          {couponsData && couponsData.coupons.length > 0 && (
            <div className='space-y-3 sm:space-y-4'>
              {couponsData.coupons.map((coupon) => (
                <CouponCard
                  key={coupon._id}
                  coupon={coupon}
                  cart={cart}
                  selectedDiscountCode={selectedDiscountCode}
                  isApplyingDiscount={applyingCouponCode === coupon.code}
                  onApplyDiscount={onApplyDiscount}
                  onRemoveDiscount={onRemoveDiscount}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tóm tắt */}
        {appliedDiscount && (
          <div className='border-t pt-3 sm:pt-4'>
            <div className='rounded-lg bg-green-50 p-3 sm:p-4'>
              <div className='mb-1.5 flex items-center justify-between sm:mb-2'>
                <span className='text-sm font-semibold text-green-800 sm:text-base'>{formatPrice(summary.total)}</span>
              </div>
              <div className='text-xs text-green-600 sm:text-sm'>
                Bạn tiết kiệm được {formatPrice(summary.discountAmount)}
              </div>
              <Button className='mt-2 h-10 w-full text-sm sm:mt-3 sm:h-11 sm:text-base' onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </SheetContent>
  )
}

export default DiscountDrawer
