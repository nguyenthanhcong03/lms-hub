'use client'

import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { MdMenu, MdNotifications, MdSearch } from 'react-icons/md'
import { Input } from '@/components/ui/input'
import { UserNav } from '@/components/auth/user-nav'

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className='bg-background flex h-16 items-center justify-between border-b px-6'>
      <div className='flex items-center gap-4'>
        <SidebarTrigger>
          <MdMenu className='h-4 w-4' />
        </SidebarTrigger>
        <h1 className='text-xl font-semibold'>{title}</h1>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative hidden md:block'>
          <MdSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input placeholder='Tìm kiếm...' className='w-64 pl-10' />
        </div>

        <Button variant='ghost' size='icon'>
          <MdNotifications className='h-4 w-4' />
        </Button>

        <UserNav />
      </div>
    </header>
  )
}
