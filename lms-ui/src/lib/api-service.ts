import { apiClient } from '@/lib/api-client'
import { AxiosResponse, AxiosError } from 'axios'

// Kiểu phản hồi API dùng chung
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// Kiểu phản hồi lỗi API
export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  code?: string
  success: false
}

// Kiểu lỗi API dùng chung
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  code?: string
}

// Lớp service API dùng chung
export class ApiService {
  // Yêu cầu GET
  static async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, {
        params
      })

      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Yêu cầu POST
  static async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data)

      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Yêu cầu PUT
  static async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data)

      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Yêu cầu PATCH
  static async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, data)

      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Yêu cầu DELETE
  static async delete<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, data ? { data } : undefined)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Tải blob (dùng cho tải tệp)
  static async downloadBlob(url: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await apiClient.get(url, {
        responseType: 'blob'
      })

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Hàm xử lý lỗi
  private static handleError(error: unknown): ApiError {
    const axiosError = error as AxiosError<ApiErrorResponse>

    if (axiosError.response) {
      // Server phản hồi với trạng thái lỗi
      const apiError: ApiError = {
        message: axiosError.response.data?.message || 'Đã xảy ra lỗi',
        errors: axiosError.response.data?.errors,
        code: axiosError.response.data?.code
      }
      return apiError
    } else if (axiosError.request) {
      // Yêu cầu đã gửi nhưng không nhận được phản hồi
      return {
        message: 'Lỗi mạng - vui lòng kiểm tra kết nối của bạn',
        code: 'NETWORK_ERROR'
      }
    } else {
      // Trường hợp lỗi khác
      return {
        message: axiosError.message || 'Đã xảy ra lỗi không mong muốn',
        code: 'UNKNOWN_ERROR'
      }
    }
  }
}

// Export để dùng trực tiếp
export default ApiService
