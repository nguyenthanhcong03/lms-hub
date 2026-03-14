"use client";

import MenuItem from "@/shared/components/common/menu-item";

import { Avatar } from "@heroui/react";

import { menuItemsMyProfile } from "@/shared/constants/menu.constant";
import { useAuth } from "@/shared/contexts/auth-context";

import { FaSignOutAlt } from "react-icons/fa";
import { DEFAULT_AVATAR } from "@/shared/constants";

type UserDashBoardLayoutProps = {
  children: React.ReactNode;
};

const UserDashBoardLayout = ({ children }: UserDashBoardLayoutProps) => {
  const { user, handleLogout } = useAuth();
  return (
    <div className="container py-10">
      <div className="mb-10 flex items-center gap-4">
        <Avatar
          isBordered
          showFallback
          as="button"
          className="h-16 w-16 transition-transform"
          name={user?.username}
          size="sm"
          src={user?.avatar || DEFAULT_AVATAR}
        />
        <div className="flex flex-col">
          <span className="text-xl font-medium">Xin Chào,</span>
          <span className="text-2xl font-semibold">{user?.username}</span>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-[270px,minmax(0,1fr)]">
        <div className="border-r">
          <ul className="my-8 space-y-2">
            {menuItemsMyProfile.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                url={item.url}
              />
            ))}
            <MenuItem
              icon={<FaSignOutAlt />}
              title="Logout"
              url=""
              onClick={handleLogout}
            />
          </ul>
        </div>

        <div className="pl-8 pt-8">{children}</div>
      </div>
    </div>
  );
};

export default UserDashBoardLayout;
