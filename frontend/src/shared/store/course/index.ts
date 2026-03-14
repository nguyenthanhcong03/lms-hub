// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createCourseAsync,
  deleteCourseAsync,
  deleteMultipleCourseAsync,
  getAllCoursesAsync,
  updateCourseAsync,
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
  courses: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const courseSlice = createSlice({
  name: "course",
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
    // Get all courses
    builder.addCase(getAllCoursesAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllCoursesAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.courses = action.payload.data.courses;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllCoursesAsync.rejected, (state) => {
      state.isLoading = false;
      state.courses = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Create role
    builder.addCase(createCourseAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createCourseAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateCourseAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateCourseAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteCourseAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteCourseAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple courses
    builder.addCase(deleteMultipleCourseAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleCourseAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = courseSlice.actions;
export default courseSlice.reducer;
