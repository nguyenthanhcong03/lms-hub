// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createCategoryAsync,
  deleteMultipleCategoryAsync,
  deleteCategoryAsync,
  getAllCategoriesAsync,
  updateCategoryAsync,
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
  categories: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const categorySlice = createSlice({
  name: "category",
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
    builder.addCase(getAllCategoriesAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload.data.categories;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllCategoriesAsync.rejected, (state) => {
      state.isLoading = false;
      state.categories = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Create role
    builder.addCase(createCategoryAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createCategoryAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateCategoryAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateCategoryAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteCategoryAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteCategoryAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple categories
    builder.addCase(deleteMultipleCategoryAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleCategoryAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = categorySlice.actions;
export default categorySlice.reducer;
