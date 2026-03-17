'use client'

import dynamic from 'next/dynamic'
import Loader from '@/components/loader'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCart } from 'lucide-react'

// Import động cho các component giỏ hàng (theo người dùng, có tương tác)
const CartItemComponent = dynamic(() => import('./components/cart-item'), {
  ssr: false
})

const CartSummary = dynamic(() => import('./components/cart-summary'), {
  ssr: false
})

const EmptyCart = dynamic(() => import('./components/empty-cart'), {
  ssr: false
})

// Trang giỏ hàng
const CartPage = () => {
  const { data: cart, isLoading } = useCart()

  if (isLoading) {
    return <Loader />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
        <div className='mx-auto max-w-6xl'>
          <EmptyCart />
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
      <div className='mx-auto max-w-6xl'>
        {/* Phần đầu trang */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='flex items-center gap-2 text-2xl font-bold sm:gap-3 sm:text-3xl'>
            <ShoppingCart className='h-6 w-6 sm:h-8 sm:w-8' />
            Giỏ hàng
          </h1>
          <p className='text-muted-foreground mt-1 text-sm sm:mt-2 sm:text-base'>
            Xem lại và quản lý các khóa học đã chọn ({cart.items.length} {cart.items.length === 1 ? 'mục' : 'mục'})
          </p>
        </div>

        {/* Nội dung chính */}
        <div className='grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3'>
          {/* Danh sách sản phẩm trong giỏ */}
          <div className='space-y-3 sm:space-y-4 lg:col-span-2'>
            <div className='overflow-hidden rounded-xs border border-gray-200 bg-white shadow-md sm:shadow-lg'>
              <div className='border-b border-gray-100 p-4 sm:p-6'>
                <h2 className='text-lg font-semibold text-gray-900 sm:text-xl'>Các khóa học</h2>
                <p className='mt-1 text-xs text-gray-600 sm:text-sm'>Truy cập trọn đời vào toàn bộ tài liệu khóa học</p>
              </div>

              <div className='divide-y divide-gray-100'>
                {cart.items.map((item) => (
                  <div key={item.courseId._id} className='p-3 sm:p-6'>
                    <CartItemComponent item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tóm tắt giỏ hàng */}
          <div className='lg:col-span-1'>
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
