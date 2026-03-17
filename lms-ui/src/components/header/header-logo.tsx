import { ROUTE_CONFIG } from '@/configs/routes'
import Link from 'next/link'
import { GiGraduateCap } from 'react-icons/gi'

export function HeaderLogo() {
  return (
    <Link
      href={ROUTE_CONFIG.HOME}
      className='group flex min-w-fit items-center space-x-2 rounded-lg focus:outline-none sm:space-x-4'
      aria-label='LMSHub - Về trang chủ'
    >
      <div className='relative'>
        {/* Logo tăng cường với hiệu ứng kính */}
        <div className='bg-primary relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl sm:h-10 sm:w-10'>
          <div className='bg-primary absolute inset-0'></div>
          <span className='relative z-10 text-lg font-bold text-white' aria-hidden='true'>
            <GiGraduateCap size={16} className='sm:h-6 sm:w-6' />
          </span>
        </div>
      </div>
      <div className='hidden sm:block'>
        <span className='bg-primary bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>LMS Hub</span>
        <div className='-mt-1 text-xs font-medium tracking-wide text-gray-500'>Học hỏi. Phát triển. Thành công.</div>
      </div>
    </Link>
  )
}
