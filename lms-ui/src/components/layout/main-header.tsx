import AuthSection from "../header/auth-section";
import CartTooltip from "../header/cart-tooltip";
import { DesktopNavigation } from "../header/desktop-navigation";
import { HeaderLogo } from "../header/header-logo";
import MobileMenu from "../header/mobile-menu";
import SearchDialog from "../header/search-dialog";

function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Content container */}
      <div className="relative z-10">
        {/* Main header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            {/* Mobile Menu Button & Logo Container */}
            <div className="flex items-center gap-3">
              <MobileMenu />
              <HeaderLogo />
            </div>

            {/* Desktop Navigation */}
            <DesktopNavigation />

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-fit">
              <SearchDialog />
              <CartTooltip />
              <AuthSection />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
