import { CouponStatus, CouponType } from "@/shared/constants/enums";

export type TParamsGetCoupons = {
  limit?: number | string;
  page?: number | string;
  search?: string;
};

export type TParamsCreateCoupon = {
  title: string;
  code: string;
  start_date: Date;
  end_date: Date;
  status: CouponStatus;
  max_uses: number;
  type: CouponType;
  value: number;
  courses: string[];
};

export interface TParamsEditCoupon extends Partial<TParamsCreateCoupon> {
  id: string;
}

export type TParamsDeleteCoupon = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleCoupon = {
  couponIds: string[];
};

export type Coupon = {
  _id: string;
  title: string;
  code: string;
  start_date: string | null;
  end_date: string | null;
  status: CouponStatus;
  max_uses: number;
  type: CouponType;
  value: number;
  used: number;
  courses?: string[];
  createdAt: string;
  updatedAt: string;
};
