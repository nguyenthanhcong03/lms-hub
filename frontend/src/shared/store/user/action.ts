import {
  deleteMultipleUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "@/shared/services/user";
import {
  TParamsDeleteMultipleUser,
  TParamsEditUser,
  TParamsGetUsers,
} from "@/shared/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** services

export const getAllUsersAsync = createAsyncThunk(
  "user/get-all",
  async (data: { params: TParamsGetUsers }) => {
    const response = await getAllUsers(data);

    return response;
  },
);

export const updateUserAsync = createAsyncThunk(
  "user/update",
  async (data: TParamsEditUser) => {
    const response = await updateUser(data);

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

export const deleteUserAsync = createAsyncThunk(
  "user/delete",
  async (id: string) => {
    const response = await deleteUser(id);

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

export const deleteMultipleUserAsync = createAsyncThunk(
  "user/delete-multiple",
  async (data: TParamsDeleteMultipleUser) => {
    const response = await deleteMultipleUser(data);

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
