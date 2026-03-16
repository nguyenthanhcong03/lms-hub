"use client";

import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@/components/ui/button";
import { ROUTE_CONFIG } from "@/configs/routes";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "lucide-react";
import Link from "next/link";

export default function AuthSection() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <UserNav />;
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="relative bg-secondary text-gray-600 hover:text-primary h-8 sm:h-10 px-2 sm:px-4 font-semibold transition-all duration-300 group hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 rounded-full border border-transparent focus:outline-none"
        asChild
      >
        <Link href={ROUTE_CONFIG.AUTH.SIGN_IN} aria-label="Đăng nhập vào tài khoản của bạn">
          <div className="absolute inset-0   rounded-xl transition-all duration-300"></div>
          <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10 hidden sm:inline">Đăng nhập</span>
        </Link>
      </Button>
      <Button
        size="sm"
        className="bg-primary hover:bg-primary/80 text-white shadow-lg hover:shadow-xl hover:text-white transition-all duration-300 h-8 sm:h-10 px-3 sm:px-6 rounded-full font-semibold relative overflow-hidden group border border-transparent  focus:outline-none"
        asChild
      >
        <Link href={ROUTE_CONFIG.AUTH.SIGN_UP} aria-label="Đăng ký và bắt đầu học với LMSHub">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
            <span className="hidden sm:inline">Bắt đầu</span>
            <span className="sm:hidden">Học ngay</span>
          </span>
          <span
            className="ml-1 sm:ml-2 relative z-10 group-hover:rotate-12 transition-transform duration-300 text-xs sm:text-base"
            aria-hidden="true"
          >
            🚀
          </span>
        </Link>
      </Button>
    </div>
  );
}
