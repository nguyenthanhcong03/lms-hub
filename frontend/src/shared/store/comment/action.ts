import {
  createComment,
  deleteComment,
  deleteMultipleComment,
  getAllComments,
  getAllCommentsByLesson,
  getAllReplies,
  updateComment,
} from "@/shared/services/comment";
import {
  TParamsCreateComment,
  TParamsDeleteMultipleComment,
  TParamsEditComment,
  TParamsGetComments,
  TParamsGetReplyComments,
} from "@/shared/types/comment";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ** services

export const getAllCommentsAsync = createAsyncThunk(
  "comment/get-all",
  async (data: { params: TParamsGetComments }) => {
    return await getAllComments(data);
  },
);
export const getAllCommentsByLessonAsync = createAsyncThunk(
  "comment/get-all-by-lesson",
  async (data: { params: TParamsGetComments }) => {
    return await getAllCommentsByLesson(data);
  },
);
export const getAllRepliesAsync = createAsyncThunk(
  "comment/get-all-replies",
  async (data: { params: TParamsGetReplyComments }) => {
    return await getAllReplies(data);
  },
);
export const createCommentAsync = createAsyncThunk(
  "comment/create",
  async (data: TParamsCreateComment) => {
    try {
      return await createComment(data);
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

export const updateCommentAsync = createAsyncThunk(
  "comment/update",
  async (data: TParamsEditComment) => {
    try {
      return await updateComment(data);
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

export const deleteCommentAsync = createAsyncThunk(
  "comment/delete",
  async (id: string) => {
    try {
      return await deleteComment(id);
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

export const deleteMultipleCommentAsync = createAsyncThunk(
  "comment/delete-multiple",
  async (data: TParamsDeleteMultipleComment) => {
    try {
      const response = await deleteMultipleComment(data);

      return response;
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
