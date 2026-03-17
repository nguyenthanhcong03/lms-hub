'use client'

import { DataTableColumnHeader } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IBlog, BlogStatus, IBlogAuthor, IBlogCategory } from '@/types/blog'
import { ColumnDef } from '@tanstack/react-table'
import { FileText, User, Calendar, Tags } from 'lucide-react'
import DataTableRowActions from './data-table-row-actions'
import { getStatusConfig } from '@/utils/common'
import Image from 'next/image'
import { formatDate } from '@/utils/format'

export const columns: ColumnDef<IBlog>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Bài viết' />,
    cell: ({ row }) => {
      const blog = row.original
      return (
        <div className='flex items-center space-x-3'>
          <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
            {blog.thumbnail ? (
              <div className='relative h-10 w-10 rounded-lg object-cover'>
                <Image src={blog.thumbnail} alt={blog.title} fill />
              </div>
            ) : (
              <FileText className='text-primary h-5 w-5' />
            )}
          </div>
          <div className='min-w-0 flex-1'>
            <div className='text-foreground max-w-[200px] truncate font-medium'>{blog.title}</div>
            <div className='text-muted-foreground max-w-[200px] truncate text-sm'>/{blog.slug}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'excerpt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trích đoạn' />,
    cell: ({ row }) => {
      const excerpt = row.getValue('excerpt') as string
      return <div className='text-muted-foreground max-w-[300px] truncate text-sm'>{excerpt}</div>
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as BlogStatus
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
    accessorKey: 'author',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tác giả' />,
    cell: ({ row }) => {
      const author = row.getValue('author') as IBlogAuthor
      return (
        <div className='text-muted-foreground flex items-center space-x-2 text-sm'>
          <User className='h-4 w-4' />
          <span>{author?.name || author?.email || 'Unknown'}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Danh mục' />,
    cell: ({ row }) => {
      const category = row.getValue('category') as IBlogCategory
      return (
        <div className='flex items-center space-x-2'>
          <Tags className='text-muted-foreground h-4 w-4' />
          <Badge variant='outline' className='font-normal'>
            {category?.name || 'Uncategorized'}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: 'publishedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Đã xuất bản' />,
    cell: ({ row }) => {
      const publishedAt = row.getValue('publishedAt') as string | null
      const status = row.getValue('status') as BlogStatus

      if (status === BlogStatus.DRAFT || !publishedAt) {
        return <div className='text-muted-foreground text-sm'>Chưa xuất bản</div>
      }

      const date = new Date(publishedAt)
      return (
        <div className='text-muted-foreground flex items-center space-x-2 text-sm'>
          <Calendar className='h-4 w-4' />
          <span>{date.toLocaleDateString()}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      return <div className='text-muted-foreground text-sm'>{formatDate(row.getValue('createdAt'))}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
