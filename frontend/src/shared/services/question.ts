import { API_ENDPOINT } from "../configs/api";
import instanceAxios from "../helpers/axios";

export const getAllQuestionsByLesson = async (data: { params: any }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_LESSON.QUESTION.INDEX}`,
    data,
  );

  return res.data;
};
