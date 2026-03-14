import { ReactionType } from "@/shared/constants/enums";

export type TParamsGetReactions = {
  commentId: string;
  type: ReactionType | string;
};

export type TParamsGetReplyReactions = {
  parentId: string;
};

export type TParamsCreateReaction = {
  commentId: string;
  type: ReactionType;
};

export type TParamsEditReaction = {
  id: string;
  content: string;
  lessonId: string;
  parentId?: string;
  mentions?: string[];
};

export type TParamsDeleteReaction = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleReaction = {
  reactionIds: string[];
};

export interface TReactionItem {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };

  comment: string;
  type: ReactionType;
}
