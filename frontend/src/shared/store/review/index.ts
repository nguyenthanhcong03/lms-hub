// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import {
  createReviewAsync,
  deleteMeReviewAsync,
  deleteMultipleReviewAsync,
  deleteReviewAsync,
  getAllReviewsAsync,
  getAllReviewsByCourseAsync,
  updateMeReviewAsync,
  updateReviewAsync,
} from "./action";
import { TReviewItem } from "@/shared/types/review";

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
  reviews: [] as TReviewItem[],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
  rating_distribution: [] as { star: number; count: number }[],
  average_rating: 0,
};

export const ReviewSlice = createSlice({
  name: "review",
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
    setReviews(state, action) {
      state.reviews = action.payload;
    },
    addReviewState(state, action) {
      state.reviews.unshift(action.payload);
    },
    deleteReviewState(state, action) {
      const index = state.reviews.findIndex(
        (item) => item._id === action.payload,
      );
      if (index !== -1) {
        state.reviews.splice(index, 1);
      }
    },
    updateReviewState(state, action) {
      const index = state.reviews.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (index !== -1) {
        state.reviews[index] = { ...state.reviews[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Get all Reviews
    builder.addCase(getAllReviewsAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllReviewsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload.data.reviews;
      state.pagination = action.payload.data.pagination;
      state.rating_distribution = action.payload.data.rating_distribution;
      state.average_rating = action.payload.data.average_rating;
    });

    builder.addCase(getAllReviewsAsync.rejected, (state) => {
      state.isLoading = false;
      state.reviews = [];

      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
      state.rating_distribution = [];
      state.average_rating = 0;
    });

    // Get all reviews by course
    builder.addCase(getAllReviewsByCourseAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllReviewsByCourseAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload.data.reviews;

      state.pagination = action.payload.data.pagination;
      state.rating_distribution = action.payload.data.rating_distribution;
      state.average_rating = action.payload.data.average_rating;
    });

    builder.addCase(getAllReviewsByCourseAsync.rejected, (state) => {
      state.isLoading = false;
      state.reviews = [];

      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
      state.rating_distribution = [];
      state.average_rating = 0;
    });

    // Create role
    builder.addCase(createReviewAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update review
    builder.addCase(updateReviewAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update me review
    builder.addCase(updateMeReviewAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateMeReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteReviewAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    builder.addCase(deleteMeReviewAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMeReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple Reviews
    builder.addCase(deleteMultipleReviewAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const {
  resetInitialState,
  setReviews,
  addReviewState,
  deleteReviewState,
  updateReviewState,
} = ReviewSlice.actions;
export default ReviewSlice.reducer;
