'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { useCancelOrder, useMyOrders } from '@/hooks/use-orders'
import Loader from '@/components/loader'
import { OrdersFilterParams } from '@/types/order'
import EmptyState from './empty-state'
import OrderCard from './order-card'
import OrderFilters from './order-filters'
import PageHeader from './page-header'
import Pagination from './pagination'

// Component nội dung đơn hàng (nặng dữ liệu, có tương tác)
const OrdersContent = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')

  // Tạo tham số bộ lọc
  const filterParams: OrdersFilterParams = {
    page: currentPage,
    limit: 10,
    ...(statusFilter !== 'all' && {
      status: statusFilter as 'pending' | 'completed' | 'cancelled'
    }),
    sortBy: sortBy as 'createdAt' | 'updatedAt' | 'totalAmount',
    sortOrder: 'desc'
  }

  const { data, isLoading } = useMyOrders(filterParams)
  const cancelOrderMutation = useCancelOrder()

  // Xử lý thanh toán
  const handlePayment = (orderId: string) => {
    router.push(`/payment?orderid=${orderId}`)
  }

  // Xử lý hủy đơn hàng
  const handleCancelOrder = (orderId: string, orderCode: string) => {
    cancelOrderMutation.mutate(orderId, {
      onSuccess: () => {
        toast.success(`Đơn hàng ${orderCode} đã được hủy thành công`)
      }
    })
  }

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Xử lý khám phá thêm
  const handleExplore = () => {
    router.push('/')
  }

  // Trạng thái đang tải
  if (isLoading) {
    return <Loader />
  }

  const orders = data?.orders || []
  const pagination = data?.pagination

  return (
    <>
      {/* Phần đầu trang đã cập nhật với số đơn hàng thực tế */}
      <PageHeader ordersCount={orders.length} />

      {/* Bộ lọc */}
      <OrderFilters
        statusFilter={statusFilter}
        sortBy={sortBy}
        ordersCount={orders.length}
        totalOrders={pagination?.total || 0}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
      />

      {/* Danh sách đơn hàng */}
      {orders.length === 0 ? (
        <EmptyState onExplore={handleExplore} />
      ) : (
        <div className='space-y-3 sm:space-y-4'>
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onPayment={handlePayment}
              onCancel={handleCancelOrder}
              cancelMutation={cancelOrderMutation}
            />
          ))}
        </div>
      )}

      {/* Phân trang */}
      <Pagination pagination={pagination} currentPage={currentPage} onPageChange={handlePageChange} />
    </>
  )
}

export default OrdersContent
