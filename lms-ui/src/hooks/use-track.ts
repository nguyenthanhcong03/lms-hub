'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import TrackService from '@/services/track'
import { CreateTrackRequest, DeleteTrackRequest, ToggleTrackRequest } from '@/types/track'

// Khóa truy vấn cho track
export const trackKeys = {
  all: ['track'] as const,
  courseTracks: (courseId: string) => [...trackKeys.all, 'course', courseId] as const,
  track: (id: string) => [...trackKeys.all, 'detail', id] as const
} as const

// Hook để get user's completion tracks for a specific course
export function useUserCourseTracks(courseId: string) {
  return useQuery({
    queryKey: trackKeys.courseTracks(courseId),
    queryFn: () => TrackService.getCourseTracksForUser(courseId),
    enabled: !!courseId // Chỉ chạy khi có courseId
  })
}

// Hook để get a single track by ID
export function useTrack(id: string) {
  return useQuery({
    queryKey: trackKeys.track(id),
    queryFn: () => TrackService.getTrack(id),
    enabled: !!id
  })
}

// Hook để create a track (mark lesson as completed)
export function useCreateTrack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTrackRequest) => TrackService.createTrack(data),
    onSuccess: (data, variables) => {
      // Làm mới truy vấn track của khóa học để tải lại
      queryClient.invalidateQueries({
        queryKey: trackKeys.courseTracks(variables.courseId)
      })

      // Hiển thị thông báo thành công (nếu cần)
      toast.success('Đã đánh dấu hoàn thành bài học!')
    },
    onError: (error) => {
      console.error('Tạo tiến độ thất bại:', error)
      toast.error('Không thể đánh dấu hoàn thành bài học')
    }
  })
}

// Hook để delete a track (mark lesson as uncompleted)
export function useDeleteTrack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteTrackRequest) => TrackService.deleteTrack(data),
    onSuccess: (data, variables) => {
      // Làm mới truy vấn track của khóa học để tải lại
      queryClient.invalidateQueries({
        queryKey: trackKeys.courseTracks(variables.courseId)
      })

      // Hiển thị thông báo thành công (nếu cần)
      toast.success('Đã xóa đánh dấu hoàn thành bài học!')
    },
    onError: (error) => {
      console.error('Xóa tiến độ thất bại:', error)
      toast.error('Không thể xóa đánh dấu hoàn thành bài học')
    }
  })
}

// Hook tùy chỉnh để bật/tắt track
export function useToggleTrack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ToggleTrackRequest) => TrackService.toggleTrack(data),
    onSuccess: (data, variables) => {
      // Làm mới truy vấn track của khóa học để tải lại
      queryClient.invalidateQueries({
        queryKey: trackKeys.courseTracks(variables.courseId)
      })

      toast.success('Cập nhật trạng thái bài học thành công!')
    },
    onError: (error) => {
      console.error('Cập nhật tiến độ thất bại:', error)
      toast.error('Không thể cập nhật trạng thái bài học')
    }
  })
}
