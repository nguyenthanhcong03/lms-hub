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
import { IBlog } from '@/types/blog'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'
import BlogsActionDialog from './blogs-action-dialog'
import BlogsDeleteDialog from './blogs-delete-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { PERMISSIONS } from '@/configs/permission'

interface DataTableRowActionsProps {
  row: Row<IBlog>
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const hasPermission = useAuthStore((state) => state.hasPermission)

  const blog = row.original

  const handleEditClick = () => {
    setEditDialogOpen(true)
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
          {hasPermission(PERMISSIONS.BLOG_UPDATE) && (
            <DropdownMenuItem onClick={handleEditClick}>
              Chỉnh sửa
              <DropdownMenuShortcut>
                <IconEdit size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {(hasPermission(PERMISSIONS.BLOG_READ) ||
            hasPermission(PERMISSIONS.BLOG_UPDATE) ||
            hasPermission(PERMISSIONS.BLOG_DELETE)) && <DropdownMenuSeparator />}
          {hasPermission(PERMISSIONS.BLOG_DELETE) && (
            <DropdownMenuItem onClick={handleDeleteClick} className='text-red-500!'>
              Xóa
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog - Only render when UPDATE permission and dialog is open */}
      {hasPermission(PERMISSIONS.BLOG_UPDATE) && editDialogOpen && (
        <BlogsActionDialog mode='edit' blog={blog} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      )}

      {/* Delete Dialog - Only render when DELETE permission and dialog is open */}
      {hasPermission(PERMISSIONS.BLOG_DELETE) && deleteDialogOpen && (
        <BlogsDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} currentRow={blog} />
      )}
    </>
  )
}

export default DataTableRowActions
