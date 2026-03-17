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

const BlogsTable = dynamic(() => import('./components/blogs-table'), {
  loading: () => <DataTableSkeleton />,
  ssr: false
})

const BlogsActionDialog = dynamic(() => import('./components/blogs-action-dialog'), {
  ssr: false
})

const BlogsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const hasPermission = useAuthStore((state) => state.hasPermission)

  const handleCreateClick = () => {
    setCreateDialogOpen(true)
  }

  return (
    <PermissionGuard
      permissions={[PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_CREATE, PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_DELETE]}
    >
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <AdminHeading title='Bài viết' description='Quản lý bài viết và nội dung' />
          {hasPermission(PERMISSIONS.BLOG_CREATE) && (
            <Button onClick={handleCreateClick}>
              <MdAdd className='mr-2 h-4 w-4' />
              Thêm bài viết
            </Button>
          )}
        </div>

        {hasPermission(PERMISSIONS.BLOG_READ) ? (
          <BlogsTable />
        ) : (
          <div className='text-muted-foreground text-center'>Bạn không có quyền xem bài viết.</div>
        )}

        {hasPermission(PERMISSIONS.BLOG_CREATE) && createDialogOpen && (
          <BlogsActionDialog mode='create' open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        )}
      </div>
    </PermissionGuard>
  )
}

export default BlogsPage
