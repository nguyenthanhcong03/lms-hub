"use client";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";
import UserDashBoardLayout from "@/shared/layouts/user-dashboard-layout";
import UserLayout from "@/shared/layouts/user-layout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayoutWrapper
      authGuard={true}
      getLayout={(page) => (
        <UserLayout>
          <UserDashBoardLayout>{page}</UserDashBoardLayout>
        </UserLayout>
      )}
    >
      {children}
    </AuthLayoutWrapper>
  );
};

export default layout;
