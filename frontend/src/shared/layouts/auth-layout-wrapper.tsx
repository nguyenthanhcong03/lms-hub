import Guard from "@/shared/guards";
import React from "react";
import UserLayout from "./user-layout";

const AuthLayoutWrapper = ({
  authGuard = true,
  guestGuard = false,
  children,
  getLayout,
}: {
  authGuard?: boolean;
  guestGuard?: boolean;
  children: React.ReactNode;
  getLayout?: (page: React.ReactNode) => React.ReactNode;
}) => {
  return (
    <Guard authGuard={authGuard} guestGuard={guestGuard}>
      {getLayout ? (
        <>{getLayout(<>{children}</>)}</>
      ) : (
        <UserLayout>{children}</UserLayout>
      )}
    </Guard>
  );
};

export default AuthLayoutWrapper;
