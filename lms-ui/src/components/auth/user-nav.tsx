'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ADMIN_PANEL_PERMISSIONS } from '@/configs/permission'
import { ROUTE_CONFIG } from '@/configs/routes'
import { DEFAULT_AVATAR } from '@/constants'
import { useAuthStore } from '@/stores/auth-store'
import { LogOut, Settings, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoPackage } from 'react-icons/go'
export function UserNav() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => !!state.user)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)

  const { logout } = useAuthStore()
  const router = useRouter()

  if (!isAuthenticated || !user) {
    return null
  }
  const handleLogout = async () => {
    await logout()
    router.push(ROUTE_CONFIG.HOME)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='relative h-10 w-10 cursor-pointer'>
          <Avatar className='h-full w-full shadow-lg ring-2 ring-white/50 transition-all duration-200'>
            <AvatarImage src={user.avatar || DEFAULT_AVATAR} alt={user.username || 'User'} />
            <AvatarFallback className='from-primary to-primary/80 bg-gradient-to-br text-sm font-bold text-white'>
              {user.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          {/* Chỉ báo trực tuyến */}
          <div className='absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm'></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {/* Tiêu đề hồ sơ người dùng */}
        <div className='px-4 pt-4'>
          <div className='flex items-center space-x-3'>
            <div className='relative h-12 w-12'>
              <Avatar className='h-full w-full shadow-lg ring-4 ring-white/50'>
                <AvatarImage src={user.avatar || DEFAULT_AVATAR} alt={user.username || 'User'} />
                <AvatarFallback className='from-primary to-primary/80 bg-gradient-to-br text-lg font-bold text-white'>
                  {user.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              {/* Chỉ báo trực tuyến */}
              <div className='absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm'></div>
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900'>{user.username}</h3>
              <p className='text-sm text-gray-600'>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Các mục menu */}
        <div className='p-2'>
          {hasAnyPermission([...ADMIN_PANEL_PERMISSIONS]) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTE_CONFIG.ADMIN.DASHBOARD}
                  className='flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2'
                >
                  <ShieldCheck className='h-4 w-4 text-gray-600' />
                  <span>Trang quản trị</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={ROUTE_CONFIG.PROFILE.MY_PROFILE}
              className='flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2'
            >
              <User className='h-4 w-4 text-gray-600' />
              <span>Hồ sơ của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTE_CONFIG.PROFILE.MY_ORDERS}
              className='flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2'
            >
              <GoPackage className='h-4 w-4 text-gray-600' />
              <span>Đơn hàng của tôi</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={ROUTE_CONFIG.PROFILE.SETTINGS}
              className='flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2'
            >
              <Settings className='h-4 w-4 text-gray-600' />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className='flex cursor-pointer items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50'
          >
            <LogOut className='h-4 w-4' />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
