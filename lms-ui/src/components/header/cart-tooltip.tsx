'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { ROUTE_CONFIG } from '@/configs/routes'
import { useCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { formatPrice } from '@/utils/format'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function CustomTooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-xs px-3 py-1.5 text-sm text-gray-900 shadow-lg',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className='fill-white stroke-gray-200 stroke-1'
          style={{
            fill: 'white',
            stroke: 'rgb(229, 231, 235)',
            strokeWidth: '1px'
          }}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export default function CartTooltip() {
  const isAuthenticated = useAuthStore((state) => !!state.user)
  const { data: cart, isLoading: cartLoading } = useCart({
    enabled: isAuthenticated
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='hover:text-primary group hover:bg-secondary relative h-8 w-8 rounded-full border border-transparent p-0 text-gray-500 transition-all duration-300 focus:outline-none sm:h-10 sm:w-10'
          asChild
        >
          <Link
            href={isAuthenticated ? ROUTE_CONFIG.CART : ROUTE_CONFIG.AUTH.SIGN_IN}
            aria-label={
              isAuthenticated ? `Giỏ hàng có ${cart?.items?.length || 0} sản phẩm` : 'Đăng nhập để xem giỏ hàng'
            }
          >
            <div className='absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/0 to-purple-500/0 transition-all duration-300 group-hover:from-blue-500/8 group-hover:to-purple-500/8'></div>
            <ShoppingCart
              size={16}
              className='relative z-10 transition-transform duration-300 group-hover:scale-110 sm:h-[18px] sm:w-[18px]'
            />
            {isAuthenticated && cart && cart.items && cart.items.length > 0 && (
              <span className='bg-primary absolute -top-1 -right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-lg sm:top-0 sm:right-0 sm:h-4 sm:w-4'>
                {cart.items.length > 99 ? '99+' : cart.items.length}
              </span>
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <CustomTooltipContent side='bottom' className='hidden w-72 p-0 sm:block sm:w-80'>
        <div className='max-h-96 overflow-hidden rounded-xs border border-gray-200 bg-white shadow-lg'>
          {!isAuthenticated ? (
            <div className='p-6 text-center'>
              <ShoppingCart className='mx-auto mb-3 h-12 w-12 text-gray-300' />
              <p className='font-medium text-gray-500'>Đăng nhập để xem giỏ hàng</p>
              <p className='mt-1 mb-4 text-sm text-gray-400'>Lưu khóa học và theo dõi tiến độ học tập của bạn</p>
              <Button className='bg-primary hover:bg-primary/80 w-full' size='sm' asChild>
                <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} aria-label='Đăng nhập vào tài khoản của bạn'>
                  Đăng nhập
                </Link>
              </Button>
            </div>
          ) : cartLoading ? (
            <div className='p-4 text-center text-gray-500'>Đang tải...</div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div className='p-6 text-center'>
              <ShoppingCart className='mx-auto mb-3 h-12 w-12 text-gray-300' />
              <p className='font-medium text-gray-500'>Giỏ hàng của bạn trống</p>
              <p className='mt-1 text-sm text-gray-400'>Thêm một số khóa học để bắt đầu</p>
            </div>
          ) : (
            <>
              <div className='border-b border-gray-100 p-3'>
                <h3 className='font-semibold text-gray-900'>Giỏ hàng</h3>
                <p className='text-sm text-gray-500'>{cart.items.length} sản phẩm</p>
              </div>
              <div className='max-h-64 overflow-y-auto'>
                {cart.items.slice(0, 3).map((item) => (
                  <div key={item.courseId._id} className='border-b border-gray-50 p-3 last:border-b-0'>
                    <div className='flex items-center gap-3'>
                      <div className='relative h-8 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100'>
                        {item.thumbnail ? (
                          <Image src={item.thumbnail} alt={item.title} fill className='object-cover' sizes='48px' />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                            <span className='text-xs text-white'>📚</span>
                          </div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h4 className='line-clamp-1 text-sm font-medium text-gray-900'>{item.title}</h4>
                        <div className='mt-1 flex items-center gap-2'>
                          {item.oldPrice && item.oldPrice > item.price && (
                            <span className='text-xs text-gray-400 line-through'>{formatPrice(item.oldPrice)}</span>
                          )}
                          <span className='text-sm font-semibold text-gray-900'>{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <div className='p-3 text-center'>
                    <p className='text-sm text-gray-500'>+{cart.items.length - 3} sản phẩm nữa</p>
                  </div>
                )}
              </div>
              <div className='border-t border-gray-100 bg-gray-50 p-3'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700'>Tổng cộng:</span>
                  <span className='text-lg font-bold text-gray-900'>{formatPrice(cart.totalPrice || 0)}</span>
                </div>
                <Button className='bg-primary hover:bg-primary/80 w-full' size='sm' asChild>
                  <Link
                    href={isAuthenticated ? ROUTE_CONFIG.CART : ROUTE_CONFIG.AUTH.SIGN_IN}
                    aria-label='Xem giỏ hàng và tiếp tục thanh toán'
                  >
                    Xem giỏ hàng và thanh toán
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </CustomTooltipContent>
    </Tooltip>
  )
}
