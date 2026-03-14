import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteMultipleCart,
  getCartByUser,
  removeItemFromCart,
  updateCart,
} from "@/shared/services/cart";
import {
  TParamsDeleteMultipleCart,
  TParamsEditCart,
} from "@/shared/types/cart";
import axios from "axios";

// ** services

export const getCartByUserAsync = createAsyncThunk(
  "cart/get-by-user",
  async () => {
    return await getCartByUser();
  },
);

export const updateCartAsync = createAsyncThunk(
  "cart/update",
  async (data: TParamsEditCart) => {
    try {
      return await updateCart(data);
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

export const removeItemFromCartAsync = createAsyncThunk(
  "cart/delete",
  async (id: string) => {
    try {
      return await removeItemFromCart(id);
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

export const deleteMultipleCartAsync = createAsyncThunk(
  "cart/delete-multiple",
  async (data: TParamsDeleteMultipleCart) => {
    try {
      return await deleteMultipleCart(data);
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
