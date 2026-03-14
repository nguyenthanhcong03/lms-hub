// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import { getCartByUserAsync } from "./action";
import { TCart } from "@/shared/types/cart";

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
  result: null as TCart | null,
};

export const cartSlice = createSlice({
  name: "cart",
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
    // Get all categories
    builder.addCase(getCartByUserAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getCartByUserAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.result = action.payload.data;
    });

    builder.addCase(getCartByUserAsync.rejected, (state) => {
      state.isLoading = false;
      state.result = null;
    });

    // // Create role
    // builder.addCase(createCartAsync.pending, (state) => {
    // 	state.isLoading = true;
    // });

    // builder.addCase(createCartAsync.fulfilled, (state, action) => {
    // 	state.isLoading = false;
    // 	state.isSuccessCreateEdit = !!action.payload?.data?._id;
    // 	state.isErrorCreateEdit = !action.payload?.data?._id;
    // 	state.messageErrorCreateEdit = action.payload?.message;
    // 	state.typeError = action.payload?.typeError;
    // });

    // // Update role
    // builder.addCase(updateCartAsync.pending, (state) => {
    // 	state.isLoading = true;
    // });

    // builder.addCase(updateCartAsync.fulfilled, (state, action) => {
    // 	state.isLoading = false;
    // 	state.isSuccessCreateEdit = !!action.payload?.data?._id;
    // 	state.isErrorCreateEdit = !action.payload?.data?._id;
    // 	state.messageErrorCreateEdit = action.payload?.message;
    // 	state.typeError = action.payload?.typeError;
    // });

    // Delete multiple categories
    // builder.addCase(deleteMultipleCartAsync.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(deleteMultipleCartAsync.fulfilled, (state, action) => {
    // 	state.isLoading = false;
    // 	state.isSuccessMultipleDelete = !!action.payload?.data;
    // 	state.isErrorMultipleDelete = !action.payload?.data;
    // 	state.messageErrorMultipleDelete = action.payload?.message;
    // 	state.typeError = action.payload?.typeError;
    // });
  },
});

export const { resetInitialState } = cartSlice.actions;
export default cartSlice.reducer;
