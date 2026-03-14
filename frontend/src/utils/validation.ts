import {
  CourseLevel,
  CourseType,
  CouponType,
  CourseStatus,
  CouponStatus,
  QuizType,
} from "@/shared/constants/enums";
import { DateValue } from "@internationalized/date";

import * as yup from "yup";

const courseSchema = yup.object({
  title: yup
    .string()
    .min(10, "Tên khóa học phải có ít nhất 10 ký tự")
    .required(),
  slug: yup.string().required(),

  price: yup
    .string()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .when("type", {
      is: CourseType.PAID, // alternatively: (val) => val == true
      then: (schema) => schema.required("Giá không được để trống"), // Require validation
      otherwise: (schema) => schema.optional(), // Skip validation
    }),

  old_price: yup.string().optional(),
  type: yup.string().oneOf([CourseType.FREE, CourseType.PAID]).required(),
  intro_url: yup.string().optional(),
  description: yup.string().optional(),
  image: yup.string().optional(),
  category: yup
    .string()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .optional(),
  status: yup
    .string()
    .oneOf([CourseStatus.APPROVED, CourseStatus.PENDING, CourseStatus.REJECTED])
    .required(),

  level: yup
    .string()
    .oneOf([
      CourseLevel.BEGINNER,
      CourseLevel.INTERMEDIATE,
      CourseLevel.ADVANCED,
    ])
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .optional(),
  info: yup.object({
    requirements: yup.array().of(yup.string()).optional(),
    benefits: yup.array().of(yup.string()).optional(),
    techniques: yup.array().of(yup.string()).optional(),
    documents: yup.array().of(yup.string()).optional(),
    qa: yup
      .array()
      .of(
        yup.object({
          question: yup.string().optional(),
          answer: yup.string().optional(),
        }),
      )
      .optional(),
  }),
});

const lessonSchema = yup.object({
  title: yup.string().required(),
  slug: yup.string().optional(),
  duration: yup.string().optional(),
  video_url: yup.string().required(),
  content: yup.string().optional(),
});

const chapterSchema = yup.object({
  title: yup.string().required(),

  order: yup.string().required("Thứ tự không được để trống"),
});

const couponSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  code: yup
    .string()
    .required("Mã giảm giá không được để trống")
    .min(3, "Mã giảm giá phải có ít nhất 3 ký tự")
    .max(10, "Mã giảm giá không được quá 10 ký tự"),
  start_date: yup
    .mixed<DateValue>()
    .required("Ngày bắt đầu không được để trống"),
  // .test(
  //   "is-greater",
  //   "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc",
  //   function (value) {
  //     const { end_date } = this.parent;
  //     if (!end_date) return true;
  //     return (
  //       value &&
  //       end_date &&
  //       new Date(value.toString()).getTime() <=
  //         new Date(end_date.toString()).getTime()
  //     );
  //   },
  // ),

  end_date: yup
    .mixed<DateValue>()
    .required("Ngày kết thúc không được để trống")
    .test(
      "is-greater",
      "Ngày kết thúc phải lớn hoặc bằng ngày bắt đầu",
      function (value) {
        const { start_date } = this.parent;
        if (!start_date) return true;
        return (
          value &&
          start_date &&
          new Date(value.toString()).getTime() >=
            new Date(start_date.toString()).getTime()
        );
      },
    ),
  status: yup
    .string()
    .oneOf([CouponStatus.ACTIVE, CouponStatus.INACTIVE])
    .required(),
  value: yup.string().required("Giá trị giảm giá không được để trống"),
  type: yup
    .string()
    .oneOf(
      [CouponType.FIXED, CouponType.PERCENT],
      "Type phải là FIXED hoặc PERCENT",
    )
    .required("Type là bắt buộc"),
  courses: yup.array(yup.object()).min(1, "Chọn ít nhất 1 khóa học"),
  max_uses: yup.string().required("Số lần sử dụng không được để trống"),
});

const reviewSchema = yup.object({
  star: yup.number().required("Chưa chọn số sao"),
  content: yup.string().required("Nội dung không được để trống"),
});

const categorySchema = yup.object({
  name: yup.string().required("Tên danh mục không được để trống"),
  slug: yup.string().required("Slug không được để trống"),
});

const authSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "Password must match"),
});
const profileSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().optional(),
  // if phone has value, it must be a valid phone number, otherwise it can be empty
  phone: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})$/, {
      message: "Số điện thoại không hợp lệ",
      excludeEmptyString: true,
    })
    .optional(),
  role: yup.string().optional(),
});

const userSchema = yup.object({
  username: yup.string().required("Tên không được để trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  status: yup.string().required("Trạng thái không được để trống"),
  role: yup.string().required("Vai trò không được để trống"),
  courses: yup.array().of(yup.object()).optional(),
});

const quizInfoSchema = yup.object({
  title: yup.string().required("Tiêu đề không được để trống"),
  slug: yup.string().optional(),
  description: yup.string().optional(),
  duration: yup.string().optional(),
  limit: yup.number().optional(),
  passing_grade: yup.number().optional(),
});
const questionSchema = yup.object({
  question: yup.string().required("Câu hỏi không được để trống"),
  options: yup
    .array()
    .of(
      yup.object({
        text: yup.string().required("Câu trả lời không được để trống"),
        is_correct: yup.boolean().required(),
      }),
    )
    .min(1, "Phải có ít nhất 1 câu trả lời")
    .required("Câu trả lời không được để trống"),
  type: yup
    .string()
    .oneOf([
      QuizType.MULTIPLE_CHOICE,
      QuizType.TRUE_FALSE,
      QuizType.FILL_IN_THE_BLANKS,
      QuizType.SINGLE_CHOICE,
    ])
    .required("Type là bắt buộc"),
  point: yup.string().optional(),
  required: yup.boolean(),
});

export type UserSchema = yup.InferType<typeof userSchema>;
export type CategorySchema = yup.InferType<typeof categorySchema>;
export type CouponSchema = yup.InferType<typeof couponSchema>;
export type CourseSchema = yup.InferType<typeof courseSchema>;
export type ChapterSchema = yup.InferType<typeof chapterSchema>;
export type LessonSchema = yup.InferType<typeof lessonSchema>;
export type AuthSchema = yup.InferType<typeof authSchema>;
export type ReviewSchema = yup.InferType<typeof reviewSchema>;

export type ProfileSchema = yup.InferType<typeof profileSchema>;
export type QuizInfoSchema = yup.InferType<typeof quizInfoSchema>;
export type QuestionSchema = yup.InferType<typeof questionSchema>;

export {
  categorySchema,
  chapterSchema,
  couponSchema,
  courseSchema,
  lessonSchema,
  profileSchema,
  reviewSchema,
  userSchema,
  authSchema,
  quizInfoSchema,
  questionSchema,
};
