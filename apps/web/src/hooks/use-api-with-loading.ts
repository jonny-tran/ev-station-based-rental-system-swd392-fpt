"use client";

import { useApiLoading } from "@/stores/loading.store";
import { useCallback } from "react";

/**
 * Hook để wrap API calls với loading state tự động
 */
export function useApiWithLoading() {
  const { setApiLoading } = useApiLoading();

  const executeWithLoading = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      loadingMessage: string = "Processing..."
    ): Promise<T> => {
      setApiLoading(true, loadingMessage);
      try {
        const result = await apiCall();
        return result;
      } finally {
        setApiLoading(false);
      }
    },
    [setApiLoading]
  );

  return { executeWithLoading };
}

/**
 * Hook cho các API calls thường dùng
 */
export function useCommonApi() {
  const { executeWithLoading } = useApiWithLoading();

  const fetchData = useCallback(
    async (url: string, options?: RequestInit, message?: string) => {
      return executeWithLoading(async () => {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }, message || "Loading data...");
    },
    [executeWithLoading]
  );

  const submitForm = useCallback(
    async (url: string, data: unknown, message?: string) => {
      return executeWithLoading(async () => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }, message || "Sending information...");
    },
    [executeWithLoading]
  );

  const updateData = useCallback(
    async (url: string, data: unknown, message?: string) => {
      return executeWithLoading(async () => {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }, message || "Updating...");
    },
    [executeWithLoading]
  );

  const deleteData = useCallback(
    async (url: string, message?: string) => {
      return executeWithLoading(async () => {
        const response = await fetch(url, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }, message || "Deleting...");
    },
    [executeWithLoading]
  );

  return {
    fetchData,
    submitForm,
    updateData,
    deleteData,
    executeWithLoading,
  };
}
