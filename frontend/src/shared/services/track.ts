import { API_ENDPOINT } from "@/shared/configs/api";
import axios from "axios";

import {
  TParamsCreateTrack,
  TParamsDeleteMultipleTrack,
  TParamsEditTrack,
  TParamsGetTracks,
} from "@/shared/types/track";
import instanceAxios from "@/shared/helpers/axios";

export const getAllTracks = async (data: { params: TParamsGetTracks }) => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}`,
    data,
  );

  return res.data;
};

export const createTrack = async (data: TParamsCreateTrack) => {
  const res = await instanceAxios.post(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}`,
    data,
  );

  return res.data;
};

export const updateTrack = async (data: TParamsEditTrack) => {
  const { id, ...rests } = data;

  const res = await axios.put(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}/${id}`,
    rests,
  );

  return res.data;
};

export const deleteTrack = async (id: string) => {
  const res = await axios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}/${id}`,
  );

  return res.data;
};

export const getTrack = async (id: string) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}/${id}`,
  );

  return res.data;
};

export const deleteMultipleTrack = async (data: TParamsDeleteMultipleTrack) => {
  const res = await axios.delete(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}/delete-many`,
    {
      data,
    },
  );

  return res.data;
};
export const fetchTrackBySlug = async ({ slug }: { slug: string }) => {
  const res = await axios.get(
    `${API_ENDPOINT.MANAGE_COURSE.TRACK.INDEX}/${slug}`,
  );

  return res.data;
};
