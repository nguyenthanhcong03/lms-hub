"use client";
import { AuthProvider } from "@/shared/contexts/auth-context";
import { AxiosInterceptor } from "@/shared/helpers/axios";
import ReduxProvider from "@/shared/store/redux-provider";
import { HeroUIProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import React from "react";

const Provider = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <NextTopLoader height={4} showSpinner={false} />
      <ReduxProvider>
        <HeroUIProvider>
          <AuthProvider>
            <AxiosInterceptor>{children}</AxiosInterceptor>
          </AuthProvider>
        </HeroUIProvider>
      </ReduxProvider>
    </>
  );
};

export default Provider;
