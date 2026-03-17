'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
  keepPreviousData
} from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { cloneDeep } from 'lodash'
import { CommentsService } from '@/services/comments'
import type {
  IComment,
  CreateCommentRequest,
  UpdateCommentRequest,
  UpdateCommentStatusRequest,
  DirectCommentsListResponse,
  CommentsFilterParams
} from '@/types/comment'
import { ReactionType } from '@/types/comment'

// Khóa truy vấn cho comments
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (filters: CommentsFilterParams) => [...commentKeys.lists(), { filters }] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  lessonComments: (lessonId: string) => [...commentKeys.all, 'lesson', lessonId] as const,
  replies: (parentId: string) => [...commentKeys.all, 'replies', parentId] as const
}

// Hook để get all comments with optional filtering
export function useAllComments(params?: CommentsFilterParams) {
  return useQuery({
    queryKey: commentKeys.list(params || {}),
    queryFn: () => CommentsService.getAllComments(params),
    placeholderData: keepPreviousData
  })
}

// Hook để get comments for a lesson
export function useComments(lessonId: string, params?: Omit<CommentsFilterParams, 'lessonId'>) {
  return useQuery({
    queryKey: commentKeys.lessonComments(lessonId),
    queryFn: () => CommentsService.getComments(lessonId, params),
    enabled: !!lessonId
  })
}

// Hook để get infinite scroll comments
export function useInfiniteComments(lessonId: string) {
  return useInfiniteQuery({
    queryKey: [...commentKeys.lessonComments(lessonId), 'infinite'],
    queryFn: ({ pageParam = 1 }) => CommentsService.getComments(lessonId, { page: pageParam }),
    enabled: !!lessonId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, hasNextPage } = lastPage.pagination
      return hasNextPage ? Number(page) + 1 : undefined
    }
  })
}

// Hook để get a single comment
export function useComment(id: string) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => CommentsService.getComment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

// Hook để create a comment
export function useCreateComment() {
  const queryClient = useQueryClient()

  // Hàm trợ giúp để thêm phản hồi vào cấu trúc lồng nhau theo đệ quy
  const addReplyToComments = (comments: IComment[], parentId: string, newReply: IComment): IComment[] => {
    return comments.map((comment) => {
      if (comment._id === parentId) {
        // Tìm thấy bình luận cha - thêm phản hồi mới vào đầu danh sách
        return {
          ...comment,
          replies: [newReply, ...(comment.replies || [])],
          replyCount: (comment.replyCount || 0) + 1
        }
      } else if (comment.replies?.length > 0) {
        // Tìm kiếm trong các phản hồi lồng nhau theo đệ quy
        const updatedReplies = addReplyToComments(comment.replies, parentId, newReply)
        // Chỉ cập nhật khi có thay đổi
        if (updatedReplies !== comment.replies) {
          return {
            ...comment,
            replies: updatedReplies
          }
        }
      }
      return comment
    })
  }

  return useMutation({
    mutationFn: (commentData: CreateCommentRequest) => CommentsService.createComment(commentData),
    onSuccess: (newComment) => {
      if (newComment) {
        const infiniteQueryKey = [...commentKeys.lessonComments(newComment.lessonId), 'infinite']

        if (!newComment.parentId) {
          // Xử lý bình luận cấp cao nhất
          queryClient.setQueryData(infiniteQueryKey, (old: InfiniteData<DirectCommentsListResponse, unknown>) => {
            if (!old?.pages?.[0]) return old

            // Thêm bình luận mới vào trang đầu tiên
            const firstPage = old.pages[0]
            const updatedFirstPage = {
              ...firstPage,
              comments: [newComment, ...firstPage.comments],
              pagination: {
                ...firstPage.pagination,
                total: firstPage.pagination.total + 1
              }
            }

            return {
              ...old,
              pages: [updatedFirstPage, ...old.pages.slice(1)]
            }
          })
        } else {
          // Xử lý bình luận phản hồi bằng lodash để cập nhật sâu
          queryClient.setQueryData(infiniteQueryKey, (old: InfiniteData<DirectCommentsListResponse, unknown>) => {
            if (!old?.pages) return old

            // Sao chép cấu trúc dữ liệu để tránh mutate trực tiếp
            const newData = cloneDeep(old)

            // Cập nhật từng trang có thể chứa bình luận cha
            newData.pages = newData.pages.map((page) => ({
              ...page,
              comments: addReplyToComments(page.comments, newComment.parentId!, newComment)
            }))

            return newData
          })
        }
      }

      toast.success('Bình luận đã được thêm!')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Không thể thêm bình luận. Vui lòng thử lại.')
    }
  })
}

