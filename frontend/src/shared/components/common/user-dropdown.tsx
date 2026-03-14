import { ROUTE_CONFIG } from "@/shared/configs/route";
import { menuItemsMyProfile } from "@/shared/constants/menu.constant";
import { useAuth } from "@/shared/contexts/auth-context";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { DEFAULT_AVATAR } from "@/shared/constants";
import { UserRole } from "@/shared/constants/enums";

const UserDropDown = () => {
  const { user, handleLogout } = useAuth();

  return (
    <Dropdown
      placement="bottom-end"
      showArrow
      offset={10}
      radius="sm"
      classNames={{
        base: "before:bg-white", // change arrow background
      }}
    >
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as="button"
          className="transition-transform"
          name={user?.username}
          size="md"
          src={user?.avatar || DEFAULT_AVATAR}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="light">
        <DropdownSection showDivider aria-label="Profile & Actions">
          <DropdownItem
            key="profile"
            isReadOnly
            className="h-14 gap-2 opacity-100"
          >
            <User
              avatarProps={{
                size: "sm",
                src: user?.avatar || DEFAULT_AVATAR,
              }}
              classNames={{
                name: "text-default-600 text-base font-semibold",
                description: "text-default-500 font-medium",
              }}
              description={user?.email}
              name={user?.username}
            />
          </DropdownItem>
        </DropdownSection>
        {user && [UserRole.ADMIN, UserRole.EXPERT].includes(user.role) ? (
          <DropdownSection
            className=""
            classNames={{ group: "text-default-600 font-medium space-y-1.5" }}
            showDivider
            aria-label="Profile & Actions"
          >
            <DropdownItem
              key="manage"
              target="_blank"
              href={ROUTE_CONFIG.MANAGE_SYSTEM.DASHBOARD}
            >
              Quản trị hệ thống
            </DropdownItem>
          </DropdownSection>
        ) : null}
        <DropdownSection
          className=""
          classNames={{ group: "text-default-600 font-medium space-y-1.5" }}
          showDivider
          aria-label="Profile & Actions"
        >
          {menuItemsMyProfile?.map((item, index) => (
            <DropdownItem key={index} href={item.url}>
              {item.title}
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownItem
          classNames={{ base: "text-default-600 font-medium" }}
          key="logout"
          onPress={handleLogout}
        >
          Đăng xuất
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropDown;
