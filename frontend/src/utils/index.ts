import axios from "axios";

const createUrlQuery = (name: string, value: string) => {
  const params = new URLSearchParams();

  params.set(name, value);
  return params.toString();
};
export const formatThousand = (num: number): string => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatPrice = (price: string) => {
  return Number(price.replace(/,/g, ""));
};
export const getAxiosErrorMessage = (
  error: unknown,
  message?: string,
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || message;
  }
  return "An unknown error occurred";
};

export { createUrlQuery };
