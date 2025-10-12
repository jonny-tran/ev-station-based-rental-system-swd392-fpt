/**
 * Utility functions để sử dụng loading dễ dàng hơn
 */

import { useLoadingStore } from "@/stores/loading.store";

/**
 * Wrapper for async functions with automatic loading
 */
export async function withLoading<T>(
  asyncFn: () => Promise<T>,
  type: "api" | "auth" | "page" = "api",
  message?: string
): Promise<T> {
  const store = useLoadingStore.getState();

  const loadingActions = {
    api: store.setApiLoading,
    auth: store.setAuthLoading,
    page: store.setPageLoading,
  };

  const defaultMessages = {
    api: "Processing...",
    auth: "Authenticating...",
    page: "Loading page...",
  };

  const setLoading = loadingActions[type];
  const loadingMessage = message || defaultMessages[type];

  setLoading(true, loadingMessage);

  try {
    const result = await asyncFn();
    return result;
  } finally {
    setLoading(false);
  }
}

/**
 * Wrapper for API calls
 */
export async function withApiLoading<T>(
  apiCall: () => Promise<T>,
  message?: string
): Promise<T> {
  return withLoading(apiCall, "api", message);
}

/**
 * Wrapper for auth operations
 */
export async function withAuthLoading<T>(
  authCall: () => Promise<T>,
  message?: string
): Promise<T> {
  return withLoading(authCall, "auth", message);
}

/**
 * Wrapper for page operations
 */
export async function withPageLoading<T>(
  pageCall: () => Promise<T>,
  message?: string
): Promise<T> {
  return withLoading(pageCall, "page", message);
}

/**
 * Debounced loading to prevent loading too quickly
 */
export function debounceLoading(
  fn: () => void,
  delay: number = 300
): () => void {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}

/**
 * Loading states for common operations
 */
export const LoadingMessages = {
  // API Loading
  api: {
    fetching: "Loading data...",
    saving: "Saving...",
    updating: "Updating...",
    deleting: "Deleting...",
    uploading: "Uploading...",
    processing: "Processing...",
  },

  // Auth Loading
  auth: {
    login: "Logging in...",
    logout: "Logging out...",
    register: "Registering...",
    verifying: "Verifying...",
    resetting: "Resetting password...",
  },

  // Page Loading
  page: {
    navigating: "Navigating to page...",
    redirecting: "Redirecting...",
    loading: "Loading page...",
    refreshing: "Refreshing...",
  },
} as const;
