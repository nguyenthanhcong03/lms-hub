/**
 * Hằng số quyền RBAC phiên bản rút gọn
 * Dùng thao tác CRUD tiêu chuẩn để quản lý UI dễ hơn
 */

// Quyền CRUD theo từng tài nguyên
export const PERMISSIONS = {
  // Quản lý người dùng
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Quản lý khóa học
  COURSE_CREATE: 'course:create',
  COURSE_READ: 'course:read',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',

  // Quản lý chương
  CHAPTER_CREATE: 'chapter:create',
  CHAPTER_READ: 'chapter:read',
  CHAPTER_UPDATE: 'chapter:update',
  CHAPTER_DELETE: 'chapter:delete',

  // Quản lý bài học
  LESSON_CREATE: 'lesson:create',
  LESSON_READ: 'lesson:read',
  LESSON_UPDATE: 'lesson:update',
  LESSON_DELETE: 'lesson:delete',

  // Quản lý danh mục
  CATEGORY_CREATE: 'category:create',
  CATEGORY_READ: 'category:read',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',

  // Quản lý bài viết
  BLOG_CREATE: 'blog:create',
  BLOG_READ: 'blog:read',
  BLOG_UPDATE: 'blog:update',
  BLOG_DELETE: 'blog:delete',

  // Quản lý mã giảm giá
  COUPON_CREATE: 'coupon:create',
  COUPON_READ: 'coupon:read',
  COUPON_UPDATE: 'coupon:update',
  COUPON_DELETE: 'coupon:delete',

  // Quản lý đánh giá
  REVIEW_CREATE: 'review:create',
  REVIEW_READ: 'review:read',
  REVIEW_UPDATE: 'review:update',
  REVIEW_DELETE: 'review:delete',

  // Quản lý bình luận
  COMMENT_CREATE: 'comment:create',
  COMMENT_READ: 'comment:read',
  COMMENT_UPDATE: 'comment:update',
  COMMENT_DELETE: 'comment:delete',

  // Quản lý vai trò
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // Quản lý câu hỏi quiz
  QUIZ_QUESTION_CREATE: 'quiz_question:create',
  QUIZ_QUESTION_READ: 'quiz_question:read',
  QUIZ_QUESTION_UPDATE: 'quiz_question:update',
  QUIZ_QUESTION_DELETE: 'quiz_question:delete',

  // Quản lý đơn hàng
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete'
} as const

export const ADMIN_PANEL_PERMISSIONS: Permission[] = [
  PERMISSIONS.USER_CREATE,
  PERMISSIONS.USER_READ,
  PERMISSIONS.USER_UPDATE,
  PERMISSIONS.USER_DELETE,
  PERMISSIONS.COURSE_CREATE,
  PERMISSIONS.COURSE_READ,
  PERMISSIONS.COURSE_UPDATE,
  PERMISSIONS.COURSE_DELETE,
  PERMISSIONS.CHAPTER_CREATE,
  PERMISSIONS.CHAPTER_READ,
  PERMISSIONS.CHAPTER_UPDATE,
  PERMISSIONS.CHAPTER_DELETE,
  PERMISSIONS.LESSON_CREATE,
  PERMISSIONS.LESSON_READ,
  PERMISSIONS.LESSON_UPDATE,
  PERMISSIONS.LESSON_DELETE,
  PERMISSIONS.CATEGORY_CREATE,
  PERMISSIONS.CATEGORY_READ,
  PERMISSIONS.CATEGORY_UPDATE,
  PERMISSIONS.CATEGORY_DELETE,
  PERMISSIONS.BLOG_CREATE,
  PERMISSIONS.BLOG_READ,
  PERMISSIONS.BLOG_UPDATE,
  PERMISSIONS.BLOG_DELETE,
  PERMISSIONS.COUPON_CREATE,
  PERMISSIONS.COUPON_READ,
  PERMISSIONS.COUPON_UPDATE,
  PERMISSIONS.COUPON_DELETE,
  PERMISSIONS.REVIEW_CREATE,
  PERMISSIONS.REVIEW_READ,
  PERMISSIONS.REVIEW_UPDATE,
  PERMISSIONS.REVIEW_DELETE,
  PERMISSIONS.COMMENT_CREATE,
  PERMISSIONS.COMMENT_READ,
  PERMISSIONS.COMMENT_UPDATE,
  PERMISSIONS.COMMENT_DELETE,
  PERMISSIONS.ROLE_CREATE,
  PERMISSIONS.ROLE_READ,
  PERMISSIONS.ROLE_UPDATE,
  PERMISSIONS.ROLE_DELETE,
  PERMISSIONS.QUIZ_QUESTION_CREATE,
  PERMISSIONS.QUIZ_QUESTION_READ,
  PERMISSIONS.QUIZ_QUESTION_UPDATE,
  PERMISSIONS.QUIZ_QUESTION_DELETE,
  PERMISSIONS.ORDER_READ,
  PERMISSIONS.ORDER_UPDATE,
  PERMISSIONS.ORDER_DELETE
] as const

