/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiPost, apiGet } from "@/packages/lib/api-client";
import {
  setAuthToken,
  clearAllTokens,
  getAuthToken,
} from "@/packages/lib/auth-token";
import {
  LoginRequest,
  LoginResponse,
  AuthInfoResponse,
} from "@/packages/types/auth";

// Interface for API error responses
interface ApiErrorResponse {
  response?: {
    status?: number; // HTTP status code từ axios
    data?: {
      message?: string;
      status?: number; // API status code từ backend
      code?: string;
    };
  };
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiPost<LoginResponse>("/auth/login", credentials);

      // Store the access token
      if (response.success && response.data?.accessToken) {
        setAuthToken(response.data.accessToken);
      }

      return response;
    } catch (error) {
      // Handle API errors and transform them to match our interface
      const apiError = error as ApiErrorResponse;

      // If it's an Axios error with response data, use that
      if (apiError.response?.data) {
        const status = apiError.response.data.status || 500;
        const httpStatus = apiError.response?.status; // HTTP status code từ axios

        // Debug: log để xem status thực tế
        if (process.env.NODE_ENV === "development") {
          console.log("🔍 Debug Login Error:", {
            apiStatus: status,
            httpStatus: httpStatus,
            message: apiError.response.data.message,
          });
        }

        // Chỉ log console.error cho các lỗi không phải 401 (authentication errors)
        // Kiểm tra cả API status và HTTP status
        if (
          status !== 401 &&
          httpStatus !== 401 &&
          process.env.NODE_ENV === "development"
        ) {
          console.error("🔐 Login API Error:", {
            status,
            httpStatus,
            message: apiError.response.data.message,
            code: apiError.response.data.code,
          });
        }

        throw new AuthError(
          apiError.response.data.message || "Login failed",
          status,
          apiError.response.data.code,
          apiError.response.data
        );
      }

      // Log network/unknown errors
      if (process.env.NODE_ENV === "development") {
        console.error("🔐 Login Network/Unknown Error:", error);
      }

      // Otherwise, throw a generic error
      throw new AuthError(
        "An error occurred during login",
        500,
        undefined,
        error
      );
    }
  }

  /**
   * Get current user information
   */
  static async getCurrentUser(): Promise<AuthInfoResponse> {
    try {
      const response = await apiGet<AuthInfoResponse>("/auth/info");
      return response;
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      if (apiError.response?.data) {
        const status = apiError.response.data.status || 500;

        // Chỉ log console.error cho các lỗi không phải 401
        if (status !== 401 && process.env.NODE_ENV === "development") {
          console.error("👤 Get User Info API Error:", {
            status,
            message: apiError.response.data.message,
            code: apiError.response.data.code,
          });
        }

        throw new AuthError(
          apiError.response.data.message || "Unable to get user information",
          status,
          apiError.response.data.code,
          apiError.response.data
        );
      }

      // Log network/unknown errors
      if (process.env.NODE_ENV === "development") {
        console.error("👤 Get User Info Network/Unknown Error:", error);
      }

      throw new AuthError(
        "An error occurred when getting user information",
        500,
        undefined,
        error
      );
    }
  }

  /**
   * Logout user (clear tokens)
   */
  static logout(): void {
    clearAllTokens();
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static isAuthenticated(): boolean {
    const token = getAuthToken();
    return token !== null && token !== "";
  }

  /**
   * Refresh authentication token (if needed in the future)
   */
  static async refreshToken(): Promise<void> {
    // TODO: Implement refresh token logic when backend supports it
    throw new Error("Refresh token not implemented yet");
  }
}

// Export error class for better error handling
export class AuthError extends Error {
  public status: number;
  public code?: string;
  public originalError?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }
}
