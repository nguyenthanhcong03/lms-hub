'use client'

import { Button } from '@/components/ui/button'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { MdAdd } from 'react-icons/md'

import { useRoles } from '@/hooks/use-roles'
import { IRole } from '@/types/role'

// Import động cho các thành phần nặng
const RoleActionDialog = dynamic(() => import('./components/role-action-dialog'), {
  ssr: false
})

const RolesGrid = dynamic(() => import('./components/roles-grid'), {
  loading: () => <RolesSkeleton view='grid' />,
  ssr: false
})

const RolesList = dynamic(() => import('./components/roles-list'), {
  loading: () => <RolesSkeleton view='list' />,
  ssr: false
})

const RolesHeader = dynamic(() => import('./components/roles-header'), {
  loading: () => (
    <div className='flex items-center justify-between gap-4 rounded-lg border p-4'>
      <div className='flex items-center gap-4'>
        <div className='bg-muted h-10 w-64 animate-pulse rounded' />
        <div className='bg-muted h-10 w-32 animate-pulse rounded' />
      </div>
      <div className='flex items-center gap-2'>
        <div className='bg-muted h-10 w-20 animate-pulse rounded' />
        <div className='bg-muted h-10 w-20 animate-pulse rounded' />
      </div>
    </div>
  ),
  ssr: false
})

// Import skeleton tĩnh vì nhẹ và cần cho trạng thái tải
import RolesSkeleton from './components/role-skeletons'
import { PERMISSIONS } from '@/configs/permission'
import { useAuthStore } from '@/stores/auth-store'

const RolesPage = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'permissionsCount' | 'createdAt'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingRole, setEditingRole] = useState<IRole | null>(null)

  const hasPermission = useAuthStore((state) => state.hasPermission)
  const CREATE = hasPermission(PERMISSIONS.ROLE_CREATE)

  // Hook gọi API
  const { data: rolesData, isLoading } = useRoles()

  // Sắp xếp và lọc phía client làm phương án dự phòng
  const roles = useMemo(() => {
    if (!rolesData) return []

    let filteredRoles = [...rolesData]

    // Áp dụng bộ lọc tìm kiếm
    if (searchQuery) {
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Áp dụng sắp xếp
    filteredRoles.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'permissionsCount':
          // Vì IRole không có userCount, dùng số lượng quyền làm dự phòng
          aValue = a.permissions?.length || 0
          bValue = b.permissions?.length || 0
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filteredRoles
  }, [rolesData, searchQuery, sortBy, sortOrder])

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
  }

  const handleSortChange = (sort: string) => {
    // Phân tích chuỗi sắp xếp để lấy trường và thứ tự
    const [field, order] = sort.includes('-desc')
      ? [sort.replace('-desc', ''), 'desc' as const]
      : [sort, 'asc' as const]

    if (field === 'name' || field === 'permissionsCount' || field === 'createdAt') {
      setSortBy(field)
      setSortOrder(order)
    }
  }

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view)
  }

  const handleEditRole = (role: IRole) => {
    setEditingRole(role)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleCreateRole = () => {
    setEditingRole(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingRole(null)
  }

  // Giao diện mặc định của trang vai trò
  return (
    <div className='space-y-6'>
      {/* Tiêu đề trang */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Vai trò</h2>
          <p className='text-muted-foreground'>Quản lý vai trò và quyền người dùng trên toàn hệ thống</p>
        </div>
        <div className='flex items-center gap-2'>
          {CREATE && (
            <Button className='gap-2' onClick={handleCreateRole}>
              <MdAdd className='h-4 w-4' />
              Thêm vai trò
            </Button>
          )}
        </div>
      </div>

      {/* Bộ điều khiển */}
      <RolesHeader
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      {/* Nội dung */}
      {isLoading ? (
        <RolesSkeleton view={currentView} />
      ) : currentView === 'grid' ? (
        <RolesGrid roles={roles} onEditRole={handleEditRole} />
      ) : (
        <RolesList roles={roles} onEditRole={handleEditRole} />
      )}

      {/* Hộp thoại thao tác vai trò - xử lý cả tạo mới và chỉnh sửa */}
      {dialogOpen && (
        <RoleActionDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDialogClose()
          }}
          mode={dialogMode}
          role={editingRole}
        />
      )}
    </div>
  )
}

export default RolesPage
