/**
 * Custom hook for managing page loading states
 * Integrates with Next.js router events
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePageLoading as usePageLoadingStore } from "@/stores/loading.store";

export function usePageLoading() {
  const { setPageLoading } = usePageLoadingStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set loading to true when route changes start
    setPageLoading(true, "Loading page...");

    // Set loading to false after a short delay to allow for smooth transitions
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setPageLoading(false);
    };
  }, [pathname, searchParams, setPageLoading]);
}
