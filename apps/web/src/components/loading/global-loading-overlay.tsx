"use client";

import { useGlobalLoading } from "@/stores/loading.store";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalLoadingOverlay() {
  const { isAnyLoading, loadingMessage } = useGlobalLoading();

  return (
    <AnimatePresence>
      {isAnyLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="text-center space-y-6 p-8">
            {/* Animated Logo/Icon */}
            <div className="relative">
              <div className="animate-pulse">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                </div>
              </div>

              {/* Spinning ring around the icon */}
              <div className="absolute inset-0 animate-spin">
                <div className="w-20 h-20 mx-auto border-4 border-transparent border-t-blue-500 border-r-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Loading text */}
            <div className="space-y-3">
              <p className="text-lg font-medium text-foreground animate-pulse">
                {loadingMessage || "Loading..."}
              </p>
              <div className="flex justify-center space-x-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
