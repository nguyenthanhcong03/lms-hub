'use client'

import AdminHeading from '@/components/admin/admin-heading'
import DataTableSkeleton from '@/components/table/data-table-skeleton'
import dynamic from 'next/dynamic'

const CommentsTable = dynamic(() => import('./components/comments-table'), {
  loading: () => <DataTableSkeleton />,
  ssr: false
})

const CommentsPage = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <AdminHeading title='Bình luận' description='Quản lý bình luận và kiểm duyệt của người dùng' />
      </div>

      <CommentsTable />
    </div>
  )
}

export default CommentsPage
