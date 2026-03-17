'use client'

import { DataTableColumnHeader } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ICategory } from '@/types/category'
import { CategoryStatus } from '@/types/category'
import { ColumnDef } from '@tanstack/react-table'
import { Hash } from 'lucide-react'
import DataTableRowActions from './data-table-row-actions'
import { getStatusConfig } from '@/utils/common'
import dayjs from 'dayjs'
import { formatDate } from '@/utils/format'

export const columns: ColumnDef<ICategory>[] = [
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
  {
    accessorKey: 'name',
    meta: { title: 'Danh mục' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Danh mục' />,
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className='flex items-center space-x-3'>
          <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
            <Hash className='text-primary h-5 w-5' />
          </div>
          <div className='min-w-0 flex-1'>
            <div className='text-foreground font-medium'>{category.name}</div>
            <div className='text-muted-foreground text-sm'>/{category.slug}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'slug',
    meta: { title: 'Slug' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Slug' />,
    cell: ({ row }) => {
      return <div className='text-muted-foreground font-mono text-sm'>{row.getValue('slug')}</div>
    }
  },
  {
    accessorKey: 'status',
    meta: { title: 'Trạng thái' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as CategoryStatus
      const config = getStatusConfig(status)

      return (
        <Badge
          className={`rounded-full border capitalize ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.ringColor} focus-visible:outline-none`}
        >
          <span className={`size-1.5 rounded-full ${config.dotColor}`} aria-hidden='true' />
          {config.label}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    meta: { title: 'Ngày tạo' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => <div className='text-sm'>{formatDate(row.getValue('createdAt'), 'DD/MM/YYYY')}</div>
  },
  {
    id: 'actions',
    meta: { title: 'Hành động' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Hành động' />,
    cell: DataTableRowActions
  }
]
