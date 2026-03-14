"use client";
import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from "@heroui/react";
import Link from "next/link";
import { listMenu } from "@/shared/constants/menu.constant";
import { usePathname } from "next/navigation";
const MenuListMobile = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const pathname = usePathname();
  return (
    <Drawer
      placement="left"
      radius="none"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerBody>
              <ul className="flex flex-col gap-4 py-4">
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
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MenuListMobile;
