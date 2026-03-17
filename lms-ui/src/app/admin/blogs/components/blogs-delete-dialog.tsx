'use client'

import AlertDialogDestructive from '@/components/alert-dialog'
import { useDeleteBlog } from '@/hooks/use-blogs'
import { IBlog } from '@/types/blog'

interface BlogsDeleteDialogProps {
  currentRow: IBlog // Tên prop thay thế để tương thích
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BlogsDeleteDialog = ({ currentRow, open, onOpenChange }: BlogsDeleteDialogProps) => {
  const deleteBlogMutation = useDeleteBlog()

  const handleDelete = () => {
    deleteBlogMutation.mutate(currentRow?._id)
  }

  return (
    <AlertDialogDestructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteBlogMutation.isPending}
      title='Xóa bài viết'
      description='Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.'
    />
  )
}

export default BlogsDeleteDialog
