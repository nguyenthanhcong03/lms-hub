import { API_ENDPOINT } from "@/shared/configs/api";
import axios from "axios";

import {
  TParamsCreateCategory,
  TParamsDeleteMultipleCategory,
  TParamsEditCategory,
  TParamsGetCategories,
} from "../types/category";
import instanceAxios from "@/shared/helpers/axios";

export const getAllCategories = async (data: {
  params: TParamsGetCategories;
}) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}`,
    data,
  );

  return res.data;
};

export const createCategory = async (data: TParamsCreateCategory) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}`,
    data,
  );

  return res.data;
};

export const updateCategory = async (data: TParamsEditCategory) => {
  const { id, ...rests } = data;

  const res = await instanceAxios.put(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}/${id}`,
  );

  return res.data;
};

export const getCategory = async (id: string) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleCategory = async (
  data: TParamsDeleteMultipleCategory,
) => {
  const res = await instanceAxios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}/delete-many`,
    {
      data,
    },
  );
  return res.data;
};
export const fetchCategoryBySlug = async ({ slug }: { slug: string }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.CATEGORY.INDEX}/${slug}`,
  );

  return res.data;
};
