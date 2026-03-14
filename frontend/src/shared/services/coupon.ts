import { API_ENDPOINT } from "@/shared/configs/api";
import axios from "axios";

import {
  TParamsCreateCoupon,
  TParamsDeleteMultipleCoupon,
  TParamsEditCoupon,
  TParamsGetCoupons,
} from "@/shared/types/coupon";
import instanceAxios from "@/shared/helpers/axios";

export const getAllCoupons = async (data: { params: TParamsGetCoupons }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}`,
    data,
  );

  return res.data;
};

export const createCoupon = async (data: TParamsCreateCoupon) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}`,
    data,
  );

  return res.data;
};

export const updateCoupon = async (data: TParamsEditCoupon) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteCoupon = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}/${id}`,
  );

  return res.data;
};

export const applyCoupon = async (data: { code: string; courseId: string }) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}/apply`,
    data,
  );

  return res.data;
};

export const getCoupon = async (id: string) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleCoupon = async (
  data: TParamsDeleteMultipleCoupon,
) => {
  const res = await axios.delete(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}/delete-many`,
    {
      data,
    },
  );
  return res.data;
};
export const fetchCouponBySlug = async ({ slug }: { slug: string }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COUPON.COUPON.INDEX}/${slug}`,
  );
  return res.data;
};
