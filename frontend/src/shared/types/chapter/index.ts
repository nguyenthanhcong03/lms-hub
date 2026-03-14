import { LessonType } from "@/shared/constants/enums";

export type TParamsGetChapters = {
  limit?: number;
  page?: number;
  search?: string;
  order?: string;
  courseId?: string;
};

export type TParamsCreateChapter = {
  title: string;
  course: string;
  order: number;
};

export interface TParamsEditChapter extends Partial<TParamsCreateChapter> {
  id: string;
}
export type TParamsDeleteChapter = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleChapter = {
  chapterIds: string[];
};

export type Chapter = {
  _id: string;
  title: string;
  slug: string;
  order: number;
  course: { _id: string; title: string; slug: string };
  lessons: ChapterLesson[];
  createdAt: string;
  updatedAt: string;
};

export type ChapterLesson = {
  _id: string;
  title: string;
  slug: string;
  chapter: string;
  course: string;
  duration: number;
  type: LessonType;
};
