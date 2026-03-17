'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CreditCard, Banknote } from 'lucide-react'
import { useCreateOrder } from '@/hooks/use-orders'
import { useActiveCoupons, useValidateCoupon } from '@/hooks/use-coupons'
import type { Cart, OrderDiscount } from '@/types/cart'
import type { CreateOrderRequest } from '@/types/order'
import type { ValidateCouponResponse } from '@/types/coupon'
import CartTotals from './cart-totals'
import CheckoutActions from './checkout-actions'
import DiscountDrawer from './discount-drawer'
import DiscountTrigger from './discount-trigger'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ROUTE_CONFIG } from '@/configs/routes'

const calculateDiscountAmount = (
  coupon: {
    discountType: string
    discountValue: number
    courseIds: Array<{
      _id: string
      title: string
      price?: number
    }>
  },
  cartItems: Array<{
    courseId: { _id: string }
    price: number
  }>,
  applicableCourses: Array<{
    _id: string
    title: string
    price: number
  }>
): number => {
  let baseAmount = 0

  // Nếu courseIds rỗng hoặc không có, áp dụng cho toàn bộ giỏ hàng
  if (!coupon.courseIds || coupon.courseIds.length === 0) {
    baseAmount = cartItems.reduce((sum, item) => sum + item.price, 0)
  } else {
    // Chỉ áp dụng giảm giá cho các khóa học phù hợp với coupon
    const applicableCourseIds = applicableCourses.map((course) => course._id)

    baseAmount = cartItems
      .filter((item) => applicableCourseIds.includes(item.courseId._id))
      .reduce((sum, item) => sum + item.price, 0)
  }

  // Tính số tiền giảm theo loại coupon
  if (coupon.discountType === 'fixed') {
    // Với giảm giá cố định, trả về giá trị cố định nhưng không vượt quá số tiền gốc
    return Math.min(coupon.discountValue, baseAmount)
  } else if (coupon.discountType === 'percent') {
    // Với giảm giá phần trăm, tính theo phần trăm của số tiền gốc
    return (baseAmount * coupon.discountValue) / 100
  }

  return 0
}

interface CartSummaryProps {
  cart: Cart
}

