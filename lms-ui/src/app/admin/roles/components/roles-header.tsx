'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { MdSearch, MdSort, MdViewList, MdViewModule } from 'react-icons/md'

interface RolesHeaderProps {
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  onViewChange: (view: 'grid' | 'list') => void
  currentView: 'grid' | 'list'
}

const RolesHeader = ({ onSearchChange, onSortChange, onViewChange, currentView }: RolesHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  return (
    <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      {/* Tìm kiếm */}
      <div className='relative max-w-sm flex-1'>
        <MdSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
        <Input
          placeholder='Tìm kiếm vai trò...'
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='pl-9'
        />
      </div>

      {/* Thao tác */}
      <div className='flex items-center gap-2'>
        {/* Sắp xếp */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='gap-2'>
              <MdSort className='h-4 w-4' />
              Sắp xếp
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onSortChange('name')}>Tên (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name-desc')}>Tên (Z-A)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('permissionsCount')}>Quyền (Thấp đến Cao)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('permissionsCount-desc')}>
              Quyền (Cao đến Thấp)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('createdAt')}>Ngày tạo (Cũ nhất)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('createdAt-desc')}>Ngày tạo (Mới nhất)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chuyển chế độ hiển thị */}
        <div className='flex rounded-xs border p-1'>
          <Button
            variant={currentView === 'grid' ? 'default' : 'ghost'}
            size='icon'
            className='h-6 w-6'
            onClick={() => onViewChange('grid')}
          >
            <MdViewModule className='h-4 w-4' />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size='icon'
            className='h-6 w-6'
            onClick={() => onViewChange('list')}
          >
            <MdViewList className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RolesHeader
