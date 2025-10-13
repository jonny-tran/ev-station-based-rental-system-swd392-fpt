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
    if (error.response?.status === 401) {
      // Unauthorized - xóa token và redirect về login
      // Chỉ log warning nếu không phải đang ở trang login (tránh spam khi user nhập sai)
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      )
        clearAllTokens();

      // Redirect về trang login nếu đang ở client side và không phải đang ở trang login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    // Xử lý lỗi 403 - Forbidden
    if (error.response?.status === 403) {
      clearAllTokens();
      window.location.href = "/login";
    }

    // Xử lý lỗi 500 - Internal Server Error
    if (error.response?.status === 500) {
      clearAllTokens();
      window.location.href = "/login";
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