// Component tóm tắt giỏ hàng
const CartSummary = ({ cart }: CartSummaryProps) => {
  const [selectedDiscountCode, setSelectedDiscountCode] = useState<string>('')
  const [manualDiscountCode, setManualDiscountCode] = useState<string>('')
  const [appliedDiscount, setAppliedDiscount] = useState<OrderDiscount | null>(null)
  const [applyingCouponCode, setApplyingCouponCode] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CreateOrderRequest['paymentMethod']>('bank_transfer')
  const router = useRouter()

  const checkout = useCreateOrder()

  // Lấy danh sách coupon đang hoạt động từ API
  const { data: couponsData, isLoading: isCouponsLoading } = useActiveCoupons()

  const validateCoupon = useValidateCoupon()

  const summary = useMemo(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.price, 0)
    const discountAmount = appliedDiscount?.discountAmount || 0
    const total = subtotal - discountAmount
    const itemCount = cart.items.length

    return {
      subtotal,
      discountAmount,
      total,
      itemCount
    }
  }, [cart, appliedDiscount])

  const applyDiscountCode = (code: string) => {
    if (!code.trim()) return

    setApplyingCouponCode(code.trim())

    // Kiểm tra coupon qua API
    validateCoupon.mutate(
      {
        code: code.trim(),
        courseIds: cart.items.map((item) => item.courseId._id)
      },
      {
        onSuccess: (response: ValidateCouponResponse) => {
          const coupon = response

          // Tính số tiền giảm dựa trên loại coupon và courseIds
          const discountAmount = calculateDiscountAmount(
            {
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              courseIds: coupon.courseIds
            },
            cart.items,
            coupon.courseIds
          )

          // Áp dụng giảm giá
          setAppliedDiscount({
            code: coupon.code,
            discountAmount,
            appliedSuccessfully: true
          })
          setSelectedDiscountCode(coupon.code)
          setManualDiscountCode('')
          setApplyingCouponCode('')
        },
        onError: () => {
          setApplyingCouponCode('')
        }
      }
    )
  }

  const removeDiscount = () => {
    setAppliedDiscount(null)
    setSelectedDiscountCode('')
    setManualDiscountCode('')
    setApplyingCouponCode('')
    toast.success('Đã gỡ mã giảm giá')
  }

  const handleCheckout = () => {
    checkout.mutate(
      {
        courseIds: cart.items.map((item) => item.courseId._id),
        paymentMethod: selectedPaymentMethod,
        couponCode: appliedDiscount?.code
      },
      {
        onSuccess: (response) => {
          if (response?._id) {
            if (response.paymentMethod === 'bank_transfer') {
              router.push(`${ROUTE_CONFIG.QR_PAYMENT}?orderid=${response?._id}`)
            }
          }
        }
      }
    )
  }

  const paymentMethods = [
    {
      id: 'bank_transfer' as const,
      name: 'Ngân hàng',
      description: 'Chuyển khoản ngân hàng',
      icon: Banknote,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    }
  ]

  if (cart.items.length === 0) {
    return (
      <Card className='sticky top-24'>
        <CardContent className='p-6'>
          <div className='text-center'>
            <p className='text-muted-foreground'>Giỏ hàng của bạn đang trống</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='rounded-xs border border-gray-200 bg-white shadow-md sm:shadow-lg lg:sticky lg:top-24'>
      <div className='space-y-3 p-3 sm:space-y-4 sm:p-4'>
        {/* Phần đầu tóm tắt */}
        <div className='border-b border-gray-100 pb-2 text-center sm:pb-3'>
          <h3 className='mb-0.5 text-base font-bold text-gray-900 sm:mb-1 sm:text-lg'>Tóm tắt đơn hàng</h3>
          <p className='text-[10px] text-gray-600 sm:text-xs'>Xem lại các mặt hàng của bạn và hoàn tất việc mua sắm</p>
        </div>

        {/* Tổng tiền giỏ hàng */}
        <CartTotals summary={summary} appliedDiscount={appliedDiscount} onRemoveDiscount={removeDiscount} />

        {/* Khu vực mã giảm giá */}
        <div className='space-y-2 sm:space-y-3'>
          <h4 className='text-[10px] font-semibold text-gray-900 sm:text-xs'>Có mã giảm giá?</h4>
          <Sheet>
            <SheetTrigger asChild>
              <div>
                <DiscountTrigger />
              </div>
            </SheetTrigger>

            <DiscountDrawer
              cart={cart}
              summary={summary}
              appliedDiscount={appliedDiscount}
              manualDiscountCode={manualDiscountCode}
              applyingCouponCode={applyingCouponCode}
              selectedDiscountCode={selectedDiscountCode}
              couponsData={couponsData}
              isCouponsLoading={isCouponsLoading}
              onManualDiscountCodeChange={setManualDiscountCode}
              onApplyDiscount={applyDiscountCode}
              onRemoveDiscount={removeDiscount}
              onCheckout={handleCheckout}
              onCloseDrawer={() => {}}
            />
          </Sheet>
        </div>

        {/* Chọn phương thức thanh toán */}
        <div className='space-y-3 sm:space-y-4'>
          <h4 className='text-xs font-semibold text-gray-900 sm:text-sm'>Phương thức thanh toán</h4>
          <div className='grid grid-cols-2 gap-2 sm:gap-3'>
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedPaymentMethod === method.id

              return (
                <Button
                  key={method.id}
                  variant='outline'
                  className={`group relative h-auto min-h-[70px] flex-col p-2 transition-all duration-200 sm:min-h-[80px] sm:p-3 ${
                    isSelected
                      ? `${method.bgColor} ${method.borderColor} border-2 ${method.textColor} shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  {/* Dấu hiệu đang chọn */}
                  {isSelected && (
                    <div className='absolute top-1.5 right-1.5 sm:top-2 sm:right-2'>
                      <div
                        className={`h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${method.textColor.replace('text-', 'bg-')}`}
                      />
                    </div>
                  )}

                  <div className='flex flex-col items-center gap-1.5 sm:gap-2'>
                    <div
                      className={`rounded-lg p-1.5 transition-all duration-200 sm:p-2 ${
                        isSelected
                          ? `${method.bgColor} ${method.borderColor} border`
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 transition-colors duration-200 sm:h-6 sm:w-6 ${
                          isSelected ? method.textColor : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div className='text-center'>
                      <div
                        className={`text-xs font-semibold transition-colors duration-200 sm:text-sm ${
                          isSelected ? method.textColor : 'text-gray-700'
                        }`}
                      >
                        {method.name}
                      </div>
                      <div
                        className={`mt-0.5 text-[10px] transition-colors duration-200 sm:mt-1 sm:text-xs ${
                          isSelected ? method.textColor.replace('700', '600') : 'text-gray-500'
                        }`}
                      >
                        {method.description}
                      </div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Nút thanh toán */}
        <div className='border-t border-gray-100 pt-2 sm:pt-3'>
          <CheckoutActions isCheckoutPending={checkout.isPending} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  )
}

export default CartSummary
