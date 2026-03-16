import { ApiService } from "@/lib/api-service";

// Auth endpoints
const ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  ME: "/auth/me",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
}

// Extended user interface for /auth/me response
export interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string; // Optional avatar URL from UploadThing
  status: string;
  userType: string;
  roles: {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
  }[];
  userPermissions: string[];
  courses: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth service
export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return ApiService.post<LoginResponse, LoginRequest>(ENDPOINTS.LOGIN, credentials);
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<{ message?: string }> {
    return ApiService.post<{ message?: string }, RegisterRequest>(ENDPOINTS.REGISTER, userData);
  }

  // Logout user
  static async logout(): Promise<void> {
    return ApiService.post<void>(ENDPOINTS.LOGOUT);
  }

  // Refresh token
  static async refreshToken(): Promise<{
    token: string;
  }> {
    return ApiService.post<{ token: string }>(ENDPOINTS.REFRESH, {});
  }

  // Get user profile
  static async getProfile(): Promise<AuthProfile> {
    return ApiService.get<AuthProfile>(ENDPOINTS.PROFILE);
  }

  // Get current user with full details including role and permissions
  static async getAuthMe(): Promise<CurrentUser> {
    return ApiService.get<CurrentUser>(ENDPOINTS.ME);
  }

  // Forgot password
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return ApiService.post<{ message: string }, ForgotPasswordRequest>(ENDPOINTS.FORGOT_PASSWORD, data);
  }

  // Reset password
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return ApiService.post<{ message: string }, ResetPasswordRequest>(ENDPOINTS.RESET_PASSWORD, data);
  }

  // Update user profile
  static async updateProfile(data: UpdateProfileRequest): Promise<CurrentUser> {
    return ApiService.put<CurrentUser, UpdateProfileRequest>(ENDPOINTS.UPDATE_PROFILE, data);
  }

  // Change password
  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return ApiService.put<{ message: string }, ChangePasswordRequest>(ENDPOINTS.CHANGE_PASSWORD, data);
  }

  // Verify email
  static async verifyEmail(data: { token: string }): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    const res = await ApiService.post<
      {
        success: boolean;
        message: string;
        statusCode: number;
      },
      { token: string }
    >(ENDPOINTS.VERIFY_EMAIL, data);

    return res;
  }
}

export default AuthService;
