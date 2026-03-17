'use client'

import AlertDialogDestructive from '@/components/alert-dialog'
import { useDeleteCommentAdmin } from '@/hooks/use-comments'
import { IComment } from '@/types/comment'

interface CommentsDeleteDialogProps {
  currentRow: IComment // Tên prop thay thế để tương thích
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CommentsDeleteDialog = ({ currentRow, open, onOpenChange }: CommentsDeleteDialogProps) => {
  const deleteCommentMutation = useDeleteCommentAdmin()

  const handleDelete = () => {
    deleteCommentMutation.mutate(currentRow?._id)
  }

  return (
    <AlertDialogDestructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteCommentMutation.isPending}
    />
  )
}

export default CommentsDeleteDialog
