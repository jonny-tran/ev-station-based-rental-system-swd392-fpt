"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "staff" | "renter";

export interface User {
  id: string;
  emailOrPhone: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    emailOrPhone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const userRole = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user-role="))
        ?.split("=")[1] as UserRole;

      if (token && userRole) {
        // You can decode JWT token here to get user info
        // For now, we'll create a mock user object
        setUser({
          id: "1",
          emailOrPhone: "user@example.com",
          role: userRole,
          name: userRole === "staff" ? "Staff User" : "Renter User",
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    emailOrPhone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ emailOrPhone, password }),
      // });

      // Mock login logic - replace with actual API call
      const mockUsers = [
        {
          emailOrPhone: "staff@example.com",
          password: "password123",
          role: "staff" as UserRole,
        },
        {
          emailOrPhone: "renter@example.com",
          password: "password123",
          role: "renter" as UserRole,
        },
        {
          emailOrPhone: "0901234567",
          password: "password123",
          role: "staff" as UserRole,
        },
        {
          emailOrPhone: "0987654321",
          password: "password123",
          role: "renter" as UserRole,
        },
      ];

      const foundUser = mockUsers.find(
        (u) => u.emailOrPhone === emailOrPhone && u.password === password
      );

      if (!foundUser) {
        return { success: false, error: "Invalid credentials" };
      }

      // Set cookies
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // 7 days

      document.cookie = `auth-token=mock-jwt-token; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
      document.cookie = `user-role=${foundUser.role}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;

      setUser({
        id: "1",
        emailOrPhone: foundUser.emailOrPhone,
        role: foundUser.role,
        name: foundUser.role === "staff" ? "Staff User" : "Renter User",
      });

      // Redirect based on role
      if (foundUser.role === "staff") {
        router.push("/staff");
      } else {
        router.push("/dashboard");
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear cookies
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setUser(null);
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
