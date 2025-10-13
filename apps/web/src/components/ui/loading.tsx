"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  overlay?: boolean;
}

export function Loading({
  size = "md",
  text,
  className,
  overlay = false,
}: LoadingProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <LoadingSpinner size={size} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

interface LoadingPageProps {
  text?: string;
}

export function LoadingPage({ text = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
      </div>

      <div className="text-center space-y-8 p-8 relative z-10">
        {/* Animated Logo/Icon */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Inner logo container */}
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <svg
                className="w-12 h-12 text-white animate-bounce"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
          </div>

          {/* Floating dots around the logo */}
          <div className="absolute inset-0">
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "500ms" }}
            ></div>
            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "1000ms" }}
            ></div>
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "1500ms" }}
            ></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-6">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {text}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Enhanced loading dots */}
          <div className="flex justify-center space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: "450ms" }}
            ></div>
          </div>

          {/* Progress bar simulation */}
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"
              style={{
                animation: "progress 2s ease-in-out infinite",
                width: "60%",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 20%;
          }
          50% {
            width: 80%;
          }
          100% {
            width: 20%;
          }
        }
      `}</style>
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function LoadingButton({
  children,
  loading,
  disabled,
  className,
  onClick,
  type = "button",
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </Button>
  );
}
