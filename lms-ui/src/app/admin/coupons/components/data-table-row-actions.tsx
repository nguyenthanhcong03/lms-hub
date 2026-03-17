'use client'

import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconCopy } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Coupon } from '@/types/coupon'
import CouponsActionDialog from './coupons-action-dialog'
import CouponsDeleteDialog from './coupons-delete-dialog'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { PERMISSIONS } from '@/configs/permission'

interface DataTableRowActionsProps {
  row: Row<Coupon>
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const hasPermission = useAuthStore((state) => state.hasPermission)

  const coupon = row.original

  const handleEditClick = () => {
    setEditDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code)
      toast.success(`Đã sao chép mã giảm giá "${coupon.code}" vào bộ nhớ tạm!`)
    } catch (error) {
      console.error('Không thể sao chép mã giảm giá:', error)
      toast.error('Không thể sao chép mã giảm giá')
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={handleCopyCode}>
            Sao chép mã
            <DropdownMenuShortcut>
              <IconCopy size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {hasPermission(PERMISSIONS.COUPON_UPDATE) && (
            <DropdownMenuItem onClick={handleEditClick}>
              Chỉnh sửa
              <DropdownMenuShortcut>
                <IconEdit size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {(hasPermission(PERMISSIONS.COUPON_UPDATE) || hasPermission(PERMISSIONS.COUPON_DELETE)) && (
            <DropdownMenuSeparator />
          )}
          {hasPermission(PERMISSIONS.COUPON_DELETE) && (
            <DropdownMenuItem onClick={handleDeleteClick} className='text-red-500!'>
              Xóa
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hộp thoại chỉnh sửa - chỉ hiển thị khi có quyền cập nhật và hộp thoại đang mở */}
      {hasPermission(PERMISSIONS.COUPON_UPDATE) && editDialogOpen && (
        <CouponsActionDialog mode='edit' coupon={coupon} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      )}

      {/* Hộp thoại xóa - chỉ hiển thị khi có quyền xóa và hộp thoại đang mở */}
      {hasPermission(PERMISSIONS.COUPON_DELETE) && deleteDialogOpen && (
        <CouponsDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} currentRow={coupon} />
      )}
    </>
  )
}

export default DataTableRowActions
