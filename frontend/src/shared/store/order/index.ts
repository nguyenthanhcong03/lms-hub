// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createOrderAsync,
  deleteMultipleOrderAsync,
  deleteOrderAsync,
  getAllOrdersAsync,
  getAllOrdersOfMeAsync,
  updateOrderAsync,
} from "./action";
import { TOrder } from "@/shared/types/order";

type TOrderState = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  typeError: string;
  isSuccessCreateEdit: boolean;
  isErrorCreateEdit: boolean;
  messageErrorCreateEdit: string;
  isSuccessDelete: boolean;
  isErrorDelete: boolean;
  messageErrorDelete: string;
  isSuccessMultipleDelete: boolean;
  isErrorMultipleDelete: boolean;
  messageErrorMultipleDelete: string;
  orders: TOrder[];
  pagination: {
    total_count: number;
    total_pages: number;
  };
};
const initialState: TOrderState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: "",
  typeError: "",
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: "",
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: "",
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: "",
  orders: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetInitialState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = "";
      state.typeError = "";
      state.isSuccessCreateEdit = false;
      state.isErrorCreateEdit = true;
      state.messageErrorCreateEdit = "";
      state.isSuccessDelete = false;
      state.isErrorDelete = true;
      state.messageErrorDelete = "";
      state.isSuccessMultipleDelete = false;
      state.isErrorMultipleDelete = true;
      state.messageErrorMultipleDelete = "";
    },
  },
  extraReducers: (builder) => {
    // Get all orders
    builder.addCase(getAllOrdersAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.data.orders;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllOrdersAsync.rejected, (state) => {
      state.isLoading = false;
      state.orders = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Get all my orders
    builder.addCase(getAllOrdersOfMeAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllOrdersOfMeAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.data.orders;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllOrdersOfMeAsync.rejected, (state) => {
      state.isLoading = false;
      state.orders = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Create role
    builder.addCase(createOrderAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateOrderAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteOrderAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple Orders
    builder.addCase(deleteMultipleOrderAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = OrderSlice.actions;
export default OrderSlice.reducer;
