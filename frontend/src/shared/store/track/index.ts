// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createTrackAsync,
  deleteMultipleTrackAsync,
  deleteTrackAsync,
  getAllTracksAsync,
  updateTrackAsync,
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
  result: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const TrackSlice = createSlice({
  name: "track",
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
    // Get all Tracks
    builder.addCase(getAllTracksAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllTracksAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.result = action.payload.data.result;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllTracksAsync.rejected, (state) => {
      state.isLoading = false;
      state.result = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Create role
    builder.addCase(createTrackAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createTrackAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateTrackAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateTrackAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteTrackAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteTrackAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple Tracks
    builder.addCase(deleteMultipleTrackAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleTrackAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = TrackSlice.actions;
export default TrackSlice.reducer;
