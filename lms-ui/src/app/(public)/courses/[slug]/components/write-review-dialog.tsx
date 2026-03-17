'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useCreateReview, useUpdateReview } from '@/hooks/use-reviews'

interface WriteReviewDialogProps {
  children?: React.ReactNode
  courseTitle?: string
  courseId: string
  editMode?: {
    reviewId: string
    initialStar: number
    initialContent: string
  }
  onClose?: () => void
}

const WriteReviewDialog = ({ children, courseTitle, courseId, editMode, onClose }: WriteReviewDialogProps) => {
  const [isOpen, setIsOpen] = useState(!!editMode)
  const [star, setStar] = useState(editMode?.initialStar || 0)
  const [hoverStar, setHoverStar] = useState(0)
  const [content, setContent] = useState(editMode?.initialContent || '')

  const createReviewMutation = useCreateReview()
  const updateReviewMutation = useUpdateReview()
  const isEditMode = !!editMode

  useEffect(() => {
    if (editMode) {
      setIsOpen(true)
      setStar(editMode.initialStar)
      setContent(editMode.initialContent)
      setHoverStar(0)
    }
  }, [editMode])

  const handleSubmit = () => {
    if (star === 0 || content.trim() === '') return

    if (isEditMode && editMode) {
      updateReviewMutation.mutate(
        {
          id: editMode.reviewId,
          courseId,
          star,
          content: content.trim()
        },
        {
          onSuccess: () => {
            setIsOpen(false)
            onClose?.()
          }
        }
      )
    } else {
      createReviewMutation.mutate(
        {
          courseId,
          star,
          content: content.trim()
        },
        {
          onSuccess: () => {
            setStar(0)
            setHoverStar(0)
            setContent('')
            setIsOpen(false)
          }
        }
      )
    }
  }

  const getStarEmoji = (value: number) => {
    switch (value) {
      case 1:
        return '🤢'
      case 2:
        return '😞'
      case 3:
        return '😐'
      case 4:
        return '😊'
      case 5:
        return '😍'
      default:
        return '😐'
    }
  }

  const getStarText = (value: number) => {
    switch (value) {
      case 1:
        return 'Rất tệ'
      case 2:
        return 'Tệ'
      case 3:
        return 'Bình thường'
      case 4:
        return 'Tốt'
      case 5:
        return 'Tuyệt vời'
      default:
        return 'Chọn số sao'
    }
  }

  const getStarStyle = (value: number) => {
    if (value === (hoverStar || star)) {
      return 'bg-primary/10 border-primary'
    }
    return 'bg-muted border-border hover:bg-muted/70'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children || <Button>Viết đánh giá</Button>}</DialogTrigger>

      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl'>
            {isEditMode ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
          </DialogTitle>

          <DialogDescription className='text-xs sm:text-sm'>
            {isEditMode
              ? 'Cập nhật đánh giá của bạn.'
              : `Chia sẻ trải nghiệm của bạn với ${courseTitle || 'khóa học này'} để giúp những học viên khác.`}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Đánh giá */}
          <div className='space-y-4'>
            <Label className='text-sm font-medium'>Trải nghiệm của bạn thế nào?</Label>

            <div className='flex items-center justify-center space-x-4'>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => setStar(value)}
                  onMouseEnter={() => setHoverStar(value)}
                  onMouseLeave={() => setHoverStar(0)}
                  className='flex flex-col items-center space-y-2 transition-all'
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${getStarStyle(
                      value
                    )}`}
                  >
                    <span className='text-2xl'>{getStarEmoji(value)}</span>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      value === (hoverStar || star) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {getStarText(value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung đánh giá */}
          <div className='space-y-2'>
            <Label htmlFor='content' className='text-sm font-medium'>
              Nội dung đánh giá
            </Label>

            <Textarea
              id='content'
              placeholder='Hãy chia sẻ trải nghiệm của bạn với khóa học này...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='min-h-[120px] resize-none'
              maxLength={1000}
            />

            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>Chia sẻ trải nghiệm thật của bạn</span>
              <span>{content.length}/1000</span>
            </div>
          </div>
        </div>

        <DialogFooter className='flex-col gap-2 sm:flex-row'>
          <Button
            variant='outline'
            onClick={() => {
              setIsOpen(false)
              onClose?.()
            }}
            disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
            className='w-full sm:w-auto'
          >
            Huỷ
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              star === 0 || content.trim() === '' || createReviewMutation.isPending || updateReviewMutation.isPending
            }
            className='w-full sm:w-auto'
          >
            {createReviewMutation.isPending || updateReviewMutation.isPending
              ? isEditMode
                ? 'Đang cập nhật...'
                : 'Đang gửi...'
              : isEditMode
                ? 'Cập nhật đánh giá'
                : 'Gửi đánh giá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WriteReviewDialog
