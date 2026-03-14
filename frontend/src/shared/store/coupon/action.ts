import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCoupon,
  deleteMultipleCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "@/shared/services/coupon";
import {
  TParamsCreateCoupon,
  TParamsDeleteMultipleCoupon,
  TParamsEditCoupon,
  TParamsGetCoupons,
} from "@/shared/types/coupon";

// ** services

export const getAllCouponsAsync = createAsyncThunk(
  "coupon/get-all",
  async (data: { params: TParamsGetCoupons }) => {
    const response = await getAllCoupons(data);

    return response;
  },
);
export const createCouponAsync = createAsyncThunk(
  "coupon/create",
  async (data: TParamsCreateCoupon) => {
    const response = await createCoupon(data);

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

export const updateCouponAsync = createAsyncThunk(
  "coupon/update",
  async (data: TParamsEditCoupon) => {
    const response = await updateCoupon(data);

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

export const deleteCouponAsync = createAsyncThunk(
  "coupon/delete",
  async (id: string) => {
    const response = await deleteCoupon(id);

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

export const deleteMultipleCouponAsync = createAsyncThunk(
  "coupon/delete-multiple",
  async (data: TParamsDeleteMultipleCoupon) => {
    const response = await deleteMultipleCoupon(data);

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
