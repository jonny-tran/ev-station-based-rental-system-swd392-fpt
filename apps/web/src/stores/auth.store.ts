/**
 * Authentication Store using Zustand
 * Global state management for authentication
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService, AuthError } from "@/packages/services";
import { toast } from "@/lib/toast";
import { useLoadingStore } from "./loading.store";

// User interface based on the API response
export interface User {
  accountId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  staffId?: string;
  rentalLocationId?: string;
  rentalLocation?: {
    rentalLocationId: string;
    name: string;
    address: string;
    city: string;
    country: string;
  };
  renterId?: string;
  address?: string;
  dateOfBirth?: Date;
  identityNumber?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (emailOrPhone: string, password: string) => {
        set({ isLoading: true, error: null });
        useLoadingStore.getState().setAuthLoading(true, "Authenticating...");

        try {
          // Call login API
          const loginResponse = await AuthService.login({
            emailOrPhone,
            password,
          });

          if (loginResponse.success && loginResponse.data) {
            // Fetch user details after successful login
            await get().fetchUser();

            // Set cookies for middleware
            if (typeof document !== "undefined") {
              const expires = new Date();
              expires.setDate(expires.getDate() + 7); // 7 days

              document.cookie = `auth_token=${loginResponse.data.accessToken}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
            }

            toast.success(loginResponse.message || "Login successful!");

            // Redirect based on user role after successful login
            const currentUser = get().user;
            if (currentUser && typeof window !== "undefined") {
              if (currentUser.role === "Staff") {
                window.location.href = "/staff";
              } else if (currentUser.role === "Renter") {
                window.location.href = "/dashboard";
              }
            }
          } else {
            throw new AuthError(loginResponse.message || "Login failed");
          }
        } catch (error) {
          const authError =
            error instanceof AuthError
              ? error
              : new AuthError("An error occurred during login");

          set({ error: authError.message, isAuthenticated: false, user: null });
          toast.error(authError.message);
          throw authError;
        } finally {
          set({ isLoading: false });
          useLoadingStore.getState().setAuthLoading(false);
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true, error: null });
        useLoadingStore.getState().setAuthLoading(true, "Logging out...");

        try {
          // Simulate logout delay for better UX
          await new Promise((resolve) => setTimeout(resolve, 500));

          AuthService.logout();

          // Clear cookies
          if (typeof document !== "undefined") {
            document.cookie =
              "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }

          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });

          // Show logout success message
          toast.success("Logout success!");

          // Set page loading for redirect
          useLoadingStore
            .getState()
            .setPageLoading(true, "Navigating to login page...");

          // Redirect to login page
          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        } catch (error) {
          console.error("Logout error:", error);
          set({ error: "An error occurred during logout", isLoading: false });
          toast.error("An error occurred during logout");
        } finally {
          useLoadingStore.getState().setAuthLoading(false);
        }
      },

      // Fetch current user
      fetchUser: async () => {
        if (!AuthService.isAuthenticated()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({ isLoading: true, error: null });
        useLoadingStore
          .getState()
          .setAuthLoading(true, "Loading user information...");

        try {
          const response = await AuthService.getCurrentUser();

          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              error: null,
            });

            // Set user data cookie for middleware
            if (typeof document !== "undefined") {
              const expires = new Date();
              expires.setDate(expires.getDate() + 7); // 7 days

              document.cookie = `user_data=${JSON.stringify({
                role: response.data.role,
                accountId: response.data.accountId,
              })}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
            }
          } else {
            throw new AuthError(
              response.message || "Unable to get user information"
            );
          }
        } catch (error) {
          const authError =
            error instanceof AuthError
              ? error
              : new AuthError("Unable to get user information");

          // If it's an auth error (401), clear the session
          if (authError.status === 401) {
            AuthService.logout();
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            });
          } else {
            set({ error: authError.message });
          }

          throw authError;
        } finally {
          set({ isLoading: false });
          useLoadingStore.getState().setAuthLoading(false);
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        // Only persist the user data, not loading states or errors
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, check if we have a valid token
        if (state && AuthService.isAuthenticated()) {
          // Fetch fresh user data
          state.fetchUser().catch(() => {
            // If fetching fails, clear the session
            state.logout().catch(console.error);
          });
        } else if (state) {
          // No valid token, clear the session
          state.user = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);

// Helper hooks for easier usage
export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    clearError: store.clearError,
  };
};

export const useUser = () => {
  const { user } = useAuthStore();
  return user;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated;
};

export const useIsLoading = () => {
  const { isLoading } = useAuthStore();
  return isLoading;
};
