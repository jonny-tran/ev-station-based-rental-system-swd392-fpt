"use client";

import { useAuth } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        if (user.role === "Staff") {
          router.push("/staff");
        } else if (user.role === "Renter") {
          router.push("/dashboard");
        }
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or role not allowed
  if (
    !isAuthenticated ||
    (allowedRoles && user && !allowedRoles.includes(user.role))
  ) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function StaffOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["Staff"]}>{children}</ProtectedRoute>;
}

export function RenterOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["Renter"]}>{children}</ProtectedRoute>;
}

export function AuthenticatedOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
