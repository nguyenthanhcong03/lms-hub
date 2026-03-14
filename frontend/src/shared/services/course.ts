import { API_ENDPOINT } from "@/shared/configs/api";
import axios from "axios";

import {
  TParamsCreateCourse,
  TParamsDeleteMultipleCourse,
  TParamsEditCourse,
  TParamsGetCourses,
} from "@/shared/types/course";
import instanceAxios from "@/shared/helpers/axios";

export const getAllCourses = async (data: { params: TParamsGetCourses }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}`,
    data,
  );

  return res.data;
};

export const getAllPublicCourses = async (data: {
  params: TParamsGetCourses;
}) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/public`,
    data,
  );

  return res.data;
};

export const getAllMyCourses = async () => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/me`,
  );

  return res.data;
};

export const createCourse = async (data: TParamsCreateCourse) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}`,
    data,
  );

  return res.data;
};
export const searchCourses = async (data: { params: TParamsGetCourses }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/search`,
    data,
  );

  return res.data;
};
export const updateCourse = async (data: TParamsEditCourse) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteCourse = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/${id}`,
  );

  return res.data;
};

export const getDetailsCourse = async (id: string) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/detail/${id}`,
  );

  return res.data;
};

export const deleteMultipleCourse = async (
  data: TParamsDeleteMultipleCourse,
) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/delete-many`,
    {
      data,
    },
  );
  return res.data;
};
export const fetchCourseBySlug = async (slug: string) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/${slug}`,
  );

  return res.data;
};

export const updateCourseView = async (slug: string) => {
  const res = await axios.put(
    `${API_ENDPOINT.MANAGE_COURSE.COURSE.INDEX}/${slug}/view`,
  );

  return res.data;
};
