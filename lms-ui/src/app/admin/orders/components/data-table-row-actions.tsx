'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IOrder } from '@/types/order'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'
import OrderViewDialog from './order-view-dialog'
import OrdersDeleteDialog from './orders-delete-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { PERMISSIONS } from '@/configs/permission'

interface DataTableRowActionsProps {
  row: Row<IOrder>
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const order = row.original

  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Permissions
  const hasPermission = useAuthStore((state) => state.hasPermission)

  // Handle actions
  const handleView = () => {
    setViewDialogOpen(true)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
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
          {/* View order */}
          <DropdownMenuItem onClick={handleView}>
            <Eye className='mr-2 h-4 w-4' />
            Xem chi tiết
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete order */}
          {hasPermission(PERMISSIONS.ORDER_DELETE) && (
            <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
              <Trash2 className='mr-2 h-4 w-4' />
              Xóa
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      {viewDialogOpen && <OrderViewDialog order={order} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />}

      {/* Delete Dialog */}
      {deleteDialogOpen && (
        <OrdersDeleteDialog currentRow={order} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      )}
    </>
  )
}

export default DataTableRowActions
