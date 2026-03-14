import { API_ENDPOINT } from "@/shared/configs/api";
import instanceAxios from "@/shared/helpers/axios";
import { TParamsGetOrders } from "@/shared/types/order";

export const getAllOrders = async (data: { params: TParamsGetOrders }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`,
    data,
  );

  return res.data;
};

export const getAllOrdersOfMe = async (data: { params: TParamsGetOrders }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me`,
    data,
  );

  return res.data;
};

export const createOrder = async (data: any) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`,
    data,
  );

  return res.data;
};

export const updateOrder = async (data: any) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteOrder = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`,
  );

  return res.data;
};

export const getDetailsOrder = async (id: string) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleOrder = async (data: any) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/delete-many`,
    {
      data,
    },
  );
  return res.data;
};
export const fetchOrderBySlug = async ({ slug }: { slug: string }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${slug}`,
  );
  return res.data;
};
