"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import Loader from "../loader";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
