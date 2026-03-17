'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BreadcrumbStructuredData } from './structured-data'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Tạo breadcrumb từ pathname nếu không được truyền items
  const breadcrumbs = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbs.length <= 1) return null

  // Chuẩn bị dữ liệu có cấu trúc
  const structuredDataItems = breadcrumbs.map((item) => ({
    name: item.name,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}`
  }))

  return (
    <>
      {/* Dữ liệu có cấu trúc cho SEO */}
      <BreadcrumbStructuredData items={structuredDataItems} />

      {/* Breadcrumb hiển thị */}
      <nav aria-label='Đường dẫn điều hướng' className={`flex ${className}`}>
        <ol className='flex items-center space-x-2'>
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className='flex items-center'>
              {index > 0 && <ChevronRight className='mx-2 h-4 w-4 text-gray-400' aria-hidden='true' />}

              {item.current ? (
                <span className='text-sm font-medium text-gray-900 dark:text-gray-100' aria-current='page'>
                  {index === 0 && <Home className='mr-1 inline h-4 w-4' />}
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className='text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                >
                  {index === 0 && <Home className='mr-1 inline h-4 w-4' />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [{ name: 'Trang chủ', href: '/' }]

  let currentPath = ''

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1

    // Chuyển slug thành tên dễ đọc
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      name,
      href: currentPath,
      current: isLast
    })
  })

  return breadcrumbs
}

// Cấu hình breadcrumb dựng sẵn cho các trang phổ biến
export const BREADCRUMB_CONFIGS = {
  courses: (courseName?: string, courseSlug?: string) => [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khóa học', href: '/courses' },
    ...(courseName && courseSlug ? [{ name: courseName, href: `/courses/${courseSlug}`, current: true }] : [])
  ],

  blogs: (blogTitle?: string, blogSlug?: string) => [
    { name: 'Trang chủ', href: '/' },
    { name: 'Bài viết', href: '/blogs' },
    ...(blogTitle && blogSlug ? [{ name: blogTitle, href: `/blogs/${blogSlug}`, current: true }] : [])
  ],

  learning: (courseName?: string, courseSlug?: string, lessonTitle?: string) => [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khóa học của tôi', href: '/learning' },
    ...(courseName && courseSlug ? [{ name: courseName, href: `/learning/${courseSlug}` }] : []),
    ...(lessonTitle ? [{ name: lessonTitle, href: '#', current: true }] : [])
  ],

  profile: (pageName?: string) => [
    { name: 'Trang chủ', href: '/' },
    { name: 'Hồ sơ của tôi', href: '/my-profile' },
    ...(pageName ? [{ name: pageName, href: '#', current: true }] : [])
  ],

  admin: (section?: string, itemName?: string) => [
    { name: 'Trang chủ', href: '/' },
    { name: 'Quản trị', href: '/admin' },
    ...(section ? [{ name: section, href: `/admin/${section.toLowerCase()}` }] : []),
    ...(itemName ? [{ name: itemName, href: '#', current: true }] : [])
  ]
}
