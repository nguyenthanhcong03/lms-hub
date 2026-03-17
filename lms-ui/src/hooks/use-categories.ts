import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import CategoriesService from '@/services/categories'
import { toast } from 'sonner'
import { CreateCategoryRequest, UpdateCategoryRequest, CategoriesFilterParams } from '@/types/category'

// Khóa truy vấn cho categories
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: CategoriesFilterParams) => [...categoryKeys.lists(), filters] as const,
  allCategories: () => [...categoryKeys.all, 'all'] as const
}

// Các hook cho categories
export function useCategories(params?: CategoriesFilterParams) {
  return useQuery({
    queryKey: categoryKeys.list(params || {}),
    queryFn: () => CategoriesService.getCategories(params),
    placeholderData: keepPreviousData
  })
}

// Hook cho getting all categories (for dropdowns)
export function useAllCategories() {
  return useQuery({
    queryKey: categoryKeys.allCategories(),
    queryFn: () => CategoriesService.getAllCategories()
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryData: CreateCategoryRequest) => CategoriesService.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không tạo được danh mục')
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryData: UpdateCategoryRequest) => CategoriesService.updateCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không cập nhật được danh mục')
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CategoriesService.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category được xóa thành công!')
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được danh mục')
    }
  })
}

export function useBulkDeleteCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryIds: string[]) => CategoriesService.bulkDeleteCategories(categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được các danh mục')
    }
  })
}
