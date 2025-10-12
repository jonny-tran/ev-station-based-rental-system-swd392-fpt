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
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

    // Log request trong development mode
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: config.headers,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Xử lý response và error handling
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response trong development mode
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Log error trong development mode
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        }
      );
    }

    // Xử lý các lỗi cụ thể
    if (error.response?.status === 401) {
      // Unauthorized - xóa token và redirect về login
      console.warn("🔒 Unauthorized access detected, clearing tokens");
      clearAllTokens();

      // Redirect về trang login nếu đang ở client side
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Xử lý lỗi 403 - Forbidden
    if (error.response?.status === 403) {
      console.warn("🚫 Access forbidden");
    }

    // Xử lý lỗi 500 - Internal Server Error
    if (error.response?.status === 500) {
      console.error("🔥 Internal server error");
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
