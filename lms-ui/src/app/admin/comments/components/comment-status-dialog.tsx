'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateCommentStatus } from '@/hooks/use-comments'
import { MdEdit } from 'react-icons/md'
import { toast } from 'sonner'
import { IComment, CommentStatus, UpdateCommentStatusRequest } from '@/types/comment'
import { formatDistanceToNow } from 'date-fns'

// Schema xác thực chỉ cho cập nhật trạng thái
const commentValidationSchema = yup.object().shape({
  status: yup
    .mixed<CommentStatus>()
    .oneOf(Object.values(CommentStatus), 'Vui lòng chọn trạng thái hợp lệ')
    .required('Trạng thái là bắt buộc')
})

type CommentFormData = yup.InferType<typeof commentValidationSchema>

interface CommentStatusDialogProps {
  comment: IComment
  onSuccess?: (comment: IComment) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const CommentStatusDialog = ({ comment, onSuccess, open = false, onOpenChange }: CommentStatusDialogProps) => {
  // Hook gọi API
  const updateCommentMutation = useUpdateCommentStatus()
  const isLoading = updateCommentMutation.isPending

  // Khởi tạo form
  const form = useForm<CommentFormData>({
    resolver: yupResolver(commentValidationSchema),
    mode: 'onChange',
    defaultValues: {
      status: comment.status
    }
  })

  // Reset form khi dialog mở/đóng hoặc bình luận thay đổi
  React.useEffect(() => {
    if (open && comment) {
      form.reset({
        status: comment.status
      })
    }
  }, [open, comment, form])

  const onSubmit = async (data: CommentFormData) => {
    try {
      const updateData: UpdateCommentStatusRequest = {
        id: comment._id,
        status: data.status
      }

      const result = await updateCommentMutation.mutateAsync(updateData)
      toast.success('Trạng thái bình luận đã được cập nhật thành công')

      onOpenChange?.(false)
      form.reset()
      onSuccess?.(result)
    } catch (error: unknown) {
      // Xử lý lỗi API
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lỗi không xác định'
      toast.error(`Không thể cập nhật bình luận: ${errorMessage}`)
    }
  }

  // Cắt ngắn nội dung nhưng giữ HTML để hiển thị
  const truncatedContent = comment.content.length > 200 ? comment.content.substring(0, 200) + '...' : comment.content

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MdEdit className='h-5 w-5' />
            Cập nhật trạng thái bình luận
          </DialogTitle>
          <DialogDescription>Cập nhật trạng thái kiểm duyệt cho bình luận này.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Hiển thị thông tin bình luận */}
            <div className='bg-muted/50 space-y-3 rounded-lg p-4'>
              <div className='text-sm'>
                <span className='font-medium'>Tác giả:</span> {comment.user?.username || 'Người dùng không xác định'}
              </div>
              <div className='text-sm'>
                <span className='font-medium'>Email:</span> {comment.user?.email || 'Email không xác định'}
              </div>
              <div className='text-sm'>
                <span className='font-medium'>Thời gian tạo:</span>{' '}
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true
                })}
              </div>
              <div className='text-sm'>
                <span className='font-medium'>Cấp độ:</span>{' '}
                {comment.level === 0 ? 'Bình luận chính' : `Cấp độ phản hồi ${comment.level}`}
              </div>
              <div className='text-sm'>
                <span className='font-medium'>Nội dung:</span>
                <div
                  className='bg-background mt-1 rounded border p-2 text-sm leading-relaxed'
                  dangerouslySetInnerHTML={{
                    __html: truncatedContent
                  }}
                />
              </div>
              <div className='text-sm'>
                <span className='font-medium'>Trạng thái hiện tại:</span>{' '}
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    comment.status === CommentStatus.APPROVED
                      ? 'bg-green-100 text-green-800'
                      : comment.status === CommentStatus.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {comment.status}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cập nhật trạng thái *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full' disabled={isLoading}>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CommentStatus.PENDING}>Chờ duyệt</SelectItem>
                      <SelectItem value={CommentStatus.APPROVED}>Đã duyệt</SelectItem>
                      <SelectItem value={CommentStatus.REJECTED}>Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange?.(false)} disabled={isLoading}>
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CommentStatusDialog
