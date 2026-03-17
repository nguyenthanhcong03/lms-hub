import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LessonsService from '@/services/lessons'
import type {
  ILesson,
  DisplayLesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  ReorderLessonsRequest,
  LessonsFilterParams
} from '@/types/lesson'
import { chapterKeys } from './use-chapters'

// Khóa truy vấn cho lessons
export const lessonsKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonsKeys.all, 'list'] as const,
  list: (filters: LessonsFilterParams) => [...lessonsKeys.lists(), filters] as const,
  chapterLessons: (chapterId: string) => [...lessonsKeys.all, 'chapter', chapterId] as const,
  details: () => [...lessonsKeys.all, 'detail'] as const,
  detail: (id: string, params?: Record<string, unknown>) => [...lessonsKeys.details(), id, params] as const,
  slug: (slug: string) => [...lessonsKeys.details(), 'slug', slug] as const
}

// Đối tượng params rỗng mặc định để giữ tham chiếu ổn định
const DEFAULT_PARAMS: LessonsFilterParams = {}

// Các hook cho lessons
export function useLessons(params?: LessonsFilterParams) {
  const normalizedParams = params || DEFAULT_PARAMS

  return useQuery({
    queryKey: lessonsKeys.list(normalizedParams),
    queryFn: () => LessonsService.getLessons(normalizedParams)
  })
}

// Hook để fetch lessons for a chapter
export function useChapterLessons(chapterId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: lessonsKeys.chapterLessons(chapterId),
    queryFn: () => LessonsService.getChapterLessons(chapterId),
    enabled: enabled && !!chapterId,
    select: (lessons: ILesson[]): DisplayLesson[] =>
      lessons.map((lesson) => ({
        _id: lesson._id,
        title: lesson.title,
        contentType: lesson.contentType,
        resourceId: lesson.resourceId || '',
        isPublished: lesson.isPublished,
        preview: lesson.preview,
        order: lesson.order,
        duration: lesson.duration,
        resource: lesson.resource
      }))
  })
}

// Hook để get a single lesson by ID
export function useLesson(id: string, params?: Record<string, unknown>) {
  return useQuery({
    queryKey: lessonsKeys.detail(id, params),
    queryFn: () => LessonsService.getLesson(id, params),
    enabled: !!id
  })
}

// Hook để create a lesson
export function useCreateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonData: CreateLessonRequest) => LessonsService.createLesson(lessonData),
    onSuccess: (newLesson) => {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.courseChapters(newLesson.courseId)
      })
    }
  })
}

// Hook để update a lesson
export function useUpdateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonData: UpdateLessonRequest) => LessonsService.updateLesson(lessonData),
    onSuccess: (updatedLesson) => {
      // Làm mới các truy vấn chi tiết bài học cụ thể (kể cả truy vấn có params)
      queryClient.invalidateQueries({
        queryKey: lessonsKeys.details()
      })

      // QUAN TRỌNG: Làm mới truy vấn chapter của khóa học (trang chính đang dùng)
      queryClient.invalidateQueries({
        queryKey: chapterKeys.courseChapters(updatedLesson.courseId)
      })
    }
  })
}

// Hook để delete a lesson
export function useDeleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => LessonsService.deleteLesson(id),
    onSuccess: () => {
      // Làm mới toàn bộ truy vấn lesson vì không biết bài này thuộc chapter nào
      queryClient.invalidateQueries({
        queryKey: lessonsKeys.all
      })
      // QUAN TRỌNG: Làm mới toàn bộ truy vấn chapter khóa học vì không biết bài này thuộc khóa nào
      queryClient.invalidateQueries({
        queryKey: chapterKeys.all
      })
    }
  })
}

// Hook để toggle lesson publish status
export function useToggleLessonPublish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => LessonsService.toggleLessonPublish(id),
    onSuccess: (updatedLesson) => {
      // Invalidate specific lesson detail queries (including ones with params)
      queryClient.invalidateQueries({
        queryKey: lessonsKeys.details(),
        predicate: (query) => {
          const [, , lessonId] = query.queryKey
          return lessonId === updatedLesson._id
        }
      })
      // Invalidate and refetch chapter lessons
      queryClient.invalidateQueries({
        queryKey: lessonsKeys.chapterLessons(updatedLesson.chapterId)
      })
      // CRITICAL: Invalidate course chapters query (this is what the main page uses)
      queryClient.invalidateQueries({
        queryKey: chapterKeys.courseChapters(updatedLesson.courseId)
      })
    }
  })
}

// Hook để reorder lessons
export function useReorderLessons() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reorderData }: { reorderData: ReorderLessonsRequest }) => LessonsService.reorderLessons(reorderData),
    // Don't invalidate queries on success - let optimistic update handle it
    // The component will update the cache manually after successful mutation
    onError: () => {
      // On error, invalidate to ensure we get fresh data from server
      queryClient.invalidateQueries({
        queryKey: chapterKeys.all
      })
    }
  })
}

// Re-export types from service for convenience
export type {
  ILesson,
  DisplayLesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  ReorderLessonsRequest,
  LessonsFilterParams
}
