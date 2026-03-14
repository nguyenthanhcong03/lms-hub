"use client";
import Image from "next/image";
import React from "react";
import MenuItem from "../common/menu-item";
import { menuItems } from "@/shared/constants/menu.constant";
import { Avatar } from "@heroui/react";
import { useAuth } from "@/shared/contexts/auth-context";
import Link from "next/link";

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <nav className="fixed left-0 top-0 hidden h-screen min-w-[300px] overflow-auto border-r bg-white font-[sans-serif] shadow-xl lg:block">
      <div className="relative flex h-full flex-col">
        <Link href="/" className="flex items-center gap-1 py-4 pl-8">
          <div className="relative h-12 w-12 flex-shrink-0 md:h-14 md:w-14">
            <Image src="/images/yolo.png" alt="logo" fill priority />
          </div>
          <div className="animate-gradient-x bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold uppercase text-transparent">
            Yolo
          </div>
        </Link>
        <ul className="flex-1 space-y-1">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              url={item.url}
            />
          ))}
        </ul>

        <div className="flex cursor-pointer flex-wrap items-center border-t border-gray-300 px-4 py-4">
          <Avatar
            showFallback
            as="button"
            className="transition-transform"
            name={user?.username}
            size="md"
            src={user?.avatar || "/images/profile-photo.webp"}
          />
          <div className="ml-4">
            <p className="text-black">{user?.username}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
