// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createChapterAsync,
  deleteChapterAsync,
  getAllChaptersAsync,
  updateChapterAsync,
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
  chapters: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const chapterSlice = createSlice({
  name: "chapter",
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
    // Get all chapters
    builder.addCase(getAllChaptersAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllChaptersAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chapters = action.payload.data.chapters;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllChaptersAsync.rejected, (state) => {
      state.isLoading = false;
      state.chapters = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Create role
    builder.addCase(createChapterAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createChapterAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateChapterAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateChapterAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteChapterAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteChapterAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = chapterSlice.actions;
export default chapterSlice.reducer;
