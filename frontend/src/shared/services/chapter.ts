import { API_ENDPOINT } from "@/shared/configs/api";
import instanceAxios from "@/shared/helpers/axios";
import {
  TParamsCreateChapter,
  TParamsEditChapter,
  TParamsGetChapters,
} from "@/shared/types/chapter";

export const getAllChapters = async (data: { params: TParamsGetChapters }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_CHAPTER.CHAPTER.INDEX}`,
    data,
  );

  return res.data;
};
export const getChapter = async (id: string) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_CHAPTER.CHAPTER.INDEX}/${id}`,
  );

  return res.data;
};

export const createChapter = async (data: TParamsCreateChapter) => {
  try {
    const res = await instanceAxios.post(
      `${API_ENDPOINT.MANAGE_CHAPTER.CHAPTER.INDEX}`,
      data,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateChapter = async (data: TParamsEditChapter) => {
  const { id, ...rests } = data;

  try {
    const res = await instanceAxios.put(
      `${API_ENDPOINT.MANAGE_CHAPTER.CHAPTER.INDEX}/${id}`,
      rests,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
export const deleteChapter = async (id: string) => {
  try {
    const res = await instanceAxios.delete(
      `${API_ENDPOINT.MANAGE_CHAPTER.CHAPTER.INDEX}/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
