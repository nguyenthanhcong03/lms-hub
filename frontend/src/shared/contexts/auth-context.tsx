"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { API_ENDPOINT } from "@/shared/configs/api";
import { ACCESS_TOKEN } from "@/shared/configs/auth";
import instanceAxios from "@/shared/helpers/axios";
import { clearLocalUserData } from "@/shared/helpers/storage";
import { AuthValuesType, UserDataType } from "./types";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  initAuth: async () => {},
  handleLogout: () => {},
};

const AuthContext = createContext(defaultProvider);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);

  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const initAuth = async (): Promise<void> => {
    const storedToken = window.localStorage.getItem(ACCESS_TOKEN);

    if (storedToken) {
      setLoading(true);
      await instanceAxios
        .get(API_ENDPOINT.AUTH.AUTH_ME, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then(async (response) => {
          setLoading(false);
          setUser({ ...response.data.data });
        })
        .catch(() => {
          clearLocalUserData();
          setUser(null);
          setLoading(false);
          // if (!pathname.includes("login")) {
          // 	router.replace("/login");
          // }
        });
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    initAuth();
  }, []);
  const handleLogout = () => {
    setUser(null);
    clearLocalUserData();
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    initAuth,
    handleLogout,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
