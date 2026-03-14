import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createCategory,
  deleteCategory,
  deleteMultipleCategory,
  getAllCategories,
  updateCategory,
} from "@/shared/services/category";
import axios from "axios";
import {
  TParamsCreateCategory,
  TParamsDeleteMultipleCategory,
  TParamsEditCategory,
  TParamsGetCategories,
} from "@/shared/types/category";

// ** services

export const getAllCategoriesAsync = createAsyncThunk(
  "category/get-all",
  async (data: { params: TParamsGetCategories }) => {
    return await getAllCategories(data);
  },
);
export const createCategoryAsync = createAsyncThunk(
  "category/create",
  async (data: TParamsCreateCategory) => {
    try {
      return await createCategory(data);
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

export const updateCategoryAsync = createAsyncThunk(
  "category/update",
  async (data: TParamsEditCategory) => {
    try {
      return await updateCategory(data);
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

export const deleteCategoryAsync = createAsyncThunk(
  "category/delete",
  async (id: string) => {
    try {
      return await deleteCategory(id);
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

export const deleteMultipleCategoryAsync = createAsyncThunk(
  "category/delete-multiple",
  async (data: TParamsDeleteMultipleCategory) => {
    try {
      return await deleteMultipleCategory(data);
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
