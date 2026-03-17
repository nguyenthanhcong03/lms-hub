import UsersService from '@/services/users'
import type { UpdateUserRequest, UsersFilterParams } from '@/types/user'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Khóa truy vấn cho users
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UsersFilterParams) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const
}

// Đối tượng params rỗng mặc định để giữ tham chiếu ổn định
const DEFAULT_PARAMS: UsersFilterParams = {}

// Hook để get all users with optional filtering
export function useUsers(params?: UsersFilterParams) {
  const normalizedParams = params || DEFAULT_PARAMS

  return useQuery({
    queryKey: userKeys.list(normalizedParams),
    queryFn: () => UsersService.getUsers(normalizedParams),
    placeholderData: keepPreviousData
  })
}

// Hook để get a single user by ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => UsersService.getUser(id),
    enabled: !!id
  })
}

// Lưu ý: Tạo người dùng do đăng ký/xác thực ngoài xử lý
// Chức năng này đã được chủ đích loại bỏ khỏi admin panel

// Hook để update a user
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => UsersService.updateUser(userData),
    onSuccess: (updatedUser) => {
      // Cập nhật người dùng trong cache
      queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser)
      // Làm mới danh sách người dùng để đảm bảo nhất quán
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không cập nhật được người dùng')
    }
  })
}

// Hook để delete a user
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => UsersService.deleteUser(id),
    onSuccess: (_, deletedUserId) => {
      // Xóa người dùng khỏi cache
      queryClient.removeQueries({
        queryKey: userKeys.detail(deletedUserId)
      })
      // Làm mới danh sách người dùng
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// Hook để bulk delete users
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userIds: string[]) => UsersService.bulkDeleteUsers(userIds),
    onSuccess: (_, deletedUserIds) => {
      // Xóa toàn bộ người dùng đã xóa khỏi cache
      deletedUserIds.forEach((userId) => {
        queryClient.removeQueries({
          queryKey: userKeys.detail(userId)
        })
      })
      // Làm mới danh sách người dùng
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}
