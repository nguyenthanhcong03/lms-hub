import {
  createChapter,
  deleteChapter,
  getAllChapters,
  updateChapter,
} from "@/shared/services/chapter";
import { TParamsGetChapters } from "@/shared/types/chapter";
import {
  TParamsCreateChapter,
  TParamsEditChapter,
} from "@/shared/types/chapter";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** services

export const getAllChaptersAsync = createAsyncThunk(
  "chapter/get-all",
  async (data: { params: TParamsGetChapters }) => {
    const response = await getAllChapters(data);

    return response;
  },
);
export const createChapterAsync = createAsyncThunk(
  "chapter/create",
  async (data: TParamsCreateChapter) => {
    const response = await createChapter(data);

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

export const updateChapterAsync = createAsyncThunk(
  "chapter/update",
  async (data: TParamsEditChapter) => {
    const response = await updateChapter(data);

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

export const deleteChapterAsync = createAsyncThunk(
  "chapter/delete",
  async (id: string) => {
    const response = await deleteChapter(id);

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
