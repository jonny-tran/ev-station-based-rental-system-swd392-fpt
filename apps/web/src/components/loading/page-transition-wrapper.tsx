"use client";

import { usePageLoading } from "@/hooks/use-page-loading";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export function PageTransitionWrapper({
  children,
}: PageTransitionWrapperProps) {
  // This hook will automatically manage page loading states
  usePageLoading();

  return <>{children}</>;
}
