'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MdNotifications, MdSearch } from 'react-icons/md'
import { UserNav } from '@/components/auth/user-nav'
import { useEffect, useState, useRef } from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  actions?: React.ReactNode
  showTopActions?: boolean
}

function AdminHeader({
  title = 'Bảng quản trị',
  actions,
  showTopActions = true,
  scrollContainerRef
}: {
  title?: string
  actions?: React.ReactNode
  showTopActions?: boolean
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current
    if (!scrollContainer) return

    const onScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      setOffset(scrollTop)
      // Gỡ lỗi: bỏ chú thích để xem giá trị cuộn
      // console.log("Scroll offset:", scrollTop);
    }

    // Thêm bộ lắng nghe cuộn cho vùng có thể cuộn
    scrollContainer.addEventListener('scroll', onScroll, { passive: true })

    // Dọn dẹp bộ lắng nghe khi unmount
    return () => scrollContainer.removeEventListener('scroll', onScroll)
  }, [scrollContainerRef])

  return (
    <header
      className={`sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-all duration-200 ${offset > 0 ? 'bg-background/95 border-border shadow-md backdrop-blur-md' : 'bg-background border-border'} `}
    >
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2' />

      <div className='flex flex-1 items-center justify-between'>
        <h1 className='text-lg font-semibold'>{title}</h1>

        <div className='flex items-center gap-2'>
          {/* Hành động tùy chỉnh */}
          {actions}

          {/* Hành động mặc định phía trên - luôn hiển thị */}
          {showTopActions && (
            <>
              <Button variant='ghost' size='icon' title='Tìm kiếm'>
                <MdSearch className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' title='Thông báo'>
                <MdNotifications className='h-4 w-4' />
              </Button>
              <UserNav />
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export function AdminLayout({ children, title, actions, showTopActions = true }: AdminLayoutProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Ngăn cuộn trang khi layout admin được mount
  useEffect(() => {
    // Lưu lại overflow ban đầu
    const originalOverflow = document.body.style.overflow

    // Chặn cuộn body
    document.body.style.overflow = 'hidden'

    // Dọn dẹp khi unmount
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return (
    <SidebarProvider>
      <div className='bg-background fixed inset-0 flex h-full w-full overflow-hidden'>
        <AdminSidebar />
        <div ref={scrollContainerRef} className='h-full flex-1 overflow-x-hidden overflow-y-auto'>
          <AdminHeader
            title={title}
            actions={actions}
            showTopActions={showTopActions}
            scrollContainerRef={scrollContainerRef}
          />
          <main className='bg-muted/10 p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
