import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import BlogsService from '@/services/blogs'
import { toast } from 'sonner'
import { CreateBlogRequest, UpdateBlogRequest, BlogsFilterParams } from '@/types/blog'

// Khóa truy vấn cho blogs
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: BlogsFilterParams) => [...blogKeys.lists(), filters] as const,
  published: (params: Omit<BlogsFilterParams, 'status'>) => [...blogKeys.all, 'published', params] as const,
  allBlogs: () => [...blogKeys.all, 'all'] as const,
  detail: (id: string) => [...blogKeys.all, 'detail', id] as const
}

// Các hook cho blogs
export function useBlogs(params?: BlogsFilterParams) {
  return useQuery({
    queryKey: blogKeys.list(params || {}),
    queryFn: () => BlogsService.getBlogs(params),
    placeholderData: keepPreviousData
  })
}

// Hook cho getting published blogs
export function usePublishedBlogs(params?: Omit<BlogsFilterParams, 'status'>) {
  return useQuery({
    queryKey: blogKeys.published(params || {}),
    queryFn: () => BlogsService.getPublishedBlogs(params),
    placeholderData: keepPreviousData
  })
}

// Hook cho getting all blogs (for dropdowns)
export function useAllBlogs() {
  return useQuery({
    queryKey: blogKeys.allBlogs(),
    queryFn: () => BlogsService.getAllBlogs()
  })
}

// Hook cho getting single blog
export function useBlog(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => BlogsService.getBlog(id),
    enabled: !!id
  })
}

// Hook cho getting blog by slug
export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: [...blogKeys.all, 'slug', slug] as const,
    queryFn: () => BlogsService.getBlogBySlug(slug),
    enabled: !!slug
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blogData: CreateBlogRequest) => BlogsService.createBlog(blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không tạo được bài viết')
    }
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blogData: UpdateBlogRequest) => BlogsService.updateBlog(blogData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(data._id) })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không cập nhật được bài viết')
    }
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => BlogsService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được bài viết')
    }
  })
}

export function useBulkDeleteBlogs() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blogIds: string[]) => BlogsService.bulkDeleteBlogs(blogIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được các bài viết')
    }
  })
}
