'use client'

import AlertDialogDestructive from '@/components/alert-dialog'
import { useBulkDeleteBlogs } from '@/hooks/use-blogs'
import { IBlog } from '@/types/blog'
import { toast } from 'sonner'

interface BlogsBulkDeleteDialogProps {
  selectedBlogs: IBlog[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const BlogsBulkDeleteDialog = ({ selectedBlogs, open, onOpenChange, onSuccess }: BlogsBulkDeleteDialogProps) => {
  const bulkDeleteMutation = useBulkDeleteBlogs()

  const handleBulkDelete = () => {
    const blogIds = selectedBlogs.map((blog) => blog._id)
    bulkDeleteMutation.mutate(blogIds, {
      onSuccess: () => {
        toast.success(`${selectedBlogs.length} bài viết đã được xóa thành công!`)
        onSuccess()
      }
    })
  }

  return (
    <AlertDialogDestructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleBulkDelete}
      disabled={bulkDeleteMutation.isPending}
      title={`Xóa ${selectedBlogs.length} bài viết`}
      description='Hành động này không thể hoàn tác. Các bài viết sẽ bị xóa vĩnh viễn.'
    />
  )
}

export default BlogsBulkDeleteDialog
