"use client";
import Link from "next/link";

import { FaRegUserCircle } from "react-icons/fa";

import UserDropDown from "@/shared/components/common/user-dropdown";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { useAuth } from "@/shared/contexts/auth-context";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <>
      <header className="sticky left-0 top-0 z-10 bg-white shadow-md">
        <div className="flex w-full items-center justify-end px-6 py-2">
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <UserDropDown />
              </div>
            ) : (
              <Link
                href={ROUTE_CONFIG.LOGIN}
                className="flex size-10 flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white lg:w-auto lg:px-5"
              >
                <FaRegUserCircle size={20} />
                <span className="hidden lg:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
