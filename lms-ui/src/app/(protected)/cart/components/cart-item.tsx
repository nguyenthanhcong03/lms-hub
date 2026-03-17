'use client'

import Image from 'next/image'
import { Trash2, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/utils/format'
import { useRemoveFromCart } from '@/hooks/use-cart'
import type { CartItem } from '@/types/cart'

interface CartItemProps {
  item: CartItem
}

// Component sản phẩm trong giỏ hàng
const CartItemComponent = ({ item }: CartItemProps) => {
  const removeFromCart = useRemoveFromCart()

  const handleRemove = () => {
    removeFromCart.mutate(item.courseId._id)
  }

  return (
    <Card className='p-3 sm:p-4'>
      <div className='flex items-start gap-3 sm:gap-4'>
        {/* Ảnh thu nhỏ khóa học */}
        <div className='bg-muted relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-24 sm:rounded-lg'>
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className='object-cover'
              sizes='(max-width: 640px) 64px, 96px'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
              <span className='text-[10px] font-medium text-white sm:text-xs'>Khóa học</span>
            </div>
          )}
        </div>

        {/* Thông tin khóa học */}
        <div className='min-w-0 flex-1'>
          <h3 className='mb-1 line-clamp-2 text-xs font-semibold sm:mb-2 sm:text-sm'>{item.title}</h3>

          {/* Hiển thị giá */}
          <div className='mb-2 flex flex-col gap-0.5 sm:mb-3 sm:gap-1'>
            {/* Hiển thị giá cũ nếu có và lớn hơn giá hiện tại */}
            {item.oldPrice && item.oldPrice > item.price && (
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <span className='text-xs text-gray-500 line-through sm:text-sm'>{formatPrice(item.oldPrice)}</span>
                <span className='rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm sm:px-2 sm:py-1 sm:text-xs'>
                  {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% GIẢM
                </span>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <span className='text-base font-bold sm:text-lg'>{formatPrice(item.price)}</span>
            </div>
          </div>
        </div>

        {/* Nút xóa */}
        <Button
          variant='ghost'
          size='sm'
          onClick={handleRemove}
          disabled={removeFromCart.isPending}
          className='h-auto p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 sm:p-2'
        >
          {removeFromCart.isPending ? (
            <Loader2 className='h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4' />
          ) : (
            <Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
          )}
        </Button>
      </div>
    </Card>
  )
}

export default CartItemComponent
