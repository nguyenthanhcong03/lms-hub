import {
  CourseLevel,
  CourseStatus,
  CourseType,
} from "@/shared/constants/enums";
import { Chapter } from "../chapter";

export type TParamsGetCourses = {
  limit?: number;
  page?: number;
  search?: string;
};

export type TParamsCreateCourse = {
  title: string;
  slug: string;
  price?: number;
  old_price?: number;
  intro_url?: string;
  description?: string;
  image?: string;
  type: CourseType;
  status: CourseStatus;
  level?: CourseLevel;
  info?: {
    requirements: string[];
    benefits: string[];
    techniques: string[];
    documents: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
};

export interface TParamsEditCourse extends Partial<TParamsCreateCourse> {
  id: string;
}

export type TParamsDeleteCourse = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleCourse = {
  courseIds: string[];
};

export type TCourseItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  old_price: number;
  intro_url: string;
  description: string;
  image: string;
  status: CourseStatus;
  level: CourseLevel;
  view: number;
  sold: number;
  total_user: number;
  total_duration: number;
  total_lesson: number;
  chapters: Chapter[];
  total_review?: number;
  total_completed?: number;
  average_star?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  type: CourseType;
  info: {
    requirements: string[];
    benefits: string[];
    qa: string[];
    techniques: string[];
    documents: string[];
  };
  createdAt: string;
  updatedAt: string;
};
