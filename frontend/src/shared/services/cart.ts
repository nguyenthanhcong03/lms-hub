import { API_ENDPOINT } from "@/shared/configs/api";

import instanceAxios from "@/shared/helpers/axios";
import {
  TParamsCreateCart,
  TParamsDeleteMultipleCart,
  TParamsEditCart,
} from "@/shared/types/cart";

export const addItemToCart = async (data: TParamsCreateCart) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_CART.CART.INDEX}`,
    data,
  );
  return res.data;
};

export const updateCart = async (data: TParamsEditCart) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_CART.CART.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const removeItemFromCart = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_CART.CART.INDEX}/${id}`,
  );

  return res.data;
};

export const getCartByUser = async () => {
  const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_CART.CART.INDEX}`);

  return res.data;
};

export const deleteMultipleCart = async (data: TParamsDeleteMultipleCart) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_CART.CART.INDEX}/delete-many`,
    {
      data,
    },
  );

  return res.data;
};
export const fetchCartBySlug = async ({ slug }: { slug: string }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_CART.CART.INDEX}/${slug}`,
  );

  return res.data;
};
