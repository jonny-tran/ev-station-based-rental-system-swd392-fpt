/**
 * Auth Token Management Utilities
 * Quản lý token xác thực trong ứng dụng
 */

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Lưu access token vào localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Lấy access token từ localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Xóa access token khỏi localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Lưu refresh token vào localStorage
 */
export const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * Lấy refresh token từ localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

/**
 * Xóa refresh token khỏi localStorage
 */
export const removeRefreshToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Xóa tất cả token khỏi localStorage (logout)
 */
export const clearAllTokens = (): void => {
  removeAuthToken();
  removeRefreshToken();
};

/**
 * Kiểm tra xem có token hay không
 */
export const hasAuthToken = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== "";
};

/**
 * Lấy Bearer token string để gắn vào Authorization header
 */
export const getBearerToken = (): string | null => {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : null;
};
