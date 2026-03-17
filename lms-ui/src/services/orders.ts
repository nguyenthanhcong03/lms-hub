import { ApiService } from '@/lib/api-service'
import type {
  OrderDetails,
  MyOrdersListResponse,
  OrdersListResponse,
  OrdersFilterParams,
  CreateOrderRequest,
  CreateOrderResponse,
  IOrder,
  AdminOrdersListResponse,
  AdminOrdersFilterParams,
  UpdateAdminOrderRequest
} from '@/types/order'

const ENDPOINTS = {
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders',
  USER_ORDERS: '/orders/my-orders'
} as const

export class OrderService {
  // Lấy đơn hàng theo ID
  static async getOrderById(orderId: string): Promise<OrderDetails> {
    try {
      return await ApiService.get<OrderDetails>(`${ENDPOINTS.ORDER_DETAILS}/${orderId}`)
    } catch {
      throw new Error('Không thể tải đơn hàng')
    }
  }

  // Lấy danh sách đơn hàng người dùng (legacy)
  static async getUserOrders(params?: OrdersFilterParams): Promise<OrdersListResponse> {
    try {
      return await ApiService.get<OrdersListResponse>(ENDPOINTS.USER_ORDERS, params as Record<string, unknown>)
    } catch {
      return {
        orders: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    }
  }

  // Lấy danh sách đơn hàng của tôi
  static async getMyOrders(params?: OrdersFilterParams): Promise<MyOrdersListResponse> {
    try {
      return await ApiService.get<MyOrdersListResponse>(ENDPOINTS.USER_ORDERS, params as Record<string, unknown>)
    } catch {
      return {
        orders: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    }
  }

  // Hủy đơn hàng
  static async cancelOrder(orderId: string): Promise<void> {
    return ApiService.put<void>(`${ENDPOINTS.ORDER_DETAILS}/${orderId}/cancel`)
  }

  // Tạo đơn hàng (quy trình thanh toán)
  static async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return ApiService.post<CreateOrderResponse, CreateOrderRequest>(ENDPOINTS.ORDERS, data)
  }

  // Lấy danh sách đơn hàng quản trị
  static async getAdminOrders(params?: AdminOrdersFilterParams): Promise<AdminOrdersListResponse> {
    try {
      return await ApiService.get<AdminOrdersListResponse>(ENDPOINTS.ORDERS, params as Record<string, unknown>)
    } catch {
      return {
        orders: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    }
  }

  // Lấy đơn hàng quản trị theo ID
  static async getAdminOrderById(orderId: string): Promise<IOrder> {
    try {
      return await ApiService.get<IOrder>(`${ENDPOINTS.ORDERS}/${orderId}`)
    } catch {
      throw new Error('Không thể tải đơn hàng quản trị')
    }
  }

  // Cập nhật đơn hàng quản trị
  static async updateAdminOrder(orderData: UpdateAdminOrderRequest): Promise<IOrder> {
    const { id, ...updateData } = orderData
    return ApiService.put<IOrder, Partial<UpdateAdminOrderRequest>>(`${ENDPOINTS.ORDERS}/${id}`, updateData)
  }

  // Xóa đơn hàng quản trị
  static async deleteAdminOrder(orderId: string): Promise<void> {
    return ApiService.delete<void>(`${ENDPOINTS.ORDERS}/${orderId}`)
  }

  // Xóa hàng loạt đơn hàng quản trị
  static async bulkDeleteAdminOrders(orderIds: string[]): Promise<void> {
    return ApiService.delete<void, { orderIds: string[] }>(`${ENDPOINTS.ORDERS}/bulk`, { orderIds })
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(orderId: string, status: string): Promise<IOrder> {
    return ApiService.put<IOrder, { status: string }>(`${ENDPOINTS.ORDERS}/${orderId}/status`, { status })
  }

  // Tải hóa đơn
  static async downloadInvoice(orderId: string, orderCode: string): Promise<void> {
    try {
      // Lấy blob từ API
      const blob = await ApiService.downloadBlob(`${ENDPOINTS.ORDERS}/${orderId}/invoice`)

      // Tạo liên kết tải xuống
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `hoa-don-${orderCode}.pdf`
      document.body.appendChild(link)
      link.click()

      // Dọn dẹp
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      throw new Error('Không thể tải hóa đơn')
    }
  }
}

export default OrderService
