import React from 'react'
import { CategoryStatus } from '@/types/category'
import { CourseLevel } from '@/types/course'
import { DiscountType } from '@/types/coupon'
import { BlogStatus } from '@/types/blog'
import { CommentStatus } from '@/types/comment'

// Tùy chọn bộ lọc cho bảng dữ liệu
export const FILTER_OPTIONS = {
  // Bộ lọc danh mục
  CATEGORY_STATUS: [
    {
      label: 'Hoạt động',
      value: CategoryStatus.ACTIVE
    },
    {
      label: 'Không hoạt động',
      value: CategoryStatus.INACTIVE
    }
  ],

  // Bộ lọc blog
  BLOG_STATUS: [
    {
      label: 'Nháp',
      value: BlogStatus.DRAFT
    },
    {
      label: 'Đã xuất bản',
      value: BlogStatus.PUBLISHED
    }
  ],

  // Bộ lọc khóa học - đã cập nhật theo cấu trúc boolean mới
  COURSE_STATUS: [
    {
      label: 'Nháp',
      value: 'draft'
    },
    {
      label: 'Đã xuất bản',
      value: 'published'
    }
  ],

  COURSE_TYPE: [
    {
      label: 'Miễn phí',
      value: 'free'
    },
    {
      label: 'Trả phí',
      value: 'paid'
    }
  ],

  COURSE_LEVEL: [
    {
      label: 'Cơ bản',
      value: CourseLevel.BEGINNER
    },
    {
      label: 'Trung cấp',
      value: CourseLevel.INTERMEDIATE
    },
    {
      label: 'Nâng cao',
      value: CourseLevel.ADVANCED
    }
  ],

  // Bộ lọc mã giảm giá
  COUPON_STATUS: [
    {
      label: 'Hoạt động',
      value: 'active'
    },
    {
      label: 'Hết hạn',
      value: 'expired'
    },
    {
      label: 'Không hoạt động',
      value: 'inactive'
    }
  ],

  COUPON_DISCOUNT_TYPE: [
    {
      label: 'Tỷ lệ',
      value: DiscountType.PERCENT
    },
    {
      label: 'Số tiền cố định',
      value: DiscountType.FIXED
    }
  ],

  // Bộ lọc người dùng
  USER_STATUS: [
    {
      label: 'Hoạt động',
      value: 'active'
    },
    {
      label: 'Không hoạt động',
      value: 'inactive'
    },
    {
      label: 'Bị cấm',
      value: 'banned'
    }
  ],

  USER_TYPE: [
    {
      label: 'Mặc định',
      value: 'default'
    },
    {
      label: 'Facebook',
      value: 'facebook'
    },
    {
      label: 'Google',
      value: 'google'
    }
  ],

  // Bộ lọc bình luận
  COMMENT_STATUS: [
    {
      label: 'Đang chờ duyệt',
      value: CommentStatus.PENDING
    },
    {
      label: 'Đã duyệt',
      value: CommentStatus.APPROVED
    },
    {
      label: 'Bị từ chối',
      value: CommentStatus.REJECTED
    }
  ]
} as const

// Interface cấu hình bộ lọc
export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

// Kiểu cho giá trị lọc trạng thái danh mục
export type CategoryStatusFilter = 'active' | 'inactive'
