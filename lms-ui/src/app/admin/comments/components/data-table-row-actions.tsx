'use client'

import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IComment } from '@/types/comment'
import CommentStatusDialog from './comment-status-dialog'
import CommentsDeleteDialog from './comments-delete-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { PERMISSIONS } from '@/configs/permission'

interface DataTableRowActionsProps {
  row: Row<IComment>
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const hasPermission = useAuthStore((state) => state.hasPermission)
  const comment = row.original

  const handleStatusClick = () => {
    setStatusDialogOpen(true)
  }

  const handleDeleteClick = () => {
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
          {hasPermission(PERMISSIONS.COMMENT_UPDATE) && (
            <DropdownMenuItem onClick={handleStatusClick}>
              Chỉnh sửa
              <DropdownMenuShortcut>
                <IconEdit size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {(hasPermission(PERMISSIONS.COMMENT_UPDATE) || hasPermission(PERMISSIONS.COMMENT_DELETE)) && (
            <DropdownMenuSeparator />
          )}
          {hasPermission(PERMISSIONS.COMMENT_DELETE) && (
            <DropdownMenuItem onClick={handleDeleteClick} className='text-red-500!'>
              Xóa
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Dialog - Only render when UPDATE permission and dialog is open */}
      {hasPermission(PERMISSIONS.COMMENT_UPDATE) && statusDialogOpen && (
        <CommentStatusDialog comment={comment} open={statusDialogOpen} onOpenChange={setStatusDialogOpen} />
      )}

      {/* Delete Dialog - Only render when DELETE permission and dialog is open */}
      {hasPermission(PERMISSIONS.COMMENT_DELETE) && deleteDialogOpen && (
        <CommentsDeleteDialog currentRow={comment} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      )}
    </>
  )
}

export default DataTableRowActions
