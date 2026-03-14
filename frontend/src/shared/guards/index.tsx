"use client";
import React, { ReactNode } from "react";
import GuestGuard from "./GuestGuard";
import FallbackSpinner from "@/shared/components/fall-back";
import NoGuard from "./NoGuard";
import AuthGuard from "./AuthGuard";
type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <NoGuard fallback={<FallbackSpinner />}>{children}</NoGuard>;
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>;
  }
};

export default Guard;
