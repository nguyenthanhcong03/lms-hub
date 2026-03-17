'use client'

import AdminHeading from '@/components/admin/admin-heading'
import { PermissionGuard } from '@/components/guards/guard'
import DataTableSkeleton from '@/components/table/data-table-skeleton'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/configs/permission'
import { useAuthStore } from '@/stores/auth-store'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdAdd } from 'react-icons/md'

const CategoriesTable = dynamic(() => import('./components/categories-table'), {
  loading: () => <DataTableSkeleton />,
  ssr: false
})

const CategoriesActionDialog = dynamic(() => import('./components/categories-action-dialog'), {
  ssr: false
})

const CategoriesPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const hasPermission = useAuthStore((state) => state.hasPermission)

  const handleCreateClick = () => {
    setCreateDialogOpen(true)
  }

  return (
    <PermissionGuard
      permissions={[
        PERMISSIONS.CATEGORY_READ,
        PERMISSIONS.CATEGORY_CREATE,
        PERMISSIONS.CATEGORY_UPDATE,
        PERMISSIONS.CATEGORY_DELETE
      ]}
    >
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <AdminHeading title='Danh mục' description='Quản lý danh mục khóa học' />
          {hasPermission(PERMISSIONS.CATEGORY_CREATE) && (
            <Button onClick={handleCreateClick}>
              <MdAdd className='mr-2 h-4 w-4' />
              Thêm danh mục
            </Button>
          )}
        </div>

        {hasPermission(PERMISSIONS.CATEGORY_READ) ? (
          <CategoriesTable />
        ) : (
          <div className='text-muted-foreground p-4 text-center text-sm'>
            Bạn không có quyền xem danh mục khóa học. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.
          </div>
        )}

        {hasPermission(PERMISSIONS.CATEGORY_CREATE) && createDialogOpen && (
          <CategoriesActionDialog mode='create' open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        )}
      </div>
    </PermissionGuard>
  )
}

export default CategoriesPage
