import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { getBearerToken, clearAllTokens } from "./auth-token";
import { ApiResponse, ApiError } from "../types/common/api";

/**
 * API Client Configuration
 * Cấu hình client để gọi API
 */

// Lấy base URL từ environment variables
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Tạo axios instance với cấu hình cơ bản
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * Tự động gắn Authorization header vào mỗi request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = getBearerToken();

    // Nếu có token, gắn vào Authorization header
    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Xử lý response và error handling
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Log error trong development mode - chỉ log các lỗi không phải authentication
    if (process.env.NODE_ENV === "development") {
      const status = error.response?.status;

      // Không log lỗi 401 (Unauthorized) vì đây là trường hợp bình thường khi login sai
      if (status !== 401) {
        const method = error.config?.method?.toUpperCase() || "UNKNOWN";
        const url = error.config?.url || "unknown";
      }
    }

    // Xử lý các lỗi cụ thể
    // In development mode, don't auto-redirect to allow debugging
    const isDevelopment = process.env.NODE_ENV === "development";
    const disableAutoRedirect = 
      isDevelopment || 
      (typeof window !== "undefined" && 
       (window as any).__DISABLE_API_AUTO_REDIRECT === true);

    if (error.response?.status === 401) {
      // Unauthorized - log error for debugging
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const isLoginPage = pathname === "/login";
        
        // Always log in development for debugging
        if (isDevelopment) {
          console.error("[API Client] 401 Unauthorized:", {
            url: error.config?.url,
            method: error.config?.method,
            pathname,
            error: error.response?.data,
          });
        }

        // Only clear tokens and redirect if not on login page and auto-redirect is enabled
        if (!isLoginPage && !disableAutoRedirect) {
          clearAllTokens();
          window.location.href = "/login";
        } else if (!isLoginPage && disableAutoRedirect) {
          // In debug mode, DON'T clear tokens to allow debugging
          // Only log the error
          console.warn(
            "[API Client] 401 Unauthorized - Auto-redirect disabled. " +
            "Token NOT cleared to allow debugging. Please handle error in component."
          );
        }
      }
    }

    // Xử lý lỗi 403 - Forbidden
    if (error.response?.status === 403) {
      if (isDevelopment) {
        console.error("[API Client] 403 Forbidden:", {
          url: error.config?.url,
          method: error.config?.method,
          error: error.response?.data,
          message: error.response?.data?.message || "Access denied",
        });
      }
      
      if (typeof window !== "undefined") {
        if (!disableAutoRedirect) {
          clearAllTokens();
          window.location.href = "/login";
        } else {
          // In debug mode, DON'T clear tokens for 403 errors
          // 403 usually means role/permission issue, not auth issue
          console.warn(
            "[API Client] 403 Forbidden - Auto-redirect disabled. " +
            "Token NOT cleared (403 is permission issue, not auth issue). " +
            "Please handle error in component."
          );
        }
      }
    }

    // Xử lý lỗi 500 - Internal Server Error
    if (error.response?.status === 500) {
      if (isDevelopment) {
        console.error("[API Client] 500 Internal Server Error:", {
          url: error.config?.url,
          method: error.config?.method,
          error: error.response?.data,
        });
      }
      
      if (typeof window !== "undefined") {
        if (!disableAutoRedirect) {
          clearAllTokens();
          window.location.href = "/login";
        } else {
          // In debug mode, DON'T clear tokens for 500 errors
          // 500 is server error, not auth issue
          console.warn(
            "[API Client] 500 Internal Server Error - Auto-redirect disabled. " +
            "Token NOT cleared (500 is server error, not auth issue). " +
            "Please handle error in component."
          );
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Wrapper functions để dễ sử dụng
 */

/**
 * GET request
 */
const apiGet = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

/**
 * POST request
 */
const apiPost = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

/**
 * PUT request
 */
const apiPut = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

/**
 * PATCH request
 */
const apiPatch = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

/**
 * DELETE request
 */
const apiDelete = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

/**
 * Upload file
 */
const apiUpload = async <T = unknown>(
  url: string,
  file: File,
  config?: AxiosRequestConfig
): Promise<T> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<T>(url, formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config?.headers,
    },
  });
  return response.data;
};

/**
 * Download file
 */
const apiDownload = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<Blob> => {
  const response = await apiClient.get(url, {
    ...config,
    responseType: "blob",
  });
  return response.data;
};

// Export default instance để có thể dùng trực tiếp
export default apiClient;

// Export các helper functions
export { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiUpload, apiDownload };

// Re-export types
export type { ApiResponse, ApiError };
