import { OrderService } from '@/services/orders'
import type {
  AdminOrdersFilterParams,
  CreateOrderRequest,
  CreateOrderResponse,
  IOrder,
  MyOrdersListResponse,
  OrderDetails,
  OrdersFilterParams,
  OrdersListResponse
} from '@/types/order'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'

// Khóa truy vấn cho orders
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrdersFilterParams) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  // User-specific keys
  userOrders: (filters: OrdersFilterParams) => [...orderKeys.lists(), 'user', filters] as const,
  myOrders: (filters: OrdersFilterParams) => [...orderKeys.lists(), 'my-orders', filters] as const
}

// Params rỗng mặc định để giữ tham chiếu ổn định
const DEFAULT_PARAMS: OrdersFilterParams = {}

// Hook để get order details by ID
export function useOrderDetails(orderId: string | null) {
  return useQuery<OrderDetails>({
    queryKey: orderKeys.detail(orderId || ''),
    queryFn: () => OrderService.getOrderById(orderId!),
    enabled: !!orderId
  })
}

// Hook để get user's orders (legacy)
export function useUserOrders(params?: OrdersFilterParams) {
  const normalizedParams = params || DEFAULT_PARAMS

  return useQuery<OrdersListResponse>({
    queryKey: orderKeys.userOrders(normalizedParams),
    queryFn: () => OrderService.getUserOrders(normalizedParams),
    placeholderData: keepPreviousData
  })
}

// Hook để get my orders with proper typing
export function useMyOrders(params?: OrdersFilterParams) {
  const normalizedParams = params || DEFAULT_PARAMS

  return useQuery<MyOrdersListResponse>({
    queryKey: orderKeys.myOrders(normalizedParams),
    queryFn: () => OrderService.getMyOrders(normalizedParams),
    placeholderData: keepPreviousData
  })
}

// Hook để cancel an order
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => OrderService.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      // Invalidate and refetch my orders
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      })

      // Also invalidate the specific order details if cached
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(orderId)
      })
    },
    onError: (error) => {
      console.error('Cancel order error:', error)
      toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.')
    }
  })
}

// Hook để create order through checkout
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation<CreateOrderResponse, Error, CreateOrderRequest>({
    mutationFn: (data: CreateOrderRequest) => OrderService.createOrder(data),
    onSuccess: () => {
      // Invalidate cart queries since items are moved to order

      // Invalidate orders lists to show the new order
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      })

      toast.success('Đã tạo đơn hàng! Đang chuyển đến trang thanh toán...')
    },
    onError: (error) => {
      toast.error(error.message || 'Không tạo được đơn hàng')
    }
  })
}

// ===== ADMIN-SPECIFIC HOOKS =====

// Hook để fetch admin orders list
export function useAdminOrders(params?: AdminOrdersFilterParams) {
  const normalizedParams = params || {}

  return useQuery({
    queryKey: [...orderKeys.lists(), 'admin', normalizedParams],
    queryFn: () => OrderService.getAdminOrders(normalizedParams),
    placeholderData: keepPreviousData
  })
}

// Hook để fetch single admin order details
export function useAdminOrderDetails(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => OrderService.getAdminOrderById(orderId),
    enabled: !!orderId
  })
}

// Hook để update admin order
export function useUpdateAdminOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, orderData }: { orderId: string; orderData: Partial<IOrder> }) =>
      OrderService.updateAdminOrder({ id: orderId, ...orderData }),
    onSuccess: (_, { orderId }) => {
      // Invalidate and refetch admin orders list
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      })

      // Also invalidate the specific order details
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(orderId)
      })

      toast.success('Đơn hàng đã được cập nhật thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Không cập nhật được đơn hàng. Vui lòng thử lại.')
    }
  })
}

// Hook để delete admin order
export function useDeleteAdminOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => OrderService.deleteAdminOrder(orderId),
    onSuccess: (_, orderId) => {
      // Invalidate and refetch admin orders list
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      })

      // Remove the specific order details from cache
      queryClient.removeQueries({
        queryKey: orderKeys.detail(orderId)
      })

      toast.success('Đơn hàng đã được xóa thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Không xóa được đơn hàng. Vui lòng thử lại.')
    }
  })
}

// Hook để bulk delete admin orders
export function useBulkDeleteAdminOrders() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderIds: string[]) => OrderService.bulkDeleteAdminOrders(orderIds),
    onSuccess: (_, orderIds) => {
      // Invalidate and refetch admin orders list
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      })

      // Remove specific order details from cache
      orderIds.forEach((orderId) => {
        queryClient.removeQueries({
          queryKey: orderKeys.detail(orderId)
        })
      })

      toast.success(`Đã xóa ${orderIds.length} đơn hàng thành công`)
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể xóa đơn hàng. Vui lòng thử lại.')
    }
  })
}

// Hook để update order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      OrderService.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      // Invalidate and refetch admin orders list
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      })

      // Invalidate the specific order details
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(orderId)
      })

      toast.success('Trạng thái đơn hàng đã được cập nhật thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Không cập nhật được trạng thái đơn hàng. Vui lòng thử lại.')
    }
  })
}
