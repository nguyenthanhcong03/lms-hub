import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createReview,
  deleteMeReview,
  deleteMultipleReview,
  deleteReview,
  getAllReviews,
  getAllReviewsByCourse,
  updateMeReview,
  updateReview,
} from "@/shared/services/review";
import {
  TParamsCreateReview,
  TParamsDeleteMultipleReview,
  TParamsEditReview,
  TParamsGetReviews,
} from "@/shared/types/review";
import axios from "axios";

// ** services

export const getAllReviewsAsync = createAsyncThunk(
  "review/get-all",
  async (data: { params: TParamsGetReviews }) => {
    return await getAllReviews(data);
  },
);
export const getAllReviewsByCourseAsync = createAsyncThunk(
  "review/get-all-by-course",
  async (data: { params: TParamsGetReviews }) => {
    return await getAllReviewsByCourse(data);
  },
);
export const createReviewAsync = createAsyncThunk(
  "review/create",
  async (data: TParamsCreateReview) => {
    try {
      return await createReview(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null,
          message: error?.response?.data?.message,
          typeError: error?.response?.data?.typeError,
        };
      }
    }
  },
);

export const updateReviewAsync = createAsyncThunk(
  "review/update",
  async (data: TParamsEditReview) => {
    const response = await updateReview(data);

    if (response?.data) {
      return response;
    }

    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError,
    };
  },
);

export const updateMeReviewAsync = createAsyncThunk(
  "review/update-me",
  async (data: TParamsEditReview) => {
    const response = await updateMeReview(data);

    if (response?.data) {
      return response;
    }

    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError,
    };
  },
);

export const deleteMeReviewAsync = createAsyncThunk(
  "review/delete-me",
  async (id: string) => {
    const response = await deleteMeReview(id);

    if (response?.data) {
      return response;
    }

    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError,
    };
  },
);
export const deleteReviewAsync = createAsyncThunk(
  "review/delete",
  async (id: string) => {
    try {
      return await await deleteReview(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null,
          message: error?.response?.data?.message,
          typeError: error?.response?.data?.typeError,
        };
      }
    }
  },
);

export const deleteMultipleReviewAsync = createAsyncThunk(
  "review/delete-multiple",
  async (data: TParamsDeleteMultipleReview) => {
    const response = await deleteMultipleReview(data);

    if (response?.data) {
      return response;
    }

    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError,
    };
  },
);
