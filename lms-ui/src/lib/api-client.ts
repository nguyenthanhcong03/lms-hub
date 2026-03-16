import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Custom parameter serializer for arrays
const customParamsSerializer = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }

    if (Array.isArray(value)) {
      // For arrays, add multiple parameters with the same name (no brackets)
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      // For non-arrays, add normally
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

// API configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: customParamsSerializer,
  // Use the built-in fetch adapter (axios 1.7+) to avoid the deprecated
  // url.parse() used by the legacy http adapter (Node.js DEP0169).
  adapter: "fetch",
};

// Create the main Axios instance
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosError["config"] & { _retry?: boolean }) | undefined;

    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    // Avoid refresh loops for auth endpoints
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password") ||
      requestUrl.includes("/auth/verify-email");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_CONFIG.baseURL}/auth/refresh`,
          {},
          {
            timeout: API_CONFIG.timeout,
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            adapter: "fetch",
          },
        );

        const refreshedData = refreshResponse.data?.data;
        const newAccessToken: string | undefined = refreshedData?.token;

        if (!newAccessToken) {
          throw new Error("Invalid refresh token response");
        }

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle common error scenarios
    if (status === 401 && !isAuthRequest) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  },
);

// Helper functions
function getAuthToken(): string | null {
  // Get token from simple localStorage (not Zustand persist storage)
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

function setAccessToken(accessToken: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", accessToken);
  }
}

function handleUnauthorized(): void {
  // Clear auth tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    // Redirect to login page
    // window.location.href = "/auth/sign-in";
  }
}

// Export configured instance
export default apiClient;
