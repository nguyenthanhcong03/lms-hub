import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterRequest,
  LoginRequest,
} from "@/services/auth";
import { ROUTE_CONFIG } from "@/configs/routes";

// Query keys for auth
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

// Hook to get current user profile
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => AuthService.getAuthMe(),
  });
}

// Mutation hooks
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: { token: string }) => AuthService.verifyEmail(data),
    onSuccess: (response) => {
      toast.success(response.message || "Email verified successfully!");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { getCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => AuthService.updateProfile(profileData),
    onSuccess: async () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Also update auth store
      await getCurrentUser();
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordRequest) => AuthService.changePassword(passwordData),
    onSuccess: (response) => {
      toast.success(response.message || "Password changed successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to change password");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (emailData: ForgotPasswordRequest) => AuthService.forgotPassword(emailData),
    onSuccess: () => {
      toast.success("Password reset email sent successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send reset email. Please try again.");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (resetData: ResetPasswordRequest) => AuthService.resetPassword(resetData),
    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to reset password. Please try again.");
    },
  });
}

// Regular registration hook
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: () => {
      toast.success("Registration successful! Please check your email to verify your account.");
      router.push(ROUTE_CONFIG.AUTH.SIGN_IN);
    },
    onError: (error) => {
      toast.error(error?.message || "Registration failed. Please try again.");
    },
  });
}

// Direct login hook (bypasses NextAuth)
export function useLogin() {
  const { getCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: async (response) => {
      // Handle the login response data directly
      if (response && response.token) {
        // Store access token only. Refresh token is handled via httpOnly cookie.
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", response.token);
        }

        await getCurrentUser();
        toast.success("Login successful!");
      } else {
        toast.error("Invalid login response");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Login failed. Please try again.");
    },
  });
}
