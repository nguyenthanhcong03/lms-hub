'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdCategory,
  MdSecurity,
  MdSettings,
  MdLogout,
  MdLocalOffer,
  MdShoppingCart,
  MdArticle,
  MdComment
} from 'react-icons/md'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { ROUTE_CONFIG } from '@/configs/routes'
import { ADMIN_PANEL_PERMISSIONS, PERMISSIONS } from '@/configs/permission'

const menuItems = [
  {
    title: 'Bảng điều khiển',
    url: '/admin/dashboard',
    icon: MdDashboard,
    permissions: [...ADMIN_PANEL_PERMISSIONS]
  },
  {
    title: 'Khóa học',
    url: '/admin/courses',
    icon: MdSchool,
    permissions: [
      PERMISSIONS.COURSE_CREATE,
      PERMISSIONS.COURSE_READ,
      PERMISSIONS.COURSE_UPDATE,
      PERMISSIONS.COURSE_DELETE
    ]
  },
  {
    title: 'Danh mục',
    url: '/admin/categories',
    icon: MdCategory,
    permissions: [
      PERMISSIONS.CATEGORY_CREATE,
      PERMISSIONS.CATEGORY_READ,
      PERMISSIONS.CATEGORY_UPDATE,
      PERMISSIONS.CATEGORY_DELETE
    ]
  },
  {
    title: 'Bài viết',
    url: '/admin/blogs',
    icon: MdArticle,
    permissions: [PERMISSIONS.BLOG_CREATE, PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_DELETE]
  },
  {
    title: 'Bình luận',
    url: '/admin/comments',
    icon: MdComment,
    permissions: [
      PERMISSIONS.COMMENT_CREATE,
      PERMISSIONS.COMMENT_READ,
      PERMISSIONS.COMMENT_UPDATE,
      PERMISSIONS.COMMENT_DELETE
    ]
  },
  {
    title: 'Mã giảm giá',
    url: '/admin/coupons',
    icon: MdLocalOffer,
    permissions: [
      PERMISSIONS.COUPON_CREATE,
      PERMISSIONS.COUPON_READ,
      PERMISSIONS.COUPON_UPDATE,
      PERMISSIONS.COUPON_DELETE
    ]
  },
  {
    title: 'Đơn hàng',
    url: '/admin/orders',
    icon: MdShoppingCart,
    permissions: [PERMISSIONS.ORDER_CREATE, PERMISSIONS.ORDER_READ, PERMISSIONS.ORDER_UPDATE, PERMISSIONS.ORDER_DELETE]
  },

  {
    title: 'Người dùng',
    url: '/admin/users',
    icon: MdPeople,
    permissions: [PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE]
  },
  {
    title: 'Vai trò & Quyền',
    url: '/admin/roles',
    icon: MdSecurity,
    permissions: [PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_UPDATE, PERMISSIONS.ROLE_DELETE]
  }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuthStore()
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)

  const handleLogout = async () => {
    await logout()
    router.push('/auth/sign-in')
  }

  // Lấy các ký tự đầu từ tên người dùng
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'AD'

  return (
    <Sidebar className='border-r'>
      <SidebarHeader className='shrink-0 border-b p-4'>
        <Link href={ROUTE_CONFIG.HOME} className='flex min-w-0 items-center gap-3'>
          <div className='bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'>
            <MdSchool className='h-4 w-4' />
          </div>
          <h2 className='truncate text-lg font-semibold'>LMS Admin</h2>
        </Link>
      </SidebarHeader>

      <SidebarContent className='min-h-0 flex-1 overflow-x-hidden px-4 py-4'>
        <SidebarMenu>
          {menuItems.map((item) => {
            if (!hasAnyPermission(item.permissions)) {
              return null
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url} className='flex min-w-0 items-center gap-3 px-3 py-2'>
                    <item.icon className='h-4 w-4 shrink-0' />
                    <span className='truncate'>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarSeparator className='my-4' />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/admin/settings' className='flex min-w-0 items-center gap-3 px-3 py-2'>
                <MdSettings className='h-4 w-4 shrink-0' />
                <span className='truncate'>Cài đặt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='shrink-0 border-t p-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <Avatar className='h-8 w-8 shrink-0'>
            <AvatarImage src='/images/default-avatar.jpg' alt={user?.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium'>{user?.username}</p>
            <p className='text-muted-foreground truncate text-xs'>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className='text-muted-foreground hover:text-foreground' title='Đăng xuất'>
            <MdLogout className='h-4 w-4' />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
