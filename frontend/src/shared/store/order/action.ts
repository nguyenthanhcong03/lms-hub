import {
  createOrder,
  deleteMultipleOrder,
  deleteOrder,
  getAllOrders,
  getAllOrdersOfMe,
  updateOrder,
} from "@/shared/services/order";
import {
  TParamsDeleteMultipleOrder,
  TParamsEditOrder,
  TParamsGetOrders,
} from "@/shared/types/order";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** services

export const getAllOrdersAsync = createAsyncThunk(
  "order/get-all",
  async (data: { params: TParamsGetOrders }) => {
    const response = await getAllOrders(data);

    return response;
  },
);

export const getAllOrdersOfMeAsync = createAsyncThunk(
  "order/get-all-of-me",
  async (data: { params: TParamsGetOrders }) => {
    const response = await getAllOrdersOfMe(data);

    return response;
  },
);
export const createOrderAsync = createAsyncThunk(
  "order/create",
  async (data: TParamsGetOrders) => {
    const response = await createOrder(data);

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

export const updateOrderAsync = createAsyncThunk(
  "order/update",
  async (data: TParamsEditOrder) => {
    const response = await updateOrder(data);

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

export const deleteOrderAsync = createAsyncThunk(
  "order/delete",
  async (id: string) => {
    const response = await deleteOrder(id);

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

export const deleteMultipleOrderAsync = createAsyncThunk(
  "order/delete-multiple",
  async (data: TParamsDeleteMultipleOrder) => {
    const response = await deleteMultipleOrder(data);

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
