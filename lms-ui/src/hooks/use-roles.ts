import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RolesService from '@/services/roles'
import type { CreateRoleRequest, UpdateRoleRequest, RolesFilterParams } from '@/types/role'
import { toast } from 'sonner'

// Khóa truy vấn cho roles
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: RolesFilterParams) => [...roleKeys.lists(), filters] as const,
  detail: (id: string) => [...roleKeys.all, 'detail', id] as const
}

// Đối tượng params rỗng mặc định để giữ tham chiếu ổn định
const DEFAULT_PARAMS: RolesFilterParams = {}

// Hook để get all roles with optional filtering
export function useRoles(params?: RolesFilterParams) {
  const normalizedParams = params || DEFAULT_PARAMS

  return useQuery({
    queryKey: roleKeys.list(normalizedParams),
    queryFn: () => RolesService.getRoles(normalizedParams)
  })
}

// Hook để get public roles
export function usePublicRoles() {
  return useQuery({
    queryKey: ['publicRoles'],
    queryFn: () => RolesService.getPublicRoles()
  })
}

// Hook để get a single role by ID
export function useRole(id: string) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => RolesService.getRole(id),
    enabled: !!id
  })
}

// Hook để create a new role
export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleData: CreateRoleRequest) => RolesService.createRole(roleData),
    onSuccess: () => {
      // Làm mới và tải lại danh sách vai trò
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không tạo được vai trò')
    }
  })
}

// Hook để update a role
export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleData: UpdateRoleRequest) => RolesService.updateRole(roleData),
    onSuccess: (updatedRole) => {
      // Cập nhật vai trò trong cache
      queryClient.setQueryData(roleKeys.detail(updatedRole._id), updatedRole)
      // Làm mới danh sách vai trò để đảm bảo nhất quán
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không cập nhật được vai trò')
    }
  })
}

// Hook để delete a role
export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => RolesService.deleteRole(id),
    onSuccess: (_, deletedRoleId) => {
      // Xóa vai trò khỏi cache
      queryClient.removeQueries({
        queryKey: roleKeys.detail(deletedRoleId)
      })
      // Làm mới danh sách vai trò
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được vai trò')
    }
  })
}
