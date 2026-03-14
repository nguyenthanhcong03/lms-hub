"use client";
import axios from "axios";

import { FC } from "react";

import { BASE_URL } from "@/shared/configs/api";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { useAuth } from "@/shared/contexts/auth-context";
import { UserDataType } from "@/shared/contexts/types";
import { refreshTokenAuth } from "@/shared/services/auth";
import { createUrlQuery } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { clearLocalUserData } from "../storage";

type TAxiosInterceptor = {
  children: React.ReactNode;
};

const instanceAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
});

interface IHandleRedirectLoginParams {
  router: ReturnType<typeof useRouter>;
  pathname: string;
  setUser: (data: UserDataType | null) => void;
}

const handleRedirectLogin = ({
  router,
  pathname,
  setUser,
}: IHandleRedirectLoginParams) => {
  if (pathname !== ROUTE_CONFIG.HOME) {
    router.replace(
      ROUTE_CONFIG.LOGIN + "?" + createUrlQuery("returnUrl", pathname),
    );
  } else {
    router.replace(ROUTE_CONFIG.LOGIN);
  }
  setUser(null);
  clearLocalUserData();
};

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser } = useAuth();

  let refreshTokenPromise: Promise<void> | null = null;

  instanceAxios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instanceAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest &&
        error.response?.data?.message === "Token expired"
      ) {
        if (!refreshTokenPromise) {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            return Promise.reject(new Error("Refresh token is missing"));
          }

          refreshTokenPromise = refreshTokenAuth(refreshToken)
            .then((response) => {
              localStorage.setItem("accessToken", response.data.accessToken);
              instanceAxios.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`;
            })
            .catch((error) => {
              handleRedirectLogin({ router, pathname, setUser });
              return Promise.reject(error);
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        }
        return refreshTokenPromise.then(() => {
          return instanceAxios(originalRequest);
        });
      }
      return Promise.reject(error);
    },
  );

  return <>{children}</>;
};

export default instanceAxios;
export { AxiosInterceptor };
