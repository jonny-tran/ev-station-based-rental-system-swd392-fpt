/**
 * Safe toast utility to handle browser extension conflicts
 */

import { toast as sonnerToast } from "sonner";

// Wrap sonner toast functions to handle browser extension conflicts
export const toast = {
  success: (message: string) => {
    try {
      sonnerToast.success(message);
    } catch {
      console.log(
        "Toast notification skipped due to browser extension conflict"
      );
    }
  },
  error: (message: string) => {
    try {
      sonnerToast.error(message);
    } catch {
      console.log(
        "Toast notification skipped due to browser extension conflict"
      );
    }
  },
  info: (message: string) => {
    try {
      sonnerToast.info(message);
    } catch {
      console.log(
        "Toast notification skipped due to browser extension conflict"
      );
    }
  },
  warning: (message: string) => {
    try {
      sonnerToast.warning(message);
    } catch {
      console.log(
        "Toast notification skipped due to browser extension conflict"
      );
    }
  },
};
