import AuthSection from '../header/auth-section'
import CartTooltip from '../header/cart-tooltip'
import { DesktopNavigation } from '../header/desktop-navigation'
import { HeaderLogo } from '../header/header-logo'
import MobileMenu from '../header/mobile-menu'
import SearchDialog from '../header/search-dialog'

function MainHeader() {
  return (
    <header className='sticky top-0 z-50 w-full bg-white shadow-sm'>
      {/* Container nội dung */}
      <div className='relative z-10'>
        {/* Thanh tiêu đề chính */}
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between gap-2 sm:h-18 sm:gap-4 lg:gap-6'>
            {/* Nút menu di động và logo */}
            <div className='flex items-center gap-3'>
              <MobileMenu />
              <HeaderLogo />
            </div>

            {/* Điều hướng màn hình lớn */}
            <DesktopNavigation />

            {/* Thao tác */}
            <div className='flex min-w-fit items-center gap-1 sm:gap-2 lg:gap-3'>
              <SearchDialog />
              <CartTooltip />
              <AuthSection />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainHeader
