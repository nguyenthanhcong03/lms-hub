'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { IOrder } from '@/types/order'
import { formatPrice, formatDate } from '@/utils/format'
import DataTableRowActions from './data-table-row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Package, CreditCard } from 'lucide-react'
import { getStatusConfig } from '@/utils/common'

// Kiểu dữ liệu meta cho bảng
interface OrderTableMeta {
  onStatusClick: (order: IOrder) => void
}

// Nhãn phương thức thanh toán
const PAYMENT_METHOD_LABELS = {
  bank_transfer: 'Chuyển khoản'
} as const

export const columns: ColumnDef<IOrder>[] = [
  // Cột chọn
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Chọn tất cả'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Chọn hàng'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  // Mã đơn hàng
  {
    accessorKey: 'code',
    meta: { title: 'Mã đơn hàng' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã đơn hàng' />,
    cell: ({ row }) => {
      return (
        <div className='flex items-center space-x-2'>
          <Package className='text-muted-foreground h-4 w-4' />
          <span className='font-mono text-sm font-medium'>#{row.original.code}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false
  },

  // Thông tin khách hàng
  {
    accessorKey: 'user',
    meta: { title: 'Khách hàng' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Khách hàng' />,
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className='flex items-center space-x-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>
              <User className='h-4 w-4' />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='text-sm font-medium'>{user.username}</span>
            <span className='text-muted-foreground text-xs'>{user.email}</span>
          </div>
        </div>
      )
    },
    enableSorting: false
  },

  // Trạng thái đơn hàng
  {
    accessorKey: 'status',
    meta: { title: 'Trạng thái' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row, table }) => {
      const status = row.original.status
      const config = getStatusConfig(status)

      // Lấy hàm onStatusClick từ meta của bảng
      const onStatusClick = (table.options.meta as OrderTableMeta)?.onStatusClick

      return (
        <Badge
          className={`rounded-full border capitalize ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.ringColor} cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none`}
          onClick={() => onStatusClick?.(row.original)}
        >
          <span className={`size-1.5 rounded-full ${config.dotColor}`} aria-hidden='true' />
          {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.status)
    },
    enableSorting: true
  },

  // Phương thức thanh toán
  {
    accessorKey: 'paymentMethod',
    meta: { title: 'Phương thức thanh toán' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phương thức thanh toán' />,
    cell: ({ row }) => {
      const method = row.original.paymentMethod
      const label = PAYMENT_METHOD_LABELS[method] || method

      return (
        <div className='flex items-center space-x-2'>
          <CreditCard className='text-muted-foreground h-4 w-4' />
          <span className='text-sm'>{label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.paymentMethod)
    },
    enableSorting: true
  },

  // Tổng tiền
  {
    accessorKey: 'totalAmount',
    meta: { title: 'Tổng số tiền' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng tiền' />,
    cell: ({ row }) => {
      const amount = row.original.totalAmount
      return <span className='font-semibold text-green-600'>{formatPrice(amount)}</span>
    },
    enableSorting: true
  },

  // Số lượng mặt hàng
  {
    accessorKey: 'items',
    meta: { title: 'Số lượng' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng' />,
    cell: ({ row }) => {
      const items = row.original.items
      return <span className='text-muted-foreground text-sm'>{items.length} mặt hàng</span>
    },
    enableSorting: false
  },

  // Ngày tạo
  {
    accessorKey: 'createdAt',
    meta: { title: 'Ngày tạo' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đặt' />,
    cell: ({ row }) => {
      const date = row.original.createdAt
      return <div className='text-muted-foreground text-sm'>{formatDate(date, 'dd/MM/yyyy HH:mm')}</div>
    },
    enableSorting: true
  },

  // Thao tác
  {
    id: 'actions',
    meta: { title: 'Hành động' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Hành động' />,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false
  }
]
