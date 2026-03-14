import { API_ENDPOINT } from "@/shared/configs/api";

import instanceAxios from "@/shared/helpers/axios";
import {
  TParamsChangeStatusComment,
  TParamsCreateComment,
  TParamsDeleteMultipleComment,
  TParamsEditComment,
  TParamsGetComments,
  TParamsGetReplyComments,
} from "@/shared/types/comment";

export const getAllComments = async (data: { params: TParamsGetComments }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}`,
    data,
  );

  return res.data;
};
export const getAllCommentsByLesson = async (data: {
  params: TParamsGetComments;
}) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/lesson`,
    data,
  );

  return res.data;
};

export const getAllReplies = async (data: {
  params: TParamsGetReplyComments;
}) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/replies`,
    data,
  );

  return res.data;
};

export const createComment = async (data: TParamsCreateComment) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}`,
    data,
  );

  return res.data;
};

export const updateComment = async (data: TParamsEditComment) => {
  const { id, ...rests } = data;

  try {
    const res = await instanceAxios.put(
      `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/${id}`,
      rests,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
export const changeStatusComment = async (data: TParamsChangeStatusComment) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/change-status/${id}`,
    rests,
  );

  return res.data;
};

export const deleteComment = async (id: string) => {
  try {
    const res = await instanceAxios.delete(
      `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getComment = async (id: string) => {
  try {
    const res = await instanceAxios.get(
      `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteMultipleComment = async (
  data: TParamsDeleteMultipleComment,
) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_LESSON.COMMENT.INDEX}/delete-many`,
    {
      data,
    },
  );

  return res.data;
};
