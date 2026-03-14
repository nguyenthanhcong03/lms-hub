export const couponStatus: Record<
  CouponStatus,
  {
    label: string;
    value: CouponStatus;
    className?: string;
    color: ChipProps["color"];
  }
> = {
  [CouponStatus.ACTIVE]: {
    label: "Hoạt động",
    value: CouponStatus.ACTIVE,
    className: "text-green-500 bg-green-500",
    color: "success",
  },
  [CouponStatus.INACTIVE]: {
    label: "Ngưng hoạt động",
    value: CouponStatus.INACTIVE,
    className: "text-red-500 bg-red-500",
    color: "danger",
  },
};

export const couponStatusActions = [
  {
    label: "Hoạt động",
    value: CouponStatus.ACTIVE,
  },
  {
    label: "Ngưng hoạt động",
    value: CouponStatus.INACTIVE,
  },
];

export const couponType = [
  { value: "percent", label: "Percent" },
  { value: "fixed", label: "Fixed" },
];
import { ChipProps } from "@heroui/react";
import { CouponStatus, CouponType } from "./enums";

export const couponTypes: {
  label: string;
  value: CouponType;
}[] = [
  {
    label: "Phần trăm",
    value: CouponType.PERCENT,
  },
  {
    label: "Giá trị",
    value: CouponType.FIXED,
  },
];
export const couponStatuses = [
  {
    label: "Đang kích hoạt",
    value: 1,
  },
  {
    label: "Chưa kích hoạt",
    value: 0,
  },
];
