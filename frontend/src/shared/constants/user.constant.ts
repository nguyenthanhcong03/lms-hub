import { ChipProps } from "@heroui/react";
import { UserRole, UserStatus } from "./enums";

export const userStatus: Record<
  UserStatus,
  {
    label: string;
    value: UserStatus;
    className?: string;
    color: ChipProps["color"];
  }
> = {
  [UserStatus.ACTIVE]: {
    label: "Hoạt động",
    value: UserStatus.ACTIVE,
    className: "text-green-500 bg-green-500",
    color: "success",
  },
  [UserStatus.INACTIVE]: {
    label: "Ngưng hoạt động",
    value: UserStatus.INACTIVE,
    className: "text-red-500 bg-red-500",
    color: "danger",
  },
};

export const userStatusActions = [
  {
    label: "Hoạt động",
    value: UserStatus.ACTIVE,
  },
  {
    label: "Ngưng hoạt động",
    value: UserStatus.INACTIVE,
  },
];
export const userRoleActions: {
  label: string;
  value: UserRole;
}[] = [
  {
    label: "admin",
    value: UserRole.ADMIN,
  },
  {
    label: "user",
    value: UserRole.USER,
  },
  {
    label: "expert",
    value: UserRole.EXPERT,
  },
];
