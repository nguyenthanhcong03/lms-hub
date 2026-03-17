'use client'

import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import { ROUTE_CONFIG } from '@/configs/routes'
import { useOrderDetails } from '@/hooks/use-orders'
import { OrderStatus } from '@/types/order'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { PaymentHeader } from './components/payment-header'
import { PaymentInstructions } from './components/payment-instructions'
import { SuccessOverlay } from './components/success-overlay'

function PaymentSuccessPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [paymentStatus, setPaymentStatus] = useState('Chờ thanh toán...')
  const [isOrderCompleted, setIsOrderCompleted] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const orderId = searchParams.get('orderid')

  // Lấy chi tiết đơn hàng động
  const { data: orderDetails, error, refetch } = useOrderDetails(orderId)

  // Cấu hình mã QR
  const accountNumber = '90909000'
  const bankName = 'VietinBank'

  // Giá trị động từ chi tiết đơn hàng

  const amount = orderDetails?.totalAmount?.toString()
  // &template=compact
  // URL mã QR với dữ liệu động
  const qrCodeUrl = `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bankName}&amount=${
    amount || ''
  }&des=${orderDetails?.code || ''}`

  // Xử lý hoàn tất đơn hàng bằng useCallback để tránh vấn đề dependency
  const handleOrderCompleted = useCallback(() => {
    setIsOrderCompleted(true)
    setPaymentStatus('Thanh toán thành công!')
    toast.success('Thanh toán thành công! Đang chuyển hướng...')

    // Dừng polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Bắt đầu đếm ngược
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Chuyển hướng tới trang đơn hàng của tôi
          router.push(ROUTE_CONFIG.PROFILE.MY_ORDERS)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [router])

  // Effect polling để kiểm tra trạng thái đơn hàng
  useEffect(() => {
    if (!orderDetails || isOrderCompleted) return

    // Kiểm tra trạng thái ban đầu
    if (orderDetails.status === OrderStatus.COMPLETED) {
      handleOrderCompleted()
      return
    }

    // Thiết lập polling mỗi 30 giây
    pollingIntervalRef.current = setInterval(() => {
      // Tải lại chi tiết đơn hàng để kiểm tra cập nhật trạng thái
      refetch()
    }, 30000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [orderDetails, isOrderCompleted, handleOrderCompleted, refetch])

  // Effect xử lý thay đổi trạng thái đơn hàng
  useEffect(() => {
    if (!orderDetails) return

    if (orderDetails.status === OrderStatus.COMPLETED && !isOrderCompleted) {
      handleOrderCompleted()
    } else if (orderDetails.status === OrderStatus.PENDING) {
      setPaymentStatus('Chờ thanh toán...')
    } else if (orderDetails.status === OrderStatus.CANCELLED) {
      setPaymentStatus('Đơn hàng đã bị hủy')
    }
  }, [orderDetails, orderDetails?.status, isOrderCompleted, handleOrderCompleted])

  // Effect dọn dẹp
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // Hiển thị trạng thái lỗi nếu không tải được đơn hàng
  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:py-8'>
        <div className='text-center'>
          <p className='mb-3 text-sm text-red-600 sm:mb-4 sm:text-base'>Không thể tải thông tin đơn hàng</p>
          <Button onClick={() => router.push('/')} variant='outline' className='h-9 text-xs sm:h-10 sm:text-sm'>
            <ArrowLeft className='mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4' />
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8'>
      {/* Lớp phủ thành công */}
      {isOrderCompleted && <SuccessOverlay countdown={countdown} />}

      <div className='mx-auto max-w-5xl px-4 sm:px-6'>
        {/* Nút quay lại */}
        <div className='mb-4 sm:mb-6'>
          <Button
            onClick={() => router.push('/')}
            variant='ghost'
            className='inline-flex h-9 items-center gap-1.5 text-xs sm:h-10 sm:gap-2 sm:text-sm'
            disabled={isOrderCompleted}
          >
            <ArrowLeft className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
            Trở về trang chủ
          </Button>
        </div>

        {/* Phần đầu */}
        <PaymentHeader orderCode={orderDetails?.code} />

        {/* Hướng dẫn thanh toán */}
        <PaymentInstructions
          qrCodeUrl={qrCodeUrl}
          amount={amount || '0'}
          orderCode={orderDetails?.code}
          paymentStatus={paymentStatus}
        />
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentSuccessPageInner />
    </Suspense>
  )
}
