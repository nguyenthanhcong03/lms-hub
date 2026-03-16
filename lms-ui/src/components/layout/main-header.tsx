"use client";

import dynamic from "next/dynamic";

import { HeaderLogo } from "../header/header-logo";
import { DesktopNavigation } from "../header/desktop-navigation";

const MobileMenu = dynamic(() => import("../header/mobile-menu"), {
  ssr: false,
  loading: () => <div className="lg:hidden h-10 w-10 p-0 animate-pulse bg-gray-200 rounded" />,
});

const SearchDialog = dynamic(() => import("../header/search-dialog"), {
  ssr: false,
  loading: () => <div className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse bg-gray-200 rounded-full" />,
});

const CartTooltip = dynamic(() => import("../header/cart-tooltip"), {
  ssr: false,
  loading: () => <div className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse bg-gray-200 rounded-full" />,
});

const AuthSection = dynamic(() => import("../header/auth-section"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="h-8 sm:h-10 w-16 sm:w-20 animate-pulse bg-gray-200 rounded-xl" />
      <div className="h-8 sm:h-10 w-20 sm:w-28 animate-pulse bg-gray-200 rounded-xl" />
    </div>
  ),
});

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
