import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTrack,
  deleteMultipleTrack,
  deleteTrack,
  getAllTracks,
  updateTrack,
} from "@/shared/services/track";
import {
  TParamsCreateTrack,
  TParamsDeleteMultipleTrack,
  TParamsEditTrack,
  TParamsGetTracks,
} from "@/shared/types/track";

// ** services

export const getAllTracksAsync = createAsyncThunk(
  "track/get-all",
  async (data: { params: TParamsGetTracks }) => {
    const response = await getAllTracks(data);

    return response;
  },
);
export const createTrackAsync = createAsyncThunk(
  "track/create",
  async (data: TParamsCreateTrack) => {
    const response = await createTrack(data);

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

export const updateTrackAsync = createAsyncThunk(
  "track/update",
  async (data: TParamsEditTrack) => {
    const response = await updateTrack(data);

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

export const deleteTrackAsync = createAsyncThunk(
  "track/delete",
  async (id: string) => {
    const response = await deleteTrack(id);

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

export const deleteMultipleTrackAsync = createAsyncThunk(
  "track/delete-multiple",
  async (data: TParamsDeleteMultipleTrack) => {
    const response = await deleteMultipleTrack(data);

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
