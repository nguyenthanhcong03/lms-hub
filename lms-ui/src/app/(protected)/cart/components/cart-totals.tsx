'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import type { CartSummary, OrderDiscount } from '@/types/cart'

import { formatPrice } from '@/utils/format'

interface CartTotalsProps {
  summary: CartSummary
  appliedDiscount: OrderDiscount | null
  onRemoveDiscount: () => void
}

// Component tổng tiền giỏ hàng
const CartTotals = ({ summary, appliedDiscount, onRemoveDiscount }: CartTotalsProps) => {
  return (
    <div className='space-y-2 sm:space-y-3'>
      {/* Tạm tính */}
      <div className='flex items-center justify-between py-0.5 sm:py-1'>
        <span className='text-xs text-gray-600 sm:text-sm'>Tổng tiền ({summary.itemCount} mục)</span>
        <span className='text-xs font-medium text-gray-900 sm:text-sm'>{formatPrice(summary.subtotal)}</span>
      </div>

      {/* Giảm giá đã áp dụng */}
      {appliedDiscount && (
        <div className='rounded-xs border border-green-200 bg-green-50 p-2 sm:p-3'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2'>
              <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-green-500 sm:h-6 sm:w-6'>
                <span className='text-[10px] font-bold text-white sm:text-xs'>%</span>
              </div>
              <div className='min-w-0'>
                <div className='truncate text-xs font-medium text-green-800 sm:text-sm'>Đã áp dụng giảm giá</div>
                <div className='truncate text-[10px] text-green-600 sm:text-xs'>Mã: {appliedDiscount.code}</div>
              </div>
            </div>
            <div className='flex-shrink-0 text-right'>
              <div className='text-xs font-bold text-green-700 sm:text-sm'>-{formatPrice(summary.discountAmount)}</div>
              <Button
                variant='ghost'
                size='sm'
                onClick={onRemoveDiscount}
                className='h-auto px-0.5 py-0.5 text-[10px] text-green-600 hover:text-green-800 sm:px-1 sm:text-xs'
              >
                Gỡ bỏ
              </Button>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Tổng cộng */}
      <div className='rounded-xs border border-blue-200 bg-blue-50 p-2 sm:p-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-bold text-gray-900 sm:text-base'>Tổng cộng</span>
          <span className='text-lg font-bold text-blue-700 sm:text-xl'>{formatPrice(summary.total)}</span>
        </div>
        <p className='mt-0.5 text-[10px] text-gray-500 sm:text-xs'>
          Bao gồm quyền truy cập suốt đời vào tất cả các khóa học
        </p>
      </div>
    </div>
  )
}

export default CartTotals
