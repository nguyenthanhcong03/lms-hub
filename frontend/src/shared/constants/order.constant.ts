import { ChipProps } from "@heroui/react";
import { OrderStatus } from "./enums";

export const orderStatusActions: {
  label: string;
  value: OrderStatus;
  className?: string;
  variant?: string;
}[] = [
  {
    label: "Đã duyệt",
    value: OrderStatus.COMPLETED,
  },
  {
    label: "Chờ duyệt",
    value: OrderStatus.PENDING,
  },
  {
    label: "Đã hủy",
    value: OrderStatus.CANCELED,
  },
];
export const orderStatus: Record<
  OrderStatus,
  {
    label: string;
    value: OrderStatus;
    color: ChipProps["color"];
  }
> = {
  [OrderStatus.COMPLETED]: {
    label: "Đã duyệt",
    value: OrderStatus.COMPLETED,
    color: "success",
  },
  [OrderStatus.PENDING]: {
    label: "Chờ duyệt",
    value: OrderStatus.PENDING,
    color: "warning",
  },
  [OrderStatus.CANCELED]: {
    label: "Đã hủy",
    value: OrderStatus.CANCELED,
    color: "danger",
  },
};
