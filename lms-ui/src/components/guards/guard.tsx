"use client";

import { ADMIN_PANEL_PERMISSIONS, Permission } from "@/configs/permission";
import { ROUTE_CONFIG } from "@/configs/routes";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../loader";

type GuardMode = "all" | "any";

interface GuardProps {
  children: React.ReactNode;

  // authentication
  requireAuth?: boolean;
  guestOnly?: boolean;

  // RBAC
  roles?: string[];
  permissions?: Permission[];

  // matching mode
  roleMode?: GuardMode;
  permissionMode?: GuardMode;

  // redirect paths
  redirectAuthenticated?: string;
  redirectUnauthorized?: string;
  redirectUnauthenticated?: string;

  // UI fallback when auth state is loading
  loadingFallback?: React.ReactNode;
}

export function Guard({
  children,
  requireAuth = false,
  guestOnly = false,

  roles = [],
  permissions = [],

  roleMode = "any",
  permissionMode = "any",

  redirectAuthenticated = ROUTE_CONFIG.HOME,
  redirectUnauthorized = ROUTE_CONFIG.UNAUTHORIZED,
  redirectUnauthenticated = ROUTE_CONFIG.AUTH.SIGN_IN,
  loadingFallback,
}: GuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const isAuthenticated = !!user;

  function checkRoles() {
    if (!roles.length) return true;
    if (!user) return false;

    if (roleMode === "all") {
      return roles.every((r) => user.roles?.includes(r));
    }

    return roles.some((r) => user.roles?.includes(r));
  }

  function checkPermissions() {
    if (!permissions.length) return true;

    if (permissionMode === "all") {
      return permissions.every((p) => hasPermission(p));
    }

    return permissions.some((p) => hasPermission(p));
  }

  const hasRoleAccess = checkRoles();
  const hasPermissionAccess = checkPermissions();

  const hasAccess = hasRoleAccess && hasPermissionAccess;
  const shouldRedirectToLogin = requireAuth && !isAuthenticated;
  const shouldRedirectToAuthenticated = guestOnly && isAuthenticated;
  const shouldRedirectUnauthorized = isAuthenticated && !hasAccess;

  useEffect(() => {
    if (isLoading) return;
    const returnUrl = encodeURIComponent(pathname);

    if (shouldRedirectToLogin) {
      router.replace(`${redirectUnauthenticated}?returnUrl=${returnUrl}`);
      return;
    }

    if (shouldRedirectToAuthenticated) {
      router.replace(redirectAuthenticated);
      return;
    }

    if (shouldRedirectUnauthorized) {
      router.replace(redirectUnauthorized);
    }
  }, [
    isLoading,
    pathname,
    redirectAuthenticated,
    redirectUnauthorized,
    redirectUnauthenticated,
    router,
    shouldRedirectToAuthenticated,
    shouldRedirectToLogin,
    shouldRedirectUnauthorized,
  ]);

  if (isLoading) {
    return <>{loadingFallback ?? <Loader />}</>;
  }

  if (shouldRedirectToLogin || shouldRedirectToAuthenticated || shouldRedirectUnauthorized) {
    return null;
  }

  return <>{children}</>;
}

interface AuthGuardProps {
  children: React.ReactNode;
  redirectUnauthenticated?: string;
  loadingFallback?: React.ReactNode;
}

export function AuthGuard({ children, redirectUnauthenticated, loadingFallback }: AuthGuardProps) {
  return (
    <Guard requireAuth redirectUnauthenticated={redirectUnauthenticated} loadingFallback={loadingFallback}>
      {children}
    </Guard>
  );
}

interface GuestGuardProps {
  children: React.ReactNode;
  redirectAuthenticated?: string;
  loadingFallback?: React.ReactNode;
}

export function GuestGuard({ children, redirectAuthenticated, loadingFallback }: GuestGuardProps) {
  return (
    <Guard guestOnly redirectAuthenticated={redirectAuthenticated} loadingFallback={loadingFallback}>
      {children}
    </Guard>
  );
}

interface AdminGuardProps {
  children: React.ReactNode;
  redirectUnauthenticated?: string;
  redirectUnauthorized?: string;
  loadingFallback?: React.ReactNode;
}

export function AdminGuard({
  children,
  redirectUnauthenticated,
  redirectUnauthorized,
  loadingFallback,
}: AdminGuardProps) {
  return (
    <Guard
      requireAuth
      permissions={ADMIN_PANEL_PERMISSIONS}
      permissionMode="any"
      redirectUnauthenticated={redirectUnauthenticated}
      redirectUnauthorized={redirectUnauthorized}
      loadingFallback={loadingFallback}
    >
      {children}
    </Guard>
  );
}

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: Permission[];
  permissionMode?: GuardMode;
  redirectUnauthorized?: string;
  redirectUnauthenticated?: string;
  loadingFallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permissions,
  permissionMode = "any",
  redirectUnauthorized,
  redirectUnauthenticated,
  loadingFallback,
}: PermissionGuardProps) {
  return (
    <Guard
      requireAuth
      permissions={permissions}
      permissionMode={permissionMode}
      redirectUnauthorized={redirectUnauthorized}
      redirectUnauthenticated={redirectUnauthenticated}
      loadingFallback={loadingFallback}
    >
      {children}
    </Guard>
  );
}

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
  roleMode?: GuardMode;
  redirectUnauthorized?: string;
  redirectUnauthenticated?: string;
  loadingFallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  roles,
  roleMode = "any",
  redirectUnauthorized,
  redirectUnauthenticated,
  loadingFallback,
}: RoleGuardProps) {
  return (
    <Guard
      requireAuth
      roles={roles}
      roleMode={roleMode}
      redirectUnauthorized={redirectUnauthorized}
      redirectUnauthenticated={redirectUnauthenticated}
      loadingFallback={loadingFallback}
    >
      {children}
    </Guard>
  );
}
