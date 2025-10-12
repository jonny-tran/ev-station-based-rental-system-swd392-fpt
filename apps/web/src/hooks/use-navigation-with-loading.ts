"use client";

import { useRouter } from "next/navigation";
import { usePageLoading } from "@/stores/loading.store";
import { useCallback } from "react";

/**
 * Hook để wrap navigation với loading state tự động
 */
export function useNavigationWithLoading() {
  const router = useRouter();
  const { setPageLoading } = usePageLoading();

  const navigateWithLoading = useCallback(
    async (
      path: string,
      loadingMessage: string = "Navigating to page...",
      delay: number = 800
    ) => {
      setPageLoading(true, loadingMessage);

      // Delay to allow user to see loading
      await new Promise((resolve) => setTimeout(resolve, delay));

      router.push(path);

      // Clear loading after navigation
      setTimeout(() => setPageLoading(false), 100);
    },
    [router, setPageLoading]
  );

  const navigateBackWithLoading = useCallback(
    async (
      loadingMessage: string = "Navigating back...",
      delay: number = 800
    ) => {
      setPageLoading(true, loadingMessage);

      await new Promise((resolve) => setTimeout(resolve, delay));

      router.back();

      setTimeout(() => setPageLoading(false), 100);
    },
    [router, setPageLoading]
  );

  const replaceWithLoading = useCallback(
    async (
      path: string,
      loadingMessage: string = "Redirecting...",
      delay: number = 800
    ) => {
      setPageLoading(true, loadingMessage);

      await new Promise((resolve) => setTimeout(resolve, delay));

      router.replace(path);

      setTimeout(() => setPageLoading(false), 100);
    },
    [router, setPageLoading]
  );

  return {
    navigateWithLoading,
    navigateBackWithLoading,
    replaceWithLoading,
  };
}