// Hook để update a comment (similar to comment reactions - direct cache update)
export function useUpdateComment(lessonId?: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentRequest }) => CommentsService.updateComment(id, data),
    onSuccess: (updatedComment) => {
      // Cập nhật bình luận trong cache - chỉ gộp phần thay đổi, giữ nguyên dữ liệu khác
      if (!lessonId) return

      // Hàm trợ giúp để tìm và cập nhật bình luận cụ thể theo đệ quy
      const updateCommentInArray = (comments: IComment[]): IComment[] => {
        return comments.map((comment) => {
          if (comment._id === updatedComment._id) {
            // Chỉ cập nhật các trường thay đổi, giữ nguyên dữ liệu khác (replies, reactions,...)
            return {
              ...comment,
              content: updatedComment.content,
              updatedAt: updatedComment.updatedAt
              // Có thể thêm các trường cập nhật khác từ API tại đây
            }
          }
          // Tìm kiếm đệ quy trong replies
          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: updateCommentInArray(comment.replies)
            }
          }
          return comment
        })
      }

      // Cập nhật cache của infinite query (cache chính dùng bởi lesson-comment-drawer)
      const infiniteQueryKey = [...commentKeys.lessonComments(lessonId), 'infinite']
      queryClient.setQueryData(
        infiniteQueryKey,
        (oldData: InfiniteData<DirectCommentsListResponse, unknown> | undefined) => {
          if (!oldData?.pages) return oldData

          const newData = cloneDeep(oldData)
          newData.pages = newData.pages.map((page) => ({
            ...page,
            comments: updateCommentInArray(page.comments || [])
          }))

          return newData
        }
      )

      toast.success('Bình luận đã được cập nhật thành công!')
    },
    onError: (error: Error) => {
      console.error('Cập nhật bình luận thất bại:', error)
      toast.error('Không cập nhật được bình luận. Vui lòng thử lại.')
    }
  })

  return {
    updateComment: mutation.mutateAsync,
    ...mutation
  }
}

// Hook để delete a comment (similar to comment reactions - direct cache update)
export function useDeleteComment(lessonId?: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => CommentsService.deleteComment(id),
    onSuccess: (_, commentId) => {
      // Cập nhật bình luận trong cache - xóa bình luận đã xóa, giữ nguyên phần còn lại
      if (!lessonId) return

      // Hàm trợ giúp để tìm và xóa bình luận cụ thể theo đệ quy
      const removeCommentFromArray = (comments: IComment[]): IComment[] => {
        return comments
          .filter((comment) => comment._id !== commentId) // Xóa bình luận đã bị xóa
          .map((comment) => {
            // Đồng thời xóa trong replies nếu lồng nhau
            if (comment.replies?.length > 0) {
              return {
                ...comment,
                replies: removeCommentFromArray(comment.replies),
                // Cập nhật số lượng phản hồi nếu cần
                replyCount: Math.max(0, comment.replyCount - (comment.replies.some((r) => r._id === commentId) ? 1 : 0))
              }
            }
            return comment
          })
      }

      // Cập nhật cache của infinite query (cache chính dùng bởi lesson-comment-drawer)
      const infiniteQueryKey = [...commentKeys.lessonComments(lessonId), 'infinite']
      queryClient.setQueryData(
        infiniteQueryKey,
        (oldData: InfiniteData<DirectCommentsListResponse, unknown> | undefined) => {
          if (!oldData?.pages) return oldData

          const newData = cloneDeep(oldData)
          newData.pages = newData.pages.map((page) => ({
            ...page,
            comments: removeCommentFromArray(page.comments || []),
            pagination: {
              ...page.pagination,
              total: Math.max(0, page.pagination.total - 1) // Giảm tổng số lượng
            }
          }))

          return newData
        }
      )

      toast.success('Bình luận đã được xóa thành công!')
    },
    onError: (error: Error) => {
      console.error('Xóa bình luận thất bại:', error)
      toast.error('Không xóa được bình luận. Vui lòng thử lại.')
    }
  })

  return {
    deleteComment: mutation.mutateAsync,
    ...mutation
  }
}

