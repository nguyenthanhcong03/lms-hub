import { ChipProps } from "@heroui/react";
import { ReviewStatus } from "./enums";

export const reviewStatus: Record<
  ReviewStatus,
  {
    label: string;
    value: ReviewStatus;
    className?: string;
    color: ChipProps["color"];
  }
> = {
  [ReviewStatus.ACTIVE]: {
    label: "Hoạt động",
    value: ReviewStatus.ACTIVE,
    className: "text-green-500 bg-green-500",
    color: "success",
  },
  [ReviewStatus.INACTIVE]: {
    label: "Ngưng hoạt động",
    value: ReviewStatus.INACTIVE,
    className: "text-red-500 bg-red-500",
    color: "danger",
  },
};

export const reviewStatusActions = [
  {
    label: "Hoạt động",
    value: ReviewStatus.ACTIVE,
  },
  {
    label: "Ngưng hoạt động",
    value: ReviewStatus.INACTIVE,
  },
];
