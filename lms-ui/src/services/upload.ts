import { apiClient } from '@/lib/api-client'

interface ApiResponse<T> {
  data: T
}

export interface UploadResult {
  url: string
  publicId: string
}

export interface UploadedImage {
  publicId: string
  url: string
  createdAt?: string
  bytes?: number
  format?: string
  width?: number
  height?: number
}

export interface ListUploadedImagesResponse {
  images: UploadedImage[]
  nextCursor: string | null
  hasMore: boolean
}

export class UploadService {
  static async listUploadedImages(params?: {
    folder?: string
    limit?: number
    nextCursor?: string
  }): Promise<ListUploadedImagesResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ListUploadedImagesResponse>>('/upload/images', {
        params
      })

      return response.data.data
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } }
      throw new Error(apiError.response?.data?.message || 'Không thể lấy danh sách ảnh đã upload.')
    }
  }

  static async uploadImage(file: File, folder = 'uploads'): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const response = await apiClient.post<ApiResponse<UploadResult>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data.data
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } }
      throw new Error(apiError.response?.data?.message || 'Không thể tải ảnh lên. Vui lòng thử lại.')
    }
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await apiClient.delete('/upload', {
        data: { publicId }
      })
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } }
      throw new Error(apiError.response?.data?.message || 'Không thể xóa ảnh. Vui lòng thử lại.')
    }
  }
}

export default UploadService
