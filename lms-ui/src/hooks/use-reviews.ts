import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ReviewsService from '@/services/reviews'
import { CreateReviewRequest, IReview, UpdateReviewRequest } from '@/types/review'
import { toast } from 'sonner'
import { useState, useEffect, useCallback } from 'react'

// Khóa truy vấn
export const reviewsKeys = {
  all: ['reviews'] as const,
  courseReviews: (courseId: string) => [...reviewsKeys.all, 'course', courseId] as const,
  courseReviewsWithFilter: (courseId: string, filters?: Record<string, string | number>) =>
    [...reviewsKeys.courseReviews(courseId), filters] as const
}

/**
 * Hook lấy đánh giá cho một khóa học cụ thể
 */
export function useCourseReviews(
  courseId: string,
  params?: {
    page?: number
    limit?: number
    minStar?: number
  }
) {
  return useQuery({
    queryKey: reviewsKeys.courseReviewsWithFilter(courseId, params),
    queryFn: () => ReviewsService.getCourseReviews(courseId, params),
    enabled: !!courseId
  })
}

/**
 * Hook lấy đánh giá có hỗ trợ tải thêm
 */
export function useCourseReviewsWithLoadMore(
  courseId: string,
  initialParams?: {
    limit?: number
    minStar?: number
  }
) {
  const [page, setPage] = useState(1)
  const [allReviews, setAllReviews] = useState<IReview[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const limit = initialParams?.limit || 10

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: reviewsKeys.courseReviewsWithFilter(courseId, {
      page,
      limit,
      ...(initialParams?.minStar && { minStar: initialParams.minStar })
    }),
    queryFn: () =>
      ReviewsService.getCourseReviews(courseId, {
        page,
        limit,
        ...(initialParams?.minStar && { minStar: initialParams.minStar })
      }),
    enabled: !!courseId
  })

  // Cập nhật danh sách đánh giá khi dữ liệu thay đổi
  useEffect(() => {
    if (reviewsData) {
      if (page === 1) {
        // Lần tải đầu - thay toàn bộ danh sách
        setAllReviews(reviewsData.reviews)
      } else {
        // Tải thêm - nối thêm đánh giá mới
        setAllReviews((prev) => [...prev, ...reviewsData.reviews])
      }
      setHasNextPage(reviewsData.hasNextPage)
      setIsLoadingMore(false)
    }
  }, [reviewsData, page])

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore && !isLoading) {
      setIsLoadingMore(true)
      setPage((prev) => prev + 1)
    }
  }, [hasNextPage, isLoadingMore, isLoading])

  const reset = useCallback(() => {
    setPage(1)
    setAllReviews([])
    setHasNextPage(false)
    setIsLoadingMore(false)
  }, [])

  return {
    reviews: allReviews,
    averageRating: reviewsData?.averageRating || 0,
    total: reviewsData?.total || 0,
    ratingDistribution: reviewsData?.ratingDistribution || {},
    isLoading: isLoading && page === 1,
    isLoadingMore,
    hasNextPage,
    loadMore,
    reset,
    refetch,
    error
  }
}

/**
 * Hook tạo đánh giá mới
 */
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => ReviewsService.submitReview(data),
    onSuccess: (_, variables) => {
      // Làm mới và tải lại đánh giá của khóa học
      queryClient.invalidateQueries({
        queryKey: reviewsKeys.courseReviews(variables.courseId)
      })

      toast.success('Đánh giá đã được gửi thành công!')
    },
    onError: () => {
      toast.error('Không gửi được đánh giá')
    }
  })
}

/**
 * Hook cập nhật đánh giá hiện có
 */
export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateReviewRequest) => ReviewsService.updateReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewsKeys.courseReviews(variables.courseId)
      })

      toast.success('Đánh giá đã được cập nhật thành công!')
    },
    onError: () => {
      toast.error('Không cập nhật được đánh giá')
    }
  })
}

/**
 * Hook xóa đánh giá
 */
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; courseId: string }) => ReviewsService.deleteReview(reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewsKeys.courseReviews(variables.courseId)
      })

      toast.success('Đánh giá đã được xóa thành công!')
    },
    onError: () => {
      toast.error('Không xóa được đánh giá')
    }
  })
}

/**
 * Hook bật/tắt lượt thích đánh giá
 */
export function useToggleReviewLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; courseId: string }) => ReviewsService.toggleReviewLike(reviewId),
    onSuccess: (_, variables) => {
      // Cập nhật UI theo hướng optimistic bằng cách làm mới truy vấn
      queryClient.invalidateQueries({
        queryKey: reviewsKeys.courseReviews(variables.courseId)
      })
    },
    onError: () => {
      toast.error('Không cập nhật được lượt thích')
    }
  })
}
