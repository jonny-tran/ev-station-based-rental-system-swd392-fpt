/**
 * API Types
 * Các types chung cho API client
 */

/**
 * API Response Type
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown[];
}

/**
 * API Error Type
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: unknown[];
  status?: number;
}

/**
 * Pagination Response Type
 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Auth Token Type
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/**
 * API Client Configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}
