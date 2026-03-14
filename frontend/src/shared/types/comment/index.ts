import { CommentStatus, ReactionType } from "@/shared/constants/enums";

export type TParamsGetComments = {
  limit?: number | string;
  page?: number | string;
  search?: string;
  lessonId?: string;
};

export type TParamsGetReplyComments = {
  parentId: string;
};

export type TParamsCreateComment = {
  lessonId: string;
  content: string;
  parentId?: string;
  mentions?: string[];
};

export type TParamsEditComment = {
  id: string;
  content: string;
  mentions?: string[];
};

export type TParamsChangeStatusComment = {
  id: string;
  userId: string;
  status: CommentStatus;
};

export type TParamsDeleteComment = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleComment = {
  commentIds: string[];
};

export type TCommentItem = {
  _id: string;
  lessonId: string;
  status: CommentStatus;
  user: { _id: string; username: string; avatar?: string; email?: string };
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  mentions?: string[];
  reactions: TCommentItemWithReaction[];
};

export type TCommentItemWithReaction = {
  _id: string;
  user: string;
  type: ReactionType;
  comment: string;
};

export interface CommentLesson extends TCommentItem {
  replies?: TCommentItem[];
  replies_count?: number;
  is_btn_reply?: boolean;
  is_add_reply?: boolean;
}
export type TCommentFormData = {
  content: string;
  mentions?: string[];
};
