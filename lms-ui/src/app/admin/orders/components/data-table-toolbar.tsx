'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/table/data-table-faceted-filter'
import { IOrder } from '@/types/order'
import { Search, Trash2, Clock, CheckCircle, XCircle, CreditCard, Building2 } from 'lucide-react'

interface FilterState {
  search: string
  status: string[]
  paymentMethod: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface DataTableToolbarProps {
  table: Table<IOrder>
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  selectedRowCount: number
  onBulkDelete: () => void
}

// Tùy chọn lọc theo trạng thái
const statusOptions = [
  {
    label: 'Chờ thanh toán',
    value: 'pending',
    icon: Clock
  },
  {
    label: 'Hoàn thành',
    value: 'completed',
    icon: CheckCircle
  },
  {
    label: 'Đã hủy',
    value: 'cancelled',
    icon: XCircle
  }
] as const

// Tùy chọn lọc theo phương thức thanh toán
const paymentMethodOptions = [
  {
    label: 'Chuyển khoản',
    value: 'bank_transfer',
    icon: Building2
  }
] as const

const DataTableToolbar = ({
  table,
  filters,
  onFiltersChange,
  selectedRowCount,
  onBulkDelete
}: DataTableToolbarProps) => {
  const isFiltered = filters.search || filters.status.length > 0 || filters.paymentMethod.length > 0

  // Xử lý ô tìm kiếm
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value })
  }

  // Xử lý thay đổi bộ lọc trạng thái
  const handleStatusChange = (values: string[]) => {
    onFiltersChange({ status: values })
  }

  // Xử lý thay đổi bộ lọc phương thức thanh toán
  const handlePaymentMethodChange = (values: string[]) => {
    onFiltersChange({ paymentMethod: values })
  }

  // Đặt lại toàn bộ bộ lọc
  const resetFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      paymentMethod: []
    })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* Ô tìm kiếm */}
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Tìm kiếm đơn hàng...'
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-[150px] pl-9 lg:w-[250px]'
          />
        </div>

        {/* Bộ lọc trạng thái */}
        <DataTableFacetedFilter
          title='Trạng thái'
          options={statusOptions}
          selectedValues={filters.status}
          onSelectionChange={handleStatusChange}
        />

        {/* Bộ lọc phương thức thanh toán */}
        <DataTableFacetedFilter
          title='Phương thức thanh toán'
          options={paymentMethodOptions}
          selectedValues={filters.paymentMethod}
          onSelectionChange={handlePaymentMethodChange}
        />

        {/* Nút xóa bộ lọc */}
        {isFiltered && (
          <Button variant='ghost' onClick={resetFilters} className='h-8 px-2 lg:px-3'>
            Xóa bộ lọc
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        {/* Nút xóa hàng loạt */}
        {selectedRowCount > 0 && (
          <Button variant='destructive' size='sm' onClick={onBulkDelete} className='h-8'>
            <Trash2 className='mr-2 h-4 w-4' />
            Xóa ({selectedRowCount}) đơn hàng
          </Button>
        )}

        {/* Bật/tắt hiển thị cột */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

export default DataTableToolbar
