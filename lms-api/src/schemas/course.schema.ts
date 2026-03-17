import { z } from 'zod'
import { CourseLevel, CourseStatus, CourseType } from '../enums'

/**
 * Schema xác thực Khóa học (Course)
 */

// Schema bài học cơ bản (Q&A)
const baseLesson = z.object({
  question: z.string().min(1, 'Câu hỏi là bắt buộc').trim(),
  answer: z.string().min(1, 'Câu trả lời là bắt buộc').trim()
})

// Schema thông tin khóa học
const baseCourseInfo = z.object({
  requirements: z.array(z.string().trim()).default([]),
  benefits: z.array(z.string().trim()).default([]),
  techniques: z.array(z.string().trim()).default([]),
  documents: z.array(z.string().trim()).default([]),
  qa: z.array(baseLesson).default([])
})

// Schema tạo khóa học
export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim(),
    slug: z.string().min(1, 'Slug là bắt buộc').max(200, 'Slug quá dài').trim(),
    image: z.string().optional(),
    description: z.string().optional(),
    excerpt: z.string().max(500, 'Mô tả ngắn quá dài').trim().optional(),
    introUrl: z.string().trim().optional(),
    price: z.number().min(0, 'Giá phải >= 0'),
    oldPrice: z.number().min(0, 'Giá cũ phải >= 0').optional(),
    originalPrice: z.number().min(0, 'Giá gốc phải >= 0').optional(),
    isFree: z.boolean().optional().default(false),
    status: z.nativeEnum(CourseStatus).optional().default(CourseStatus.DRAFT),
    categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
    level: z.nativeEnum(CourseLevel),
    info: baseCourseInfo.optional().default(() => ({
      requirements: [],
      benefits: [],
      techniques: [],
      documents: [],
      qa: []
    }))
  })
})

// Schema cập nhật khóa học
export const updateCourseSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, 'Course ID là bắt buộc')
  }),
  body: z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài').trim().optional(),
    slug: z.string().min(1, 'Slug là bắt buộc').max(200, 'Slug quá dài').trim().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    excerpt: z.string().max(500, 'Mô tả ngắn quá dài').trim().optional(),
    introUrl: z.string().trim().optional(),
    price: z.number().min(0, 'Giá phải >= 0').optional(),
    oldPrice: z.number().min(0, 'Giá cũ phải >= 0').optional(),
    isFree: z.boolean().optional(),
    status: z.nativeEnum(CourseStatus).optional(),
    authorId: z.string().min(1, 'Tác giả là bắt buộc').optional(),
    categoryId: z.string().min(1, 'Danh mục là bắt buộc').optional(),
    level: z.nativeEnum(CourseLevel).optional(),
    info: baseCourseInfo.optional()
  })
})

// Schema query lấy danh sách khóa học
export const getCoursesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Page phải là số').optional().default('1'),
    limit: z.string().regex(/^\d+$/, 'Limit phải là số').optional().default('10'),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    level: z
      .union([
        z.array(z.nativeEnum(CourseLevel)),
        z.string().refine((val) => {
          const values = val.split(',').map((v) => v.trim())
          return values.every((v) => Object.values(CourseLevel).includes(v as CourseLevel))
        }, 'Giá trị level không hợp lệ')
      ])
      .optional(),
    status: z
      .union([
        z.nativeEnum(CourseStatus),
        z.string().refine((val) => {
          const values = val.split(',').map((v) => v.trim())
          return values.every((v) => Object.values(CourseStatus).includes(v as CourseStatus))
        }, 'Giá trị status không hợp lệ'),
        z.array(z.nativeEnum(CourseStatus))
      ])
      .optional(),
    type: z
      .union([
        z.nativeEnum(CourseType),
        z.string().refine((val) => {
          const values = val.split(',').map((v) => v.trim())
          return values.every((v) => Object.values(CourseType).includes(v as CourseType))
        }, 'Giá trị type không hợp lệ'),
        z.array(z.nativeEnum(CourseType))
      ])
      .optional(),
    authorId: z.string().optional(),
    minPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'Giá tối thiểu phải là số')
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'Giá tối đa phải là số')
      .optional(),
    minRating: z
      .string()
      .regex(/^[0-5](\.\d+)?$/, 'Rating phải từ 0 đến 5')
      .optional(),
    sortBy: z
      .enum(['newest', 'popular', 'rating', 'price', 'alphabetical', 'createdAt'])
      .optional()
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  })
})

// Schema lấy khóa học theo ID
export const getCourseByIdSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, 'Course ID là bắt buộc')
  })
})

// Schema lấy khóa học theo slug
export const getCourseBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug khóa học là bắt buộc').trim()
  })
})

// Schema xóa khóa học
export const deleteCourseSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, 'Course ID là bắt buộc')
  })
})

// Schema cập nhật info khóa học
export const updateCourseInfoSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, 'Course ID là bắt buộc')
  }),
  body: baseCourseInfo
})

// Schema xóa nhiều khóa học
export const bulkDeleteSchema = z.object({
  body: z.object({
    courseIds: z.array(z.string().min(1, 'Course ID là bắt buộc')).min(1, 'Phải có ít nhất một course ID')
  })
})

// Schema lấy khóa học liên quan
export const getRelatedCoursesSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, 'Course ID là bắt buộc')
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/, 'Limit phải là số hợp lệ').optional().default('5')
  })
})

// Export type
export type CreateCourseInput = z.infer<typeof createCourseSchema>['body']
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>['body']
export type GetCoursesQuery = z.infer<typeof getCoursesSchema>['query']
