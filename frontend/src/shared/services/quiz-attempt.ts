import { API_ENDPOINT } from "../configs/api";
import instanceAxios from "../helpers/axios";

export const updateQuizAttempt = async (data: any) => {
  const { id, ...rests } = data;
  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ_ATTEMPT.INDEX}/${id}`,
    rests,
  );

  return res.data;
};
export const createQuizAttempt = async (data: any) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ_ATTEMPT.INDEX}`,
    data,
  );

  return res.data;
};

export const getAllQuizAttemptsByUser = async (data: { params: any }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ_ATTEMPT.INDEX}`,
    data,
  );

  return res.data;
};

export const getQuizAttemptDetails = async (id: string) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ_ATTEMPT.INDEX}/${id}`,
  );
  return res.data;
};
export const getQuizAttemptEndTime = async (data: { params: any }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.QUIZ_ATTEMPT.INDEX}/end-time`,
    data,
  );
  return res.data;
};
