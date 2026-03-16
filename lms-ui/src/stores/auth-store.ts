"use client";

import { Permission } from "@/configs/permission";
import { AuthService, type CurrentUser } from "@/services/auth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Use the CurrentUser type from auth service
export type AuthUser = CurrentUser;

// Auth store state
interface AuthState {
  // User state
  user: AuthUser | null;
  isLoading: boolean;

  // Auth actions
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;

  // Permission helper - only keep the one we actually use
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: true,

      // Actions
      setUser: (user) => {
        set({ user });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Fetch current user from /auth/me
      getCurrentUser: async () => {
        try {
          const token = getTokenFromStorage();
          if (!token) {
            set({ isLoading: false, user: null });
            return;
          }

          const userData = await AuthService.getAuthMe();

          set({ user: userData, isLoading: false });
          setUserDataToStorage(userData);
        } catch {
          // Clear invalid token
          clearTokenFromStorage();
          clearUserDataFromStorage();
          set({ user: null, isLoading: false });
        }
      },

      // Logout and clear local auth state
      logout: async () => {
        try {
          await AuthService.logout();
        } catch {
          // Ignore network/auth errors here and always clear client auth state.
        }

        clearTokenFromStorage();
        clearUserDataFromStorage();
        set({ user: null, isLoading: false });
      },

      hasPermission: (permission) => {
        const state = get();
        const userPermissions = state?.user?.userPermissions || [];
        return userPermissions.includes(permission);
      },

      hasAnyPermission: (permissions) => {
        const state = get();
        const userPermissions = state?.user?.userPermissions || [];
        return permissions.some((perm) => userPermissions.includes(perm));
      },
    }),
    {
      name: "auth-store",
    },
  ),
);

// Token management helpers (only store tokens, not user data)
function getTokenFromStorage(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

function clearTokenFromStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

function setUserDataToStorage(user: CurrentUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_data", JSON.stringify(user));
  }
}

function getUserDataFromStorage(): CurrentUser | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user_data");
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as CurrentUser;
    } catch {
      localStorage.removeItem("user_data");
      return null;
    }
  }

  return null;
}

function clearUserDataFromStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_data");
  }
}
