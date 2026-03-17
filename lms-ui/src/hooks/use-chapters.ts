import ChaptersService from '@/services/chapters'
import {
  ChaptersFilterParams,
  CreateChapterRequest,
  ReorderChaptersRequest,
  UpdateChapterRequest
} from '@/types/chapter'

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Khóa truy vấn cho chapters
export const chapterKeys = {
  all: ['chapters'] as const,
  lists: () => [...chapterKeys.all, 'list'] as const,
  list: (filters: ChaptersFilterParams) => [...chapterKeys.lists(), filters] as const,
  courseChapters: (courseId: string) => [...chapterKeys.all, 'course', courseId] as const,
  publicCourseChapters: (courseId: string) => [...chapterKeys.all, 'public', 'course', courseId] as const,
  details: () => [...chapterKeys.all, 'detail'] as const,
  detail: (id: string) => [...chapterKeys.details(), id] as const
}

// Đối tượng params rỗng mặc định để giữ tham chiếu ổn định
const DEFAULT_PARAMS: ChaptersFilterParams = {}

// Các hook cho chapters
export function useChapters(params?: ChaptersFilterParams) {
  const normalizedParams = params || DEFAULT_PARAMS

  return useQuery({
    queryKey: chapterKeys.list(normalizedParams),
    queryFn: () => ChaptersService.getChapters(normalizedParams),
    placeholderData: keepPreviousData
  })
}

// Hook để get chapters for a specific course
export function useCourseChapters(courseId: string) {
  return useQuery({
    queryKey: chapterKeys.courseChapters(courseId),
    queryFn: () => ChaptersService.getCourseChapters(courseId),
    enabled: !!courseId
  })
}

// Hook để get public chapters for a course (for course viewing page)
export function usePublicCourseChapters(courseId: string) {
  return useQuery({
    queryKey: chapterKeys.publicCourseChapters(courseId),
    queryFn: () => ChaptersService.getPublicChaptersForCourse(courseId),
    enabled: !!courseId
  })
}

// Hook để get a single chapter by ID
export function useChapter(id: string) {
  return useQuery({
    queryKey: chapterKeys.detail(id),
    queryFn: () => ChaptersService.getChapter(id),
    enabled: !!id
  })
}

// Hook để create a new chapter
export function useCreateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chapterData: CreateChapterRequest) => ChaptersService.createChapter(chapterData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.all
      })
    }
  })
}

// Hook để update an existing chapter
export function useUpdateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chapterData: UpdateChapterRequest) => ChaptersService.updateChapter(chapterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.all })
    }
  })
}

// Hook để delete a chapter
export function useDeleteChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ChaptersService.deleteChapter(id),
    onSuccess: (_, deletedId) => {
      // Làm mới toàn bộ truy vấn chapter
      queryClient.invalidateQueries({ queryKey: chapterKeys.all })
      queryClient.removeQueries({ queryKey: chapterKeys.detail(deletedId) })
    }
  })
}

// Hook để reorder chapters
export function useReorderChapters() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reorderData: ReorderChaptersRequest) => ChaptersService.reorderChapters(reorderData),
    // Không invalidate khi thành công - để optimistic update xử lý
    // Component sẽ tự xóa trạng thái optimistic sau khi mutation thành công
    onError: () => {
      // Khi lỗi, invalidate để đảm bảo lấy dữ liệu mới từ server
      queryClient.invalidateQueries({
        queryKey: chapterKeys.all
      })
    }
  })
}

// Hook để toggle chapter publish status
export function useToggleChapterPublish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ChaptersService.toggleChapterPublish(id),
    onSuccess: () => {
      // Làm mới toàn bộ truy vấn chapter
      queryClient.invalidateQueries({ queryKey: chapterKeys.all })
    }
  })
}
