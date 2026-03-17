'use client'

import { DataTableColumnHeader } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Coupon, DiscountType } from '@/types/coupon'
import { ColumnDef } from '@tanstack/react-table'
import { Tag, Percent, DollarSign, Calendar, Users } from 'lucide-react'
import DataTableRowActions from './data-table-row-actions'
import dayjs from 'dayjs'
import { getStatusConfig } from '@/utils/common'
import { formatPrice } from '@/utils/format'

// Hàm hỗ trợ lấy trạng thái mã giảm giá
function getCouponStatus(coupon: Coupon): 'active' | 'expired' | 'inactive' {
  if (!coupon.isActive) return 'inactive'

  const now = new Date()
  const endDate = coupon.endDate ? new Date(coupon.endDate) : null

  if (endDate && endDate < now) return 'expired'
  return 'active'
}

// Hàm hỗ trợ kiểm tra mã giảm giá có giới hạn lượt dùng hay không
function hasUsageLimit(coupon: Coupon): boolean {
  return coupon.maxUses !== undefined && coupon.maxUses > 0
}

// Cấu hình trạng thái cho badge, đồng bộ với hệ thống đơn hàng

export const columns: ColumnDef<Coupon>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã giảm giá' />,
    cell: ({ row }) => {
      const coupon = row.original
      return (
        <div className='flex items-center space-x-3'>
          <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
            <Tag className='text-primary h-5 w-5' />
          </div>
          <div className='min-w-0 flex-1'>
            <div className='text-foreground font-medium'>{coupon.title}</div>
            <div className='text-muted-foreground font-mono text-sm'>{coupon.code}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'discountType',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giảm giá' />,
    cell: ({ row }) => {
      const coupon = row.original
      const isPercentage = coupon.discountType === DiscountType.PERCENT
      return (
        <div className='flex items-center space-x-2'>
          {isPercentage ? (
            <Percent className='h-4 w-4 text-blue-600' />
          ) : (
            <DollarSign className='h-4 w-4 text-green-600' />
          )}
          <div>
            <div className='font-medium'>
              {isPercentage ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()} đ`}
            </div>
            <div className='text-muted-foreground text-xs'>{isPercentage ? 'Phần trăm' : 'Số tiền cố định'}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const coupon = row.original
      const status = getCouponStatus(coupon)
      const config = getStatusConfig(status)

      return (
        <Badge
          className={`rounded-full border capitalize ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.ringColor} focus-visible:outline-none`}
        >
          <span className={`size-1.5 rounded-full ${config.dotColor}`} aria-hidden='true' />
          {config.label}
        </Badge>
      )
    },

    enableSorting: true
  },
  {
    accessorKey: 'usage',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sử dụng' />,
    cell: ({ row }) => {
      const coupon = row.original
      const hasLimit = hasUsageLimit(coupon)

      return (
        <div className='flex items-center space-x-2'>
          <Users className='text-muted-foreground h-4 w-4' />
          <div className='text-sm'>
            <div className='font-medium'>
              {coupon.usedCount}
              {hasLimit && ` / ${coupon.maxUses}`}
            </div>
            <div className='text-muted-foreground text-xs'>{hasLimit ? 'Có giới hạn' : 'Không giới hạn'}</div>
          </div>
        </div>
      )
    },
    enableSorting: false
  },
  {
    accessorKey: 'courseIds',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Khóa học áp dụng' />,
    cell: ({ row }) => {
      const coupon = row.original
      const courseCount = coupon.courseIds?.length || 0

      return (
        <div className='text-sm'>
          {courseCount === 0 ? (
            <Badge variant='outline'>Tất cả khóa học</Badge>
          ) : (
            <Badge variant='secondary'>{courseCount} khóa học</Badge>
          )}
        </div>
      )
    },
    enableSorting: false
  },
  {
    accessorKey: 'minPurchaseAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mua tối thiểu' />,
    cell: ({ row }) => {
      const coupon = row.original
      return <div className='font-mono text-sm'>{formatPrice(coupon.minPurchaseAmount || 0)}</div>
    }
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Hết hạn' />,
    cell: ({ row }) => {
      const coupon = row.original

      if (!coupon.endDate) {
        return (
          <div className='flex items-center space-x-2'>
            <Calendar className='text-muted-foreground h-4 w-4' />
            <span className='text-muted-foreground text-sm'>Không bao giờ</span>
          </div>
        )
      }

      const endDate = new Date(coupon.endDate)
      const isExpired = endDate < new Date()

      return (
        <div className='flex items-center space-x-2'>
          <Calendar className='text-muted-foreground h-4 w-4' />
          <div className='text-sm'>
            <div className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
              {dayjs(endDate).format('MMM DD, YYYY')}
            </div>
            <div className='text-muted-foreground text-xs'>{dayjs(endDate).format('h:mm A')}</div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
