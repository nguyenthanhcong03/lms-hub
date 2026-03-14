import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
export const formatFilter = (
  filter: Record<string, string | string[] | number>,
) => {
  const result: Record<string, string | string[] | number> = {};
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key]?.length > 0) {
      result[key] = filter[key].join("|");
    } else if (filter[key]) {
      result[key] = filter[key];
    }
  });

  return result;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatMinutesToHour = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;

  return `${hours}h${remainMinutes}p`;
};

export const getSecondsFromHHMMSS = (value = "") => {
  const [str1, str2, str3] = value?.split(":");

  const val1 = Number(str1);
  const val2 = Number(str2);
  const val3 = Number(str3);

  if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
    return val1;
  }

  if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
    return val1 * 60 + val2;
  }

  if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
    return val1 * 60 * 60 + val2 * 60 + val3;
  }

  return 0;
};

export const toHHMMSS = (secs: number) => {
  const secNum = parseInt(secs.toString(), 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor(secNum / 60) % 60;
  const seconds = secNum % 60;

  return [hours, minutes, seconds]
    .map((val) => (val < 10 ? `0${val}` : val))
    .filter((val, index) => val !== "00" || index > 0)
    .join(":");
  // .replace(/^0/, "");
};

export const formatSecondToHHMM = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  //   const seconds = value % 60;

  return `${hours}h ${minutes}p`;
};
export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  let result = "";
  if (hours > 0) result += `${hours} giờ `;
  if (minutes > 0) result += `${minutes} phút `;
  if (seconds > 0) result += `${seconds} giây`;
  return result.trim();
};
