import { API_ENDPOINT } from "@/shared/configs/api";
import axios from "axios";

import instanceAxios from "@/shared/helpers/axios";
import {
  TParamsDeleteMultipleQuiz,
  TParamsEditQuiz,
  TParamsGetQuizzes,
} from "../types/quiz";

export const getAllQuizzes = async (data: { params: TParamsGetQuizzes }) => {
  const res = await axios.get(`${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}`, data);

  return res.data;
};

export const createQuiz = async (data: any) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}`,
    data,
  );

  return res.data;
};

export const updateQuiz = async (data: TParamsEditQuiz) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteQuiz = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}/${id}`,
  );

  return res.data;
};

export const getQuiz = async (id: string) => {
  const res = await axios.get(`${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}/${id}`);

  return res.data;
};

export const deleteMultipleQuiz = async (data: TParamsDeleteMultipleQuiz) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}/delete-many`,
    {
      data,
    },
  );
  return res.data;
};
export const fetchQuizBySlug = async ({ slug }: { slug: string }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ.INDEX}/${slug}`,
  );

  return res.data;
};
