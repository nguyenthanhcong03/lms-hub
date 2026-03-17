import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// Hàm serialize tham số tùy chỉnh cho mảng
const customParamsSerializer = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return // Bỏ qua giá trị null/undefined
    }

    if (Array.isArray(value)) {
      // Với mảng, thêm nhiều tham số cùng tên (không dùng ngoặc vuông)
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item))
        }
      })
    } else {
      // Với kiểu không phải mảng, thêm như bình thường
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

// Cấu hình API
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 giây
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: customParamsSerializer,
  // Dùng fetch adapter tích hợp (axios 1.7+) để tránh API đã deprecated
  // url.parse() used by the legacy http adapter (Node.js DEP0169).
  adapter: 'fetch'
}

// Tạo Axios instance chính
export const apiClient: AxiosInstance = axios.create(API_CONFIG)

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error)
    } else if (token) {
      item.resolve(token)
    }
  })

  failedQueue = []
}

// Interceptor cho request
apiClient.interceptors.request.use(
  (config) => {
    // Gắn token xác thực nếu có
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error('Lỗi interceptor request:', error)
    return Promise.reject(error)
  }
)

// Interceptor cho response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosError['config'] & { _retry?: boolean }) | undefined

    const status = error.response?.status
    const requestUrl = originalRequest?.url || ''

    // Tránh vòng lặp refresh với các endpoint xác thực
    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password') ||
      requestUrl.includes('/auth/verify-email')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(apiClient(originalRequest))
            },
            reject
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axios.post(
          `${API_CONFIG.baseURL}/auth/refresh`,
          {},
          {
            timeout: API_CONFIG.timeout,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            adapter: 'fetch'
          }
        )

        const refreshedData = refreshResponse.data?.data
        const newAccessToken: string | undefined = refreshedData?.token

        if (!newAccessToken) {
          throw new Error('Phản hồi làm mới token không hợp lệ')
        }

        setAccessToken(newAccessToken)
        processQueue(null, newAccessToken)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleUnauthorized()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Xử lý các kịch bản lỗi phổ biến
    if (status === 401 && !isAuthRequest) {
      handleUnauthorized()
    }

    return Promise.reject(error)
  }
)

// Hàm hỗ trợ
function getAuthToken(): string | null {
  // Lấy token từ localStorage đơn giản (không phải Zustand persist storage)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

function setAccessToken(accessToken: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken)
  }
}

function handleUnauthorized(): void {
  // Xóa token xác thực
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    // Chuyển hướng về trang đăng nhập
    // window.location.href = "/auth/sign-in";
  }
}

// Export instance đã cấu hình
export default apiClient
