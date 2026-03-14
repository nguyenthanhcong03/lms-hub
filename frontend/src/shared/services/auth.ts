// ** Config
import { API_ENDPOINT } from "@/shared/configs/api";
import instanceAxios from "@/shared/helpers/axios";
import axios from "axios";

// ** Types

export const loginAuth = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data);

  return res.data;
};

export const logoutAuth = async () => {
  const res = await instanceAxios.post(`${API_ENDPOINT.AUTH.INDEX}/logout`);

  return res.data;
};

export const registerAuth = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register`, data);

  return res.data;
};
export const getAuthMe = async () => {
  const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.INDEX}/me`);

  return res.data;
};
export const updateAuthMe = async (data: any) => {
  const res = await instanceAxios.put(`${API_ENDPOINT.AUTH.INDEX}/me`, data);

  return res.data;
};
export const changePasswordMe = async (data: any) => {
  const res = await instanceAxios.patch(
    `${API_ENDPOINT.AUTH.INDEX}/change-password`,
    data,
  );

  return res.data;
};

export const refreshTokenAuth = async (refreshToken: string) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/refresh-token`, {
    refreshToken,
  });

  return res.data;
};
