import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { OctagonAlert } from 'lucide-react'

interface AlertDialogDestructiveProps {
  handleConfirm: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled: boolean
  title?: string
  description?: string
}

export default function AlertDialogDestructive({
  handleConfirm,
  open,
  onOpenChange,
  disabled,
  title = 'Bạn có chắc chắn không?',
  description = 'Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.'
}: AlertDialogDestructiveProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='bg-destructive/10 mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full'>
              <OctagonAlert className='text-destructive h-7 w-7' />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-center text-[15px]'>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2 sm:justify-center'>
          <AlertDialogCancel disabled={disabled}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled}
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleConfirm}
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
