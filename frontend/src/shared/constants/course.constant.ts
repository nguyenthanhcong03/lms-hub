import { ChipProps } from "@heroui/react";
import { CourseLevel, CourseStatus } from "./enums";

export const courseStatusActions: {
  label: string;
  value: CourseStatus;
  className?: string;
  variant?: string;
}[] = [
  {
    label: "Đã duyệt",
    value: CourseStatus.APPROVED,
  },
  {
    label: "Chờ duyệt",
    value: CourseStatus.PENDING,
  },
  {
    label: "Từ chối",
    value: CourseStatus.REJECTED,
  },
];
export const courseStatus: Record<
  CourseStatus,
  {
    label: string;
    value: CourseStatus;
    className?: string;
    color: ChipProps["color"];
  }
> = {
  [CourseStatus.APPROVED]: {
    label: "Đã duyệt",
    value: CourseStatus.APPROVED,
    color: "success",
    className: "bg-green-500 text-green-500",
  },
  [CourseStatus.PENDING]: {
    label: "Chờ duyệt",
    value: CourseStatus.PENDING,
    color: "warning",
    className: "bg-orange-500 text-orange-500",
  },
  [CourseStatus.REJECTED]: {
    label: "Bị từ chối",
    value: CourseStatus.REJECTED,
    color: "danger",
    className: "bg-red-500 text-red-500",
  },
};
export const courseLevelActions: {
  label: string;
  value: CourseLevel;
}[] = [
  {
    label: "Dễ",
    value: CourseLevel.BEGINNER,
  },
  {
    label: "Trung bình",
    value: CourseLevel.INTERMEDIATE,
  },
  {
    label: "Khó",
    value: CourseLevel.ADVANCED,
  },
];
export const courseLevel: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: "Dễ",
  [CourseLevel.INTERMEDIATE]: "Trung bình",
  [CourseLevel.ADVANCED]: "Khó",
};
