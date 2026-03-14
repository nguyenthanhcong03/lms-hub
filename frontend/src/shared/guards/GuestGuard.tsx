/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ACCESS_TOKEN, USER_DATA } from "@/shared/configs/auth";
import { useAuth } from "@/shared/contexts/auth-context";
import { useAppSelector } from "@/shared/store";
import { usePathname, useRouter } from "next/navigation";

import { ReactNode, ReactElement, useEffect } from "react";

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;

  // ** router
  const router = useRouter();
  const pathname = usePathname();
  // ** auth

  const authContext = useAuth();

  useEffect(() => {
    if (
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(USER_DATA)
    ) {
      router.replace("/");
    }
  }, [pathname]);

  if (
    authContext.loading ||
    (!authContext.loading && authContext.user !== null)
  ) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
