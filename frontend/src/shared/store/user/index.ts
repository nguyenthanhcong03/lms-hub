// ** Redux Imports

import { createSlice } from "@reduxjs/toolkit";

// ** Axios Imports

import { deleteUserAsync, getAllUsersAsync, updateUserAsync } from "./action";

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
  users: [],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const UserSlice = createSlice({
  name: "user",
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
    // Get all Users
    builder.addCase(getAllUsersAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllUsersAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload.data.users;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllUsersAsync.rejected, (state) => {
      state.isLoading = false;
      state.users = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Update role
    builder.addCase(updateUserAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteUserAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const { resetInitialState } = UserSlice.actions;
export default UserSlice.reducer;
