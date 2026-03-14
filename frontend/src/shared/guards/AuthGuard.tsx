import { ACCESS_TOKEN, USER_DATA } from "@/shared/configs/auth";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { useAuth } from "@/shared/contexts/auth-context";
import { clearLocalUserData } from "@/shared/helpers/storage";
import { createUrlQuery } from "@/utils";

import { usePathname, useRouter } from "next/navigation";

import { ReactElement, ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const authContext = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      authContext.user === null &&
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      !window.localStorage.getItem(USER_DATA)
    ) {
      if (pathname !== ROUTE_CONFIG.HOME && pathname !== ROUTE_CONFIG.LOGIN) {
        router.replace(
          ROUTE_CONFIG.LOGIN + "?" + createUrlQuery("returnUrl", pathname),
        );
      } else {
        router.replace(ROUTE_CONFIG.LOGIN);
      }
      authContext.setUser(null);
      clearLocalUserData();
    }
  }, [pathname, authContext]);

  if (authContext.loading || authContext.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
