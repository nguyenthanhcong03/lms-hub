"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../loader";
import { ADMIN_PANEL_PERMISSIONS, Permission } from "@/configs/permission";

// interface AuthGuardProps {
//   children: React.ReactNode;
//   requireAuth?: boolean;
//   resource?: string;
//   action?: "create" | "read" | "update" | "delete";
//   redirectTo?: string;
// }

// export function AuthGuard({
//   children,
//   requireAuth = true,
//   resource,
//   action,
//   redirectTo = "/auth/sign-in",
// }: AuthGuardProps) {
//   const router = useRouter();
//   const isAuthenticated = useAuthStore((state) => !!state.user);
//   const isLoading = useAuthStore((state) => state.isLoading);
//   const canPerformAction = useAuthStore((state) => state.canPerformAction);

//   // Show loading while checking auth
//   if (isLoading) {
//     return <Loader />;
//   }

//   // Check resource-action permission if specified
//   if (resource && action) {
//     const hasPermission = canPerformAction(resource, action);
//     if (!hasPermission) {
//       router.push("/forbidden"); // User is authenticated but doesn't have resource permission
//       return null;
//     }
//   }

//   // Redirect về trang đăng nhập nếu yêu cầu auth nhưng chưa authenticated
//   if (!isLoading && requireAuth && !isAuthenticated) {
//     router.push(redirectTo);
//     return;
//   }

//   // Redirect về trang admin nếu người dùng đã đăng nhập nhưng không yêu cầu auth
//   if (!isLoading && !requireAuth && isAuthenticated) {
//     router.push("/admin");
//     return;
//   }

//   return <>{children}</>;
// }

interface AdminGuardProps {
  children: React.ReactNode;
  /**
   * List of permissions required to access this area.
   * Defaults to ADMIN_PANEL_PERMISSIONS (at least one must match).
   */
  requiredPermissions?: Permission[];
}

export function AdminGuard({ children, requiredPermissions = ADMIN_PANEL_PERMISSIONS }: AdminGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => !!state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasAccess = requiredPermissions.some((perm) => hasPermission(perm));

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const returnUrl = typeof window !== "undefined" ? window.location.pathname : "/admin";
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!hasAccess) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAuthenticated, hasAccess, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !hasAccess) {
    return null;
  }

  return <>{children}</>;
}
