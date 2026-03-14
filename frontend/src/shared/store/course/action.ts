import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCourse,
  deleteMultipleCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "@/shared/services/course";
import {
  TParamsCreateCourse,
  TParamsDeleteMultipleCourse,
  TParamsEditCourse,
  TParamsGetCourses,
} from "@/shared/types/course";

// ** services

export const getAllCoursesAsync = createAsyncThunk(
  "course/get-all",
  async (data: { params: TParamsGetCourses }) => {
    const response = await getAllCourses(data);

    return response;
  },
);
export const createCourseAsync = createAsyncThunk(
  "course/create",
  async (data: TParamsCreateCourse) => {
    const response = await createCourse(data);

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

export const updateCourseAsync = createAsyncThunk(
  "course/update",
  async (data: TParamsEditCourse) => {
    const response = await updateCourse(data);

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

export const deleteCourseAsync = createAsyncThunk(
  "course/delete",
  async (id: string) => {
    const response = await deleteCourse(id);

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

export const deleteMultipleCourseAsync = createAsyncThunk(
  "course/delete-multiple",
  async (data: TParamsDeleteMultipleCourse) => {
    const response = await deleteMultipleCourse(data);

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