// Hook để delete a comment (legacy version for admin use)
export function useDeleteCommentAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CommentsService.deleteComment(id),
    onSuccess: (_, commentId) => {
      // Xóa khỏi cache và làm mới các truy vấn liên quan (hành vi cho admin)
      queryClient.removeQueries({
        queryKey: commentKeys.detail(commentId)
      })

      // Làm mới toàn bộ danh sách bình luận để cập nhật số lượng
      queryClient.invalidateQueries({
        queryKey: commentKeys.all
      })

      toast.success('Bình luận đã được xóa thành công!')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Không xóa được bình luận. Vui lòng thử lại.')
    }
  })
}

// Hook để bulk delete comments (admin only)
export function useBulkDeleteComments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentIds: string[]) => CommentsService.bulkDeleteComments(commentIds),
    onSuccess: () => {
      // Làm mới toàn bộ truy vấn bình luận
      queryClient.invalidateQueries({
        queryKey: commentKeys.all
      })
      toast.success('Các bình luận đã được xóa!')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Không thể xóa bình luận. Vui lòng thử lại.')
    }
  })
}

// Hook để load replies for a comment
export function useLoadReplies(lessonId: string) {
  const queryClient = useQueryClient()
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({})

  const loadReplies = async (commentId: string, comments: IComment[]) => {
    if (loadingReplies[commentId]) return

    // Hàm trợ giúp để tìm bình luận theo đệ quy
    const findCommentRecursively = (comments: IComment[], targetId: string): IComment | null => {
      for (const comment of comments) {
        if (comment._id === targetId) return comment
        if (comment.replies?.length > 0) {
          const found = findCommentRecursively(comment.replies, targetId)
          if (found) return found
        }
      }
      return null
    }

    const targetComment = findCommentRecursively(comments, commentId)

    // Nếu đã có phản hồi thì không cần gọi API nữa
    if (targetComment?.replies && targetComment.replies.length > 0) {
      return true // Báo thành công mà không cần tải lại
    }

    setLoadingReplies((prev) => ({
      ...prev,
      [commentId]: true
    }))

    try {
      // Lấy phản hồi từ API
      const repliesData = await CommentsService.getReplies(commentId, {
        page: 1,
        limit: 100 // Lấy toàn bộ phản hồi trong một lần
      })

      // Cập nhật cache React Query với dữ liệu phản hồi vừa lấy
      const infiniteQueryKey = [...commentKeys.lessonComments(lessonId), 'infinite']

      queryClient.setQueryData(infiniteQueryKey, (old: InfiniteData<DirectCommentsListResponse, unknown>) => {
        if (!old?.pages) return old

        // Hàm trợ giúp để thêm replies đúng bình luận cha theo đệ quy
        const addRepliesToComment = (comments: IComment[], parentId: string, replies: IComment[]): IComment[] => {
          return comments.map((comment) => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replies: replies
              }
            } else if (comment.replies?.length > 0) {
              return {
                ...comment,
                replies: addRepliesToComment(comment.replies, parentId, replies)
              }
            }
            return comment
          })
        }

        // Cập nhật từng trang có thể chứa bình luận cha
        const newData = cloneDeep(old)
        newData.pages = newData.pages.map((page: DirectCommentsListResponse) => ({
          ...page,
          comments: addRepliesToComment(page.comments, commentId, repliesData.comments)
        }))

        return newData
      })

      return true // Báo thành công
    } catch (error) {
      console.error('Tải phản hồi thất bại:', error)
      toast.error('Không thể tải phản hồi. Vui lòng thử lại.')
      return false // Báo thất bại
    } finally {
      setLoadingReplies((prev) => ({
        ...prev,
        [commentId]: false
      }))
    }
  }

  return {
    loadReplies,
    loadingReplies
  }
}

