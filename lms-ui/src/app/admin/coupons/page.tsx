'use client'

import AdminHeading from '@/components/admin/admin-heading'
import DataTableSkeleton from '@/components/table/data-table-skeleton'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/configs/permission'
import { useAuthStore } from '@/stores/auth-store'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdAdd } from 'react-icons/md'

const CouponsTable = dynamic(() => import('./components/coupons-table'), {
  loading: () => <DataTableSkeleton />,
  ssr: false
})

const CouponsActionDialog = dynamic(() => import('./components/coupons-action-dialog'), {
  ssr: false
})

const CouponsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const hasPermission = useAuthStore((state) => state.hasPermission)

  const handleCreateClick = () => {
    setCreateDialogOpen(true)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <AdminHeading title='Coupons' description='Manage discount coupons and promotional codes' />
        {hasPermission(PERMISSIONS.COUPON_CREATE) && (
          <Button onClick={handleCreateClick}>
            <MdAdd className='mr-2 h-4 w-4' />
            Add Coupon
          </Button>
        )}
      </div>

      <CouponsTable />

      {hasPermission(PERMISSIONS.COUPON_CREATE) && createDialogOpen && (
        <CouponsActionDialog mode='create' open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      )}
    </div>
  )
}

export default CouponsPage
