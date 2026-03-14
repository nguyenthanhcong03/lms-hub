import { API_ENDPOINT } from "../configs/api";
import instanceAxios from "../helpers/axios";

export const getReportMetrics = async () => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.SYSTEM.REPORT.INDEX}/metrics`,
  );

  return res.data;
};

export const getRevenueByMonth = async () => {
  const res = await instanceAxios.get(
    `${API_ENDPOINT.SYSTEM.REPORT.INDEX}/revenue-by-month`,
  );

  return res.data;
};
