import { OrderStatus } from "@/shared/constants/enums";

export type TParamsGetOrders = {
  limit?: number;
  page?: number;
  search?: string;
  order?: string;
};

export type TParamsCreateOrder = {
  title: string;
  slug: string;
  price: number;
  old_price: number;
  intro_url: string;
  description: string;
  image: string;
  status: string;
  level: string;
  views: number;
  info: {
    requirements: string[];
    benefits: string[];
    qa: string[];
  };
};

export type TParamsEditOrder = {
  id: string;
  title?: string;
  slug?: string;
  price?: number;
  old_price?: number;
  intro_url?: string;
  description?: string;
  image?: string;
  status?: string;
  level?: string;
  views?: number;
  info?: {
    requirements?: string[];
    benefits?: string[];
    qa?: string[];
  };
};

export type TParamsDeleteOrder = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleOrder = {
  OrderIds: string[];
};

export type TOrder = {
  _id: string;
  code: string;
  total: number;
  amount: number;
  discount: number;
  course: {
    _id: string;
    title: string;
  };
  user: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  coupon: {
    _id: string;
    code: string;
  };
  status: OrderStatus;
};
