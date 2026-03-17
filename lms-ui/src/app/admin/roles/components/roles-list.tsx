'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  MdAdminPanelSettings,
  MdDelete,
  MdEdit,
  MdMoreVert,
  MdPeople,
  MdPersonOutline,
  MdSecurity,
  MdShield
} from 'react-icons/md'

import { PERMISSIONS } from '@/configs/permission'
import { useAuthStore } from '@/stores/auth-store'
import { IRole } from '@/types/role'

// Ánh xạ biểu tượng vai trò - đồng bộ với vai trò thực tế trong hệ thống
const roleIcons = {
  admin: MdSecurity,
  'Super Admin': MdAdminPanelSettings,
  super_admin: MdAdminPanelSettings, // dự phòng cho phiên bản dùng dấu gạch dưới
  student: MdPeople,
  guest: MdPersonOutline
} as const

// Ánh xạ màu vai trò - đồng bộ với vai trò thực tế trong hệ thống
const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  'Super Admin': 'bg-purple-100 text-purple-800 border-purple-200',
  super_admin: 'bg-purple-100 text-purple-800 border-purple-200', // dự phòng cho phiên bản dùng dấu gạch dưới
  student: 'bg-green-100 text-green-800 border-green-200',
  guest: 'bg-gray-100 text-gray-800 border-gray-200'
} as const

// Hàm hỗ trợ lấy biểu tượng vai trò với logic dự phòng
function getRoleIcon(roleName: string) {
  // Ưu tiên khớp chính xác trước
  if (roleIcons[roleName as keyof typeof roleIcons]) {
    return roleIcons[roleName as keyof typeof roleIcons]
  }

  // Dự phòng mặc định
  return MdShield
}

// Hàm hỗ trợ lấy màu vai trò với logic dự phòng
function getRoleColor(roleName: string) {
  // Ưu tiên khớp chính xác trước
  if (roleColors[roleName as keyof typeof roleColors]) {
    return roleColors[roleName as keyof typeof roleColors]
  }

  // Dự phòng mặc định
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

interface RolesListProps {
  roles?: IRole[]
  onEditRole?: (role: IRole) => void
}

interface RoleListItemProps {
  role: IRole
  onEditRole?: (role: IRole) => void
}

function RoleListItem({ role, onEditRole }: RoleListItemProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const UPDATE = hasPermission(PERMISSIONS.ROLE_UPDATE)
  const DELETE = hasPermission(PERMISSIONS.ROLE_DELETE)

  const IconComponent = getRoleIcon(role.name)
  const colorClass = getRoleColor(role.name)

  const handleEditRole = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditRole?.(role)
  }

  const hasActions = UPDATE || DELETE

  return (
    <div className='group hover:bg-muted/50 border-border/40 border-b transition-colors duration-200 last:border-b-0'>
      <div className='grid grid-cols-12 items-center gap-4 p-4'>
        {/* Thông tin vai trò - 4 cột */}
        <div className='col-span-12 flex items-center gap-3 md:col-span-4'>
          <div className={`rounded-lg p-2 ${colorClass} shrink-0`}>
            <IconComponent className='h-4 w-4' />
          </div>
          <div className='min-w-0'>
            <h3 className='text-base leading-tight font-semibold capitalize'>{role.name.replace('_', ' ')}</h3>
            <p className='text-muted-foreground max-w-50 truncate text-sm'>{role.description}</p>
          </div>
        </div>

        {/* Quyền hạn - 2 cột */}
        <div className='col-span-6 flex items-center gap-2 md:col-span-2'>
          <span className='text-muted-foreground hidden text-sm md:block'>Quyền hạn:</span>
          <Badge variant='secondary' className='font-semibold'>
            {role.permissions.length}
          </Badge>
        </div>

        {/* Tóm tắt vai trò - 3 cột */}
        <div className='col-span-6 md:col-span-3'>
          <span className='text-muted-foreground text-sm'>Bộ quyền trực tiếp</span>
        </div>

        {/* Thông tin bổ sung - 2 cột */}
        <div className='col-span-6 space-y-1 md:col-span-2'>
          <div className='text-muted-foreground flex items-center gap-1 text-sm'>
            <MdPeople className='h-3.5 w-3.5' />
            <span>{role?.totalUsers || 0} người dùng</span>
          </div>
          <div className='text-muted-foreground text-xs'>{new Date(role.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Thao tác - 1 cột */}
        <div className='col-span-6 flex justify-end md:col-span-1'>
          {hasActions && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
                >
                  <MdMoreVert className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                {UPDATE && (
                  <DropdownMenuItem onClick={handleEditRole} className='gap-2'>
                    <MdEdit className='h-4 w-4' />
                    Chỉnh sửa vai trò
                  </DropdownMenuItem>
                )}
                {DELETE && (
                  <DropdownMenuItem className='text-destructive gap-2' onClick={(e) => e.stopPropagation()}>
                    <MdDelete className='h-4 w-4' />
                    Xóa vai trò
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

const RolesList = ({ roles = [], onEditRole }: RolesListProps) => {
  return (
    <div className='border-border overflow-hidden rounded-lg border'>
      {/* Tiêu đề bảng */}
      <div className='bg-muted/50 border-border border-b'>
        <div className='text-muted-foreground grid grid-cols-12 gap-4 p-4 text-sm font-medium'>
          <div className='col-span-12 md:col-span-4'>Vai trò</div>
          <div className='col-span-6 hidden md:col-span-2 md:block'>Quyền hạn</div>
          <div className='col-span-6 hidden md:col-span-3 md:block'>Chi tiết</div>
          <div className='col-span-6 hidden md:col-span-2 md:block'>Người dùng và ngày tạo</div>
          <div className='col-span-6 hidden md:col-span-1 md:block'>Thao tác</div>
        </div>
      </div>

      {/* Nội dung bảng */}
      <div>
        {roles.map((role) => (
          <RoleListItem key={role._id} role={role} onEditRole={onEditRole} />
        ))}
      </div>
    </div>
  )
}

export default RolesList
