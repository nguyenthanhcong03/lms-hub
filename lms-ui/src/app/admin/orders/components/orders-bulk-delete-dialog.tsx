'use client'

import AlertDialogDestructive from '@/components/alert-dialog'
import { useBulkDeleteAdminOrders } from '@/hooks/use-orders'
import { toast } from 'sonner'

interface OrdersBulkDeleteDialogProps {
  selectedOrders: string[] // Theo mẫu hiện tại với danh sách ID đơn hàng
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const OrdersBulkDeleteDialog = ({ selectedOrders, open, onOpenChange, onSuccess }: OrdersBulkDeleteDialogProps) => {
  const bulkDeleteMutation = useBulkDeleteAdminOrders()

  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedOrders, {
      onSuccess: () => {
        toast.success(`Đã xóa ${selectedOrders.length} đơn hàng${selectedOrders.length === 1 ? '' : ''} thành công`)
        onSuccess?.()
      }
    })
  }

  return (
    <AlertDialogDestructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleBulkDelete}
      disabled={bulkDeleteMutation.isPending}
    />
  )
}

export default OrdersBulkDeleteDialog
