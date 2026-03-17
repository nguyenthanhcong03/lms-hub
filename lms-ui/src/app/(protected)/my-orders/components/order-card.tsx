import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DEFAULT_THUMBNAIL } from '@/constants'
import type { useCancelOrder } from '@/hooks/use-orders'
import type { MyOrder } from '@/types/order'
import { formatDate, formatPrice } from '@/utils/format'
import { OrderService } from '@/services/orders'
import { toast } from 'sonner'

import { Banknote, Calendar, Clock, CreditCard, Download, Loader2, Package, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

// Màu sắc và nhãn trạng thái
const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-amber-50 text-amber-700 border border-amber-200',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: Clock
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: Package
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-50 text-red-700 border border-red-200',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: X
  }
} as const

// Nhãn phương thức thanh toán
const PAYMENT_METHOD_LABELS = {
  bank_transfer: 'Chuyển khoản ngân hàng'
} as const

interface OrderCardProps {
  order: MyOrder
  onPayment: (orderId: string) => void
  onCancel: (orderId: string, orderCode: string) => void
  cancelMutation: ReturnType<typeof useCancelOrder>
}

// Thành phần thẻ đơn hàng
const OrderCard = ({ order, onPayment, onCancel, cancelMutation }: OrderCardProps) => {
  const statusConfig = STATUS_CONFIG[order.status]
  const StatusIcon = statusConfig.icon
  const [isDownloading, setIsDownloading] = useState(false)

  // Kiểm tra đơn hàng này có đang bị hủy không
  const isCancelling = cancelMutation.isPending && cancelMutation.variables === order._id

  // Xử lý tải hóa đơn
  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true)
      await OrderService.downloadInvoice(order._id, order.code)
      toast.success('Tải hóa đơn thành công')
    } catch {
      toast.error('Không thể tải hóa đơn. Vui lòng thử lại.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className='overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-md transition-all duration-300 hover:shadow-xl sm:shadow-lg'>
      {/* Tiêu đề đơn hàng */}
      <CardHeader className='border-b border-gray-100/50 bg-gradient-to-r from-gray-50 to-white p-3 sm:p-6'>
        <div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-0'>
          <div className='flex min-w-0 flex-1 items-start gap-2 sm:gap-3'>
            <div className={`rounded-lg p-1.5 sm:p-2 ${statusConfig.bgColor} flex-shrink-0`}>
              <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${statusConfig.textColor}`} />
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='mb-1 truncate text-base font-bold text-gray-900 sm:text-lg'>#{order.code}</h3>
              <div className='flex flex-col gap-1 text-xs text-gray-600 sm:flex-row sm:items-center sm:gap-4 sm:text-sm'>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                  <Calendar className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                  <span className='truncate'>{formatDate(order.createdAt)}</span>
                </div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                  <CreditCard className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                  <span className='truncate'>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='self-start sm:self-auto'>
            <Badge
              className={`${statusConfig.color} rounded-full px-2 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 sm:text-sm`}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-3 sm:p-4'>
        {/* Danh sách khóa học */}
        <div className='mb-3 space-y-2 sm:mb-4 sm:space-y-3'>
          {order?.items.map((item) => (
            <div
              key={item._id}
              className='flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:gap-3 sm:p-3'
            >
              <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-sm sm:h-16 sm:w-16'>
                <Image src={item.thumbnail || DEFAULT_THUMBNAIL} alt={item.title} fill className='object-cover' />
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='mb-1 line-clamp-2 text-xs font-semibold text-gray-900 sm:mb-2 sm:text-sm md:text-base'>
                  {item.title}
                </h4>

                {/* Hiển thị giá cùng giá gốc */}
                <div className='space-y-0.5 sm:space-y-1'>
                  {item.oldPrice && item.oldPrice > item.price && (
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                      <span className='text-xs text-gray-500 line-through sm:text-sm'>
                        {formatPrice(item.oldPrice)}
                      </span>
                      <span className='rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm sm:px-2 sm:py-1 sm:text-xs'>
                        {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% GIẢM
                      </span>
                    </div>
                  )}
                  <div className='text-base font-bold text-gray-900 sm:text-lg'>{formatPrice(item.price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tóm tắt và thao tác */}
        <div className='flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-2 sm:flex-row sm:items-center sm:pt-3'>
          <div className='space-y-0.5 sm:space-y-1'>
            <div className='flex flex-col gap-1 text-xs text-gray-600 sm:flex-row sm:items-center sm:gap-3 sm:text-sm'>
              <span>Tạm tính: {formatPrice(order.subTotal)}</span>
              {order.totalDiscount > 0 && (
                <span className='text-emerald-600'>Giảm giá: -{formatPrice(order.totalDiscount)}</span>
              )}
            </div>
            <div className='text-sm font-bold text-gray-900 sm:text-base'>
              Tổng cộng: {formatPrice(order.totalAmount)}
            </div>
          </div>

          <div className='flex w-full items-center gap-1.5 sm:w-auto sm:gap-2'>
            {/* Nút thao tác */}
            {order.status === 'pending' && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={isCancelling}
                      className='h-8 flex-1 border-red-200 text-xs text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 sm:h-9 sm:flex-none sm:text-sm'
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className='mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4' />
                          <span className='hidden sm:inline'>Đang hủy...</span>
                          <span className='sm:hidden'>...</span>
                        </>
                      ) : (
                        <>
                          <X className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                          Hủy đơn
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='max-w-[90vw] sm:max-w-lg'>
                    <AlertDialogHeader>
                      <AlertDialogTitle className='text-base sm:text-lg'>Xác nhận hủy đơn hàng</AlertDialogTitle>
                      <AlertDialogDescription className='text-xs sm:text-sm'>
                        Bạn có chắc muốn hủy đơn hàng #{order.code} không? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
                      <AlertDialogCancel disabled={isCancelling} className='h-9 w-full text-sm sm:w-auto'>
                        Không
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCancel(order._id, order.code)}
                        disabled={isCancelling}
                        className='h-9 w-full bg-red-600 text-sm hover:bg-red-700 disabled:opacity-50 sm:w-auto'
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className='mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4' />
                            <span className='hidden sm:inline'>Đang hủy...</span>
                            <span className='sm:hidden'>...</span>
                          </>
                        ) : (
                          'Xác nhận hủy'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  onClick={() => onPayment(order._id)}
                  size='sm'
                  className='h-8 flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-xs text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:h-9 sm:flex-none sm:text-sm'
                >
                  <Banknote className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                  Thanh toán ngay
                </Button>
              </>
            )}

            {order.status === 'completed' && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className='h-8 w-full border-gray-200 text-xs hover:bg-gray-50 disabled:opacity-50 sm:h-9 sm:w-auto sm:text-sm'
              >
                {isDownloading ? (
                  <>
                    <Loader2 className='mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4' />
                    <span className='hidden sm:inline'>Đang tải...</span>
                    <span className='sm:hidden'>...</span>
                  </>
                ) : (
                  <>
                    <Download className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                    <span className='hidden sm:inline'>Tải hóa đơn</span>
                    <span className='sm:hidden'>Hóa đơn</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderCard
