import { ReviewStatus } from "@/shared/constants/enums";

export type TParamsGetReviews = {
  limit?: number;
  page?: number;
  search?: string;
  courseId?: string;
  status?: ReviewStatus;
};

export type TParamsCreateReview = {
  courseId: string;
  content: string;
  star: number;
};

export type TParamsEditReview = {
  id: string;
  courseId: string;
  content: string;
  star: number;
};
export type TParamsChangeStatusReview = {
  id: string;
  userId: string;
  status: ReviewStatus;
};

export type TParamsDeleteReview = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleReview = {
  reviewIds: string[];
};

export type TReviewItem = {
  _id: string;
  course: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  status: ReviewStatus;
  content: string;
  star: number;
  createdAt: string;
  updatedAt: string;
};
