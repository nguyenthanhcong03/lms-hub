// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createCouponAsync,
  deleteMultipleCouponAsync,
  deleteCouponAsync,
  getAllCouponsAsync,
  updateCouponAsync,
} from "./action";

const initialState = {
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
  coupons: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const couponSlice = createSlice({
  name: "coupon",
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
    // Get all coupons
    builder.addCase(getAllCouponsAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllCouponsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = action.payload.data.coupons;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllCouponsAsync.rejected, (state) => {
      state.isLoading = false;
      state.coupons = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Create role
    builder.addCase(createCouponAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createCouponAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateCouponAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateCouponAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteCouponAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteCouponAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple coupons
    builder.addCase(deleteMultipleCouponAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleCouponAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = couponSlice.actions;
export default couponSlice.reducer;
