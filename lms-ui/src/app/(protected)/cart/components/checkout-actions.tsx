'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CheckoutActionsProps {
  isCheckoutPending: boolean
  onCheckout: () => void
}

// Thành phần nút thanh toán
const CheckoutActions = ({ isCheckoutPending, onCheckout }: CheckoutActionsProps) => {
  return (
    <div className='space-y-3 sm:space-y-4'>
      {/* Nút thanh toán */}
      <Button
        onClick={onCheckout}
        disabled={isCheckoutPending}
        className='bg-primary hover:border-primary h-11 w-full transform border border-transparent py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:h-auto sm:py-4 sm:text-base'
        size='lg'
      >
        {isCheckoutPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5' />
            <span className='hidden sm:inline'>Đang tạo đơn hàng...</span>
            <span className='sm:hidden'>Đang xử lý...</span>
          </>
        ) : (
          <>
            <span>Thanh toán</span>
          </>
        )}
      </Button>

      {/* Thông báo bảo mật */}
      <p className='text-center text-[10px] text-gray-500 sm:text-xs'>
        🔒 Thanh toán an toàn - Hoàn tiền trong 30 ngày
      </p>
    </div>
  )
}

export default CheckoutActions
