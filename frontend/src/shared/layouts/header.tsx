"use client";
import Image from "next/image";
import Link from "next/link";

import { listMenu } from "@/shared/constants/menu.constant";
import { useAppDispatch, useAppSelector } from "@/shared/store";

import { usePathname } from "next/navigation";
import { BsCart } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

import { ROUTE_CONFIG } from "@/shared/configs/route";

import UserDropDown from "@/shared/components/common/user-dropdown";

import { useAuth } from "@/shared/contexts/auth-context";
import { getCartByUserAsync } from "@/shared/store/cart/action";

import { useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import MenuListMobile from "../components/common/menu-list-mobile";

import SearchBoxModal from "../components/search-box-modal";
const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onOpenChange: onOpenChangeDrawer,
  } = useDisclosure();
  const { isOpen, onOpenChange } = useDisclosure();

  const dispatch = useAppDispatch();

  const { result } = useAppSelector((state) => state.cart);

  const fetchCartByUSer = () => {
    dispatch(getCartByUserAsync());
  };

  useEffect(() => {
    if (user) {
      fetchCartByUSer();
    }
  }, [user]);

  return (
    <>
      {/* Search Modal */}
      {isOpen && <SearchBoxModal isOpen={isOpen} onOpenChange={onOpenChange} />}

      {/* Header */}
      <header className="sticky left-0 top-0 z-[50] bg-white shadow-md">
        <MenuListMobile
          isOpen={isOpenDrawer}
          onOpenChange={onOpenChangeDrawer}
        />
        <div className="flex w-full items-center justify-between px-4 py-2 md:px-6">
          <div className="flex items-center gap-1 md:gap-10">
            <button onClick={onOpenDrawer} className="md:hidden">
              <IoMenu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-1">
              <div className="relative h-12 w-12 flex-shrink-0 md:h-14 md:w-14">
                <Image src="/images/yolo.png" alt="logo" fill priority />
              </div>
              <div className="animate-gradient-x bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold uppercase text-transparent">
                Yolo
              </div>
            </Link>

            <ul className="z-50 hidden items-center gap-x-3 space-x-5 md:flex">
              {listMenu.map((item, index) => (
                <li
                  key={index}
                  className={`relative after:top-8 after:block after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:absolute hover:after:h-[2px] hover:after:w-full`}
                >
                  <Link
                    href={item.link}
                    className={`flex items-center gap-2 font-medium hover:text-primary ${
                      pathname === item.link
                        ? "text-primary"
                        : "text-default-500"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={onOpenChange}>
              <FiSearch size={20} />
            </button>

            <Link href={ROUTE_CONFIG.CART} className="relative">
              <BsCart size={20} />
              {(result?.items ?? []).length > 0 && (
                <span className="absolute -top-2 left-2.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {result?.items?.length || 0}
                </span>
              )}
            </Link>

            <div>
              {user ? (
                <UserDropDown />
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
        </div>
      </header>
    </>
  );
};

export default Header;
