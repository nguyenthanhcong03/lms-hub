import { API_ENDPOINT } from "@/shared/configs/api";

import instanceAxios from "@/shared/helpers/axios";
import {
  TParamsDeleteMultipleUser,
  TParamsEditUser,
  TParamsGetUsers,
} from "@/shared/types/user";

export const getAllUsers = async (data: { params: TParamsGetUsers }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.SYSTEM.USER.INDEX}`,
    data,
  );

  return res.data;
};

export const updateUser = async (data: TParamsEditUser) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`,
  );

  return res.data;
};

export const getUserInfo = async (id: string) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleUser = async (data: TParamsDeleteMultipleUser) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.SYSTEM.USER.INDEX}/delete-many`,
    {
      data,
    },
  );
  return res.data;
};
