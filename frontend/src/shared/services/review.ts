import { API_ENDPOINT } from "@/shared/configs/api";
import axios from "axios";

import {
  TParamsChangeStatusReview,
  TParamsCreateReview,
  TParamsDeleteMultipleReview,
  TParamsEditReview,
  TParamsGetReviews,
} from "@/shared/types/review";
import instanceAxios from "@/shared/helpers/axios";

export const getAllReviews = async (data: { params: TParamsGetReviews }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}`,
    data,
  );

  return res.data;
};
export const getAllReviewsByCourse = async (data: {
  params: TParamsGetReviews;
}) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/course`,
    data,
  );

  return res.data;
};

export const createReview = async (data: TParamsCreateReview) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}`,
    data,
  );

  return res.data;
};

export const updateReview = async (data: TParamsEditReview) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/${id}`,
    rests,
  );

  return res.data;
};
export const changeStatusReview = async (data: TParamsChangeStatusReview) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/change-status/${id}`,
    rests,
  );

  return res.data;
};
export const updateMeReview = async (data: TParamsEditReview) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/me/${id}`,
    rests,
  );

  return res.data;
};

export const deleteMeReview = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/me/${id}`,
  );

  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/${id}`,
  );

  return res.data;
};

export const getReview = async (id: string) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleReview = async (
  data: TParamsDeleteMultipleReview,
) => {
  const res = await axios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/delete-many`,
    {
      data,
    },
  );

  return res.data;
};
export const fetchReviewBySlug = async ({ slug }: { slug: string }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.REVIEW.INDEX}/${slug}`,
  );

  return res.data;
};
