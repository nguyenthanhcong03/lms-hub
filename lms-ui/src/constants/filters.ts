import React from "react";
import { CategoryStatus } from "@/types/category";
import { CourseLevel } from "@/types/course";
import { DiscountType } from "@/types/coupon";
import { BlogStatus } from "@/types/blog";
import { CommentStatus } from "@/types/comment";

// Filter options for data tables
export const FILTER_OPTIONS = {
  // Category filters
  CATEGORY_STATUS: [
    {
      label: "Active",
      value: CategoryStatus.ACTIVE,
    },
    {
      label: "Inactive",
      value: CategoryStatus.INACTIVE,
    },
  ],

  // Blog filters
  BLOG_STATUS: [
    {
      label: "Nháp",
      value: BlogStatus.DRAFT,
    },
    {
      label: "Đã xuất bản",
      value: BlogStatus.PUBLISHED,
    },
  ],

  // Course filters - updated to match new boolean-based structure
  COURSE_STATUS: [
    {
      label: "Nháp",
      value: "draft",
    },
    {
      label: "Đã xuất bản",
      value: "published",
    },
  ],

  COURSE_TYPE: [
    {
      label: "Miễn phí",
      value: "free",
    },
    {
      label: "Trả phí",
      value: "paid",
    },
  ],

  COURSE_LEVEL: [
    {
      label: "Cơ bản",
      value: CourseLevel.BEGINNER,
    },
    {
      label: "Trung cấp",
      value: CourseLevel.INTERMEDIATE,
    },
    {
      label: "Nâng cao",
      value: CourseLevel.ADVANCED,
    },
  ],

  // Coupon filters
  COUPON_STATUS: [
    {
      label: "Hoạt động",
      value: "active",
    },
    {
      label: "Hết hạn",
      value: "expired",
    },
    {
      label: "Không hoạt động",
      value: "inactive",
    },
  ],

  COUPON_DISCOUNT_TYPE: [
    {
      label: "Tỷ lệ",
      value: DiscountType.PERCENT,
    },
    {
      label: "Số tiền cố định",
      value: DiscountType.FIXED,
    },
  ],

  // User filters
  USER_STATUS: [
    {
      label: "Hoạt động",
      value: "active",
    },
    {
      label: "Không hoạt động",
      value: "inactive",
    },
    {
      label: "Bị cấm",
      value: "banned",
    },
  ],

  USER_TYPE: [
    {
      label: "Mặc định",
      value: "default",
    },
    {
      label: "Facebook",
      value: "facebook",
    },
    {
      label: "Google",
      value: "google",
    },
  ],

  // Comment filters
  COMMENT_STATUS: [
    {
      label: "Đang chờ duyệt",
      value: CommentStatus.PENDING,
    },
    {
      label: "Đã duyệt",
      value: CommentStatus.APPROVED,
    },
    {
      label: "Bị từ chối",
      value: CommentStatus.REJECTED,
    },
  ],
} as const;

// Filter configuration interface
export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Type for category status filter values
export type CategoryStatusFilter = "active" | "inactive";
