import { ChipProps } from "@heroui/react";
import { CommentStatus } from "./enums";

export const commentStatusActions: {
  label: string;
  value: CommentStatus;
  className?: string;
  variant?: string;
}[] = [
  {
    label: "Đã duyệt",
    value: CommentStatus.APPROVED,
    className: "text-green-500 bg-green-500",
    variant: "success",
  },
  {
    label: "Chờ duyệt",
    value: CommentStatus.PENDING,
    className: "text-orange-500 bg-orange-500",
    variant: "warning",
  },
  {
    label: "Từ chối",
    value: CommentStatus.REJECTED,
    className: "text-red-500 bg-red-500",
    variant: "danger",
  },
];
export const commentStatus: Record<
  CommentStatus,
  {
    label: string;
    value: CommentStatus;
    className?: string;
    color: ChipProps["color"];
  }
> = {
  [CommentStatus.APPROVED]: {
    label: "Đã duyệt",
    value: CommentStatus.APPROVED,
    color: "success",
    className: "bg-green-500 text-green-500",
  },
  [CommentStatus.PENDING]: {
    label: "Chờ duyệt",
    value: CommentStatus.PENDING,
    color: "warning",
    className: "bg-orange-500 text-orange-500",
  },
  [CommentStatus.REJECTED]: {
    label: "Bị từ chối",
    value: CommentStatus.REJECTED,
    color: "danger",
    className: "bg-red-500 text-red-500",
  },
};
