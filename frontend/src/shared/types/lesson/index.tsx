import { LessonType } from "@/shared/constants/enums";
import { QuestionSchema } from "@/utils/validation";

export type Lesson = {
  _id: string;
  title: string;
  slug: string;

  order: number;
  chapter: {
    _id: string;
    title: string;
  };
  type: LessonType;
  course: { _id: string; title: string; slug: string };
  resource: {
    _id: string;
    video_url: string;
    content: string;
    description?: string;
    title: string;
    questions: string[];
    duration: number;
    limit: number;
    passing_grade: number;
  };

  duration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type TParamsCreateLesson = {
  title?: string;
  slug?: string;
  content?: string;
  duration?: number;
  video_url?: string;
  chapterId: string;
  courseId: string;
  type?: LessonType;
  order?: number;
  questions?: QuestionSchema[];
  limit?: number;
  passing_grade?: number;
};

export interface TParamsUpdateLesson extends Partial<TParamsCreateLesson> {
  id: string;
}
