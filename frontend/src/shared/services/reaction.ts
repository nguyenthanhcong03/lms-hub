import { API_ENDPOINT } from "@/shared/configs/api";

import instanceAxios from "@/shared/helpers/axios";
import {
  TParamsCreateReaction,
  TParamsDeleteMultipleReaction,
  TParamsEditReaction,
  TParamsGetReactions,
} from "@/shared/types/reaction";

export const getAllReactions = async (data: {
  params: TParamsGetReactions;
}) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}`,
    data,
  );

  return res.data;
};

export const createReaction = async (data: TParamsCreateReaction) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}`,
    data,
  );

  return res.data;
};

export const updateReaction = async (data: TParamsEditReaction) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteReaction = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}/${id}`,
  );

  return res.data;
};

export const getReaction = async (id: string) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleReaction = async (
  data: TParamsDeleteMultipleReaction,
) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}/delete-many`,
    {
      data,
    },
  );

  return res.data;
};
export const fetchReactionBySlug = async ({ slug }: { slug: string }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.REACTION.INDEX}/${slug}`,
  );
  return res.data;
};
