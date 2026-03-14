import { TCourseItem } from "../course";

export type TParamsGetCarts = {
  limit?: number;
  page?: number;
  search?: string;
  order?: string;
};

export type TParamsCreateCart = {
  courseId: string;
  quantity: number;
  price: number;
};

export type TParamsEditCart = {
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

export type TParamsDeleteCart = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleCart = {
  cartIds: string[];
};

export type TCart = {
  user: {
    _id: string;
    email: string;
  };
  total_price: number;
  items: TCartItem[];
};

export type TCartItem = {
  _id: string;
  cart: string;
  course: TCourseItem;
};