// Hàm trợ giúp để tạo chuỗi permission
export const generatePermission = (resource: string, operation: string): string => {
  return `${resource}:${operation}`
}

// Toàn bộ permission dưới dạng mảng
export const ALL_PERMISSIONS = Object.values(PERMISSIONS)

export const PERMISSION_GROUPS = {
  user: {
    label: 'Quản lý người dùng',
    permissions: [PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE]
  },
  course: {
    label: 'Quản lý khóa học',
    permissions: [
      PERMISSIONS.COURSE_CREATE,
      PERMISSIONS.COURSE_READ,
      PERMISSIONS.COURSE_UPDATE,
      PERMISSIONS.COURSE_DELETE
    ]
  },
  chapter: {
    label: 'Quản lý chương',
    permissions: [
      PERMISSIONS.CHAPTER_CREATE,
      PERMISSIONS.CHAPTER_READ,
      PERMISSIONS.CHAPTER_UPDATE,
      PERMISSIONS.CHAPTER_DELETE
    ]
  },
  lesson: {
    label: 'Quản lý bài học',
    permissions: [
      PERMISSIONS.LESSON_CREATE,
      PERMISSIONS.LESSON_READ,
      PERMISSIONS.LESSON_UPDATE,
      PERMISSIONS.LESSON_DELETE
    ]
  },
  category: {
    label: 'Quản lý danh mục',
    permissions: [
      PERMISSIONS.CATEGORY_CREATE,
      PERMISSIONS.CATEGORY_READ,
      PERMISSIONS.CATEGORY_UPDATE,
      PERMISSIONS.CATEGORY_DELETE
    ]
  },
  blog: {
    label: 'Quản lý bài viết',
    permissions: [PERMISSIONS.BLOG_CREATE, PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_DELETE]
  },
  coupon: {
    label: 'Quản lý mã giảm giá',
    permissions: [
      PERMISSIONS.COUPON_CREATE,
      PERMISSIONS.COUPON_READ,
      PERMISSIONS.COUPON_UPDATE,
      PERMISSIONS.COUPON_DELETE
    ]
  },
  review: {
    label: 'Quản lý đánh giá',
    permissions: [
      PERMISSIONS.REVIEW_CREATE,
      PERMISSIONS.REVIEW_READ,
      PERMISSIONS.REVIEW_UPDATE,
      PERMISSIONS.REVIEW_DELETE
    ]
  },
  comment: {
    label: 'Quản lý bình luận',
    permissions: [
      PERMISSIONS.COMMENT_CREATE,
      PERMISSIONS.COMMENT_READ,
      PERMISSIONS.COMMENT_UPDATE,
      PERMISSIONS.COMMENT_DELETE
    ]
  },
  role: {
    label: 'Quản lý vai trò',
    permissions: [PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_UPDATE, PERMISSIONS.ROLE_DELETE]
  },
  quiz_question: {
    label: 'Quản lý câu hỏi quiz',
    permissions: [
      PERMISSIONS.QUIZ_QUESTION_CREATE,
      PERMISSIONS.QUIZ_QUESTION_READ,
      PERMISSIONS.QUIZ_QUESTION_UPDATE,
      PERMISSIONS.QUIZ_QUESTION_DELETE
    ]
  },
  order: {
    label: 'Quản lý đơn hàng',
    permissions: [PERMISSIONS.ORDER_READ, PERMISSIONS.ORDER_UPDATE, PERMISSIONS.ORDER_DELETE]
  }
} as const

// Tên vai trò hệ thống phổ biến (để tham chiếu)
export const SYSTEM_ROLE_NAMES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  STUDENT: 'Student',
  GUEST: 'Guest'
} as const

export type SystemRoleName = (typeof SYSTEM_ROLE_NAMES)[keyof typeof SYSTEM_ROLE_NAMES]
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
// export type PermissionGroup = keyof typeof PERMISSION_GROUPS;
