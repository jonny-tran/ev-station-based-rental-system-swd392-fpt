"use client";

import { useAuth } from "@/stores/auth.store";

export function useLogout() {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    logout: handleLogout,
    isLoggingOut: isLoading,
  };
}
