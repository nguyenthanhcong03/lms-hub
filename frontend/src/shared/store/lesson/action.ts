import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "@/shared/services/lesson";
import {
  TParamsCreateLesson,
  TParamsUpdateLesson,
} from "@/shared/types/lesson";

// ** services

export const createLessonAsync = createAsyncThunk(
  "lesson/create",
  async (data: TParamsCreateLesson) => {
    const response = await createLesson(data);

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
export const updateLessonAsync = createAsyncThunk(
  "lesson/update",
  async (data: TParamsUpdateLesson) => {
    const response = await updateLesson(data);

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
export const deleteLessonAsync = createAsyncThunk(
  "lesson/delete",
  async (id: string) => {
    const response = await deleteLesson(id);

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
