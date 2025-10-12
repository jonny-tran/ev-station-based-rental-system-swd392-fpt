/**
 * Global Loading Store using Zustand
 * Manages loading states across the application
 */

import { create } from "zustand";

interface LoadingState {
  // Loading states for different operations
  isPageLoading: boolean;
  isApiLoading: boolean;
  isAuthLoading: boolean;

  // Loading messages
  loadingMessage: string | null;

  // Actions
  setPageLoading: (loading: boolean, message?: string) => void;
  setApiLoading: (loading: boolean, message?: string) => void;
  setAuthLoading: (loading: boolean, message?: string) => void;
  clearAllLoading: () => void;

  // Computed states
  isAnyLoading: boolean;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  // Initial state
  isPageLoading: false,
  isApiLoading: false,
  isAuthLoading: false,
  loadingMessage: null,

  // Page loading (for route transitions)
  setPageLoading: (loading: boolean, message?: string) => {
    set((state) => ({
      isPageLoading: loading,
      loadingMessage: loading ? message || "Loading page..." : null,
      isAnyLoading: loading || state.isApiLoading || state.isAuthLoading,
    }));
  },

  // API loading (for API requests)
  setApiLoading: (loading: boolean, message?: string) => {
    set((state) => ({
      isApiLoading: loading,
      loadingMessage: loading ? message || "Processing..." : null,
      isAnyLoading: loading || state.isPageLoading || state.isAuthLoading,
    }));
  },

  // Auth loading (for authentication operations)
  setAuthLoading: (loading: boolean, message?: string) => {
    set((state) => ({
      isAuthLoading: loading,
      loadingMessage: loading ? message || "Authenticating..." : null,
      isAnyLoading: loading || state.isPageLoading || state.isApiLoading,
    }));
  },

  // Clear all loading states
  clearAllLoading: () => {
    set({
      isPageLoading: false,
      isApiLoading: false,
      isAuthLoading: false,
      loadingMessage: null,
      isAnyLoading: false,
    });
  },

  // Computed: check if any loading is active
  isAnyLoading: false,
}));

// Helper hooks for easier usage
export const usePageLoading = () => {
  const { isPageLoading, setPageLoading } = useLoadingStore();
  return { isPageLoading, setPageLoading };
};

export const useApiLoading = () => {
  const { isApiLoading, setApiLoading } = useLoadingStore();
  return { isApiLoading, setApiLoading };
};

export const useAuthLoading = () => {
  const { isAuthLoading, setAuthLoading } = useLoadingStore();
  return { isAuthLoading, setAuthLoading };
};

export const useGlobalLoading = () => {
  const {
    isAnyLoading,
    loadingMessage,
    setPageLoading,
    setApiLoading,
    setAuthLoading,
    clearAllLoading,
  } = useLoadingStore();

  return {
    isAnyLoading,
    loadingMessage,
    setPageLoading,
    setApiLoading,
    setAuthLoading,
    clearAllLoading,
  };
};
