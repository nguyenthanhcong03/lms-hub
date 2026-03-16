import { ROUTE_CONFIG } from "@/configs/routes";
import Link from "next/link";
import { GiGraduateCap } from "react-icons/gi";

export function HeaderLogo() {
  return (
    <Link
      href={ROUTE_CONFIG.HOME}
      className="flex items-center space-x-2 sm:space-x-4 group min-w-fit focus:outline-none rounded-lg"
      aria-label="LMSHub - Go to homepage"
    >
      <div className="relative">
        {/* Enhanced logo with glass effect */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary"></div>
          <span className="text-white font-bold text-lg relative z-10" aria-hidden="true">
            <GiGraduateCap size={16} className="sm:w-6 sm:h-6" />
          </span>
        </div>
      </div>
      <div className="hidden sm:block">
        <span className="text-xl sm:text-2xl font-bold bg-primary bg-clip-text text-transparent">LMS Hub</span>
        <div className="text-xs text-gray-500 -mt-1 font-medium tracking-wide">Learn. Grow. Succeed.</div>
      </div>
    </Link>
  );
}