// Hook để handle comment reactions
interface UseCommentReactionsParams {
  lessonId?: string
}

export function useCommentReactions({ lessonId }: UseCommentReactionsParams = {}) {
  const queryClient = useQueryClient()

  const reactionMutation = useMutation({
    mutationFn: async ({ commentId, reaction }: { commentId: string; reaction: ReactionType }) => {
      return CommentsService.addReaction(commentId, reaction)
    },
    onSuccess: (updatedComment) => {
      // Cập nhật bình luận trong cache - chỉ gộp dữ liệu phản ứng, giữ nguyên phần còn lại

      if (!lessonId) return

      // Hàm trợ giúp để tìm và cập nhật bình luận cụ thể theo đệ quy
      const updateCommentReactions = (comments: IComment[]): IComment[] => {
        return comments.map((comment) => {
          if (comment._id === updatedComment._id) {
            // Chỉ cập nhật mảng phản ứng, giữ nguyên dữ liệu khác (content, replies, user,...)
            return {
              ...comment,
              reactions: updatedComment.reactions
            }
          }
          // Tìm kiếm đệ quy trong replies
          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: updateCommentReactions(comment.replies)
            }
          }
          return comment
        })
      }

      // Cập nhật cache của infinite query (cache chính dùng bởi lesson-comment-drawer)
      const infiniteQueryKey = [...commentKeys.lessonComments(lessonId), 'infinite']
      queryClient.setQueryData(
        infiniteQueryKey,
        (oldData: InfiniteData<DirectCommentsListResponse, unknown> | undefined) => {
          if (!oldData?.pages) return oldData

          const newData = cloneDeep(oldData)

          newData.pages = newData.pages.map((page) => ({
            ...page,
            comments: updateCommentReactions(page.comments || [])
          }))

          return newData
        }
      )

      toast.success('Phản ứng đã được cập nhật thành công!')
    },
    onError: (error) => {
      console.error('Cập nhật phản ứng thất bại:', error)
      toast.error('Không cập nhật được phản ứng. Vui lòng thử lại.')
    }
  })

  const toggleReaction = (commentId: string, reaction: ReactionType, currentUserId?: string) => {
    if (!currentUserId) {
      toast.error('Vui lòng đăng nhập để tương tác với bình luận')
      return
    }

    reactionMutation.mutate({
      commentId,
      reaction
    })
  }

  return {
    toggleReaction,
    isLoading: reactionMutation.isPending,
    isError: reactionMutation.isError,
    error: reactionMutation.error
  }
}

/**
 * Hook to update comment status (approve/reject/pending)
 */
export function useUpdateCommentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCommentStatusRequest) => CommentsService.updateCommentStatus(data),
    onSuccess: (updatedComment, variables) => {
      // Làm mới toàn bộ truy vấn bình luận để cập nhật danh sách
      queryClient.invalidateQueries({
        queryKey: commentKeys.all
      })

      // If we know the lessonId, invalidate specific lesson comments
      if (updatedComment.lessonId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.list({ lessonId: updatedComment.lessonId })
        })
      }

      // Show success toast based on status
      const statusMessages = {
        approved: 'Bình luận đã được phê duyệt thành công',
        rejected: 'Bình luận đã bị từ chối thành công',
        pending: 'Bình luận đã được chuyển sang chờ xử lý'
      }

      toast.success(statusMessages[variables.status] || 'Trạng thái bình luận đã được cập nhật')
    },
    onError: (error) => {
      console.error('Cập nhật trạng thái bình luận thất bại:', error)
      toast.error('Không thể cập nhật trạng thái bình luận')
    }
  })
}
