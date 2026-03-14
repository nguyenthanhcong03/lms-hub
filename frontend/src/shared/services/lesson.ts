import { API_ENDPOINT } from "@/shared/configs/api";
import instanceAxios from "@/shared/helpers/axios";
import { TParamsCreateLesson, TParamsUpdateLesson } from "../types/lesson";

export const createLesson = async (data: TParamsCreateLesson) => {
  try {
    const res = await instanceAxios.post(
      `${API_ENDPOINT.MANAGE_LESSON.LESSON.INDEX}`,
      data,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getLesson = async (id: string) => {
  try {
    const res = await instanceAxios.get(
      `${API_ENDPOINT.MANAGE_LESSON.LESSON.INDEX}/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
export const getLessonByAdmin = async (id: string) => {
  try {
    const res = await instanceAxios.get(
      `${API_ENDPOINT.MANAGE_LESSON.LESSON.INDEX}/${id}/admin`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateLesson = async (data: TParamsUpdateLesson) => {
  const { id, ...rests } = data;

  try {
    const res = await instanceAxios.put(
      `${API_ENDPOINT.MANAGE_LESSON.LESSON.INDEX}/${id}`,
      rests,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteLesson = async (id: string) => {
  try {
    const res = await instanceAxios.delete(
      `${API_ENDPOINT.MANAGE_LESSON.LESSON.INDEX}/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
