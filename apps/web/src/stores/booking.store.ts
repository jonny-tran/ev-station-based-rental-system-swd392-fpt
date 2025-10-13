/**
 * Booking Store using Zustand
 * Global state management for booking operations
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BookingService, BookingError } from "@/packages/services";
import {
  BookingWithComputedFields,
  BookingDetailsResponse,
  BookingStatus,
} from "@/packages/types/booking";
import { toast } from "@/lib/toast";
import { useLoadingStore } from "./loading.store";

// Interface for booking state
interface BookingState {
  // State
  bookings: BookingWithComputedFields[];
  selectedBooking: BookingDetailsResponse | null;
  isLoading: boolean;
  isDetailsLoading: boolean;
  error: string | null;
  lastFetched: number | null; // timestamp for cache invalidation

  // Actions
  fetchAllBookings: () => Promise<void>;
  fetchBookingDetails: (bookingId: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
  clearError: () => void;
  clearSelectedBooking: () => void;
  setLoading: (loading: boolean) => void;
  setDetailsLoading: (loading: boolean) => void;

  // Computed getters
  getBookingsByStatus: (status: BookingStatus) => BookingWithComputedFields[];
  getUpcomingBookings: () => BookingWithComputedFields[];
  getTotalAmount: () => number;
  getBookingCount: () => number;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      bookings: [],
      selectedBooking: null,
      isLoading: false,
      isDetailsLoading: false,
      error: null,
      lastFetched: null,

      // Fetch all bookings
      fetchAllBookings: async () => {
        const state = get();

        // Check cache validity
        const now = Date.now();
        if (
          state.lastFetched &&
          now - state.lastFetched < CACHE_DURATION &&
          state.bookings.length > 0
        ) {
          // Use cached data
          return;
        }

        set({ isLoading: true, error: null });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Loading booking list...");

        try {
          const bookings = await BookingService.getAllBookings();

          set({
            bookings,
            lastFetched: now,
            error: null,
          });
        } catch (error) {
          const bookingError =
            error instanceof BookingError
              ? error
              : new BookingError("Unable to load booking list");

          set({ error: bookingError.message });

          // Handle different error types
          if (bookingError.isAuthError()) {
            toast.error("Your session has expired. Please log in again.");
            // Redirect to login will be handled by api-client interceptor
          } else if (bookingError.isServerError()) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error(bookingError.message);
          }

          throw bookingError;
        } finally {
          set({ isLoading: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Fetch booking details
      fetchBookingDetails: async (bookingId: string) => {
        if (!bookingId || bookingId.trim() === "") {
          set({ error: "Invalid booking ID" });
          return;
        }

        set({ isDetailsLoading: true, error: null });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Loading booking details...");

        try {
          const bookingDetails =
            await BookingService.getBookingDetails(bookingId);

          set({
            selectedBooking: bookingDetails,
            error: null,
          });
        } catch (error) {
          const bookingError =
            error instanceof BookingError
              ? error
              : new BookingError("Unable to load booking details");

          set({ error: bookingError.message });

          // Handle different error types
          if (bookingError.isAuthError()) {
            toast.error("Your session has expired. Please log in again.");
          } else if (bookingError.isNotFoundError()) {
            toast.error(
              "Booking not found or you don't have access permission."
            );
          } else if (bookingError.isServerError()) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error(bookingError.message);
          }

          throw bookingError;
        } finally {
          set({ isDetailsLoading: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Refresh bookings (force fetch)
      refreshBookings: async () => {
        set({ lastFetched: null }); // Clear cache
        await get().fetchAllBookings();
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear selected booking
      clearSelectedBooking: () => {
        set({ selectedBooking: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Set details loading state
      setDetailsLoading: (loading: boolean) => {
        set({ isDetailsLoading: loading });
      },

      // Get bookings by status
      getBookingsByStatus: (status: BookingStatus) => {
        return get().bookings.filter((booking) => booking.status === status);
      },

      // Get upcoming bookings (start time is in the future)
      getUpcomingBookings: () => {
        const now = new Date();
        return get().bookings.filter(
          (booking) => new Date(booking.startTime) > now
        );
      },

      // Get total amount of all bookings
      getTotalAmount: () => {
        return get().bookings.reduce(
          (total, booking) => total + booking.totalAmount,
          0
        );
      },

      // Get booking count
      getBookingCount: () => {
        return get().bookings.length;
      },
    }),
    {
      name: "booking-storage", // localStorage key
      partialize: (state) => ({
        // Only persist the bookings data and cache info, not loading states or errors
        bookings: state.bookings,
        lastFetched: state.lastFetched,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, check cache validity
        if (state) {
          const now = Date.now();
          if (!state.lastFetched || now - state.lastFetched >= CACHE_DURATION) {
            // Cache expired, clear it
            state.bookings = [];
            state.lastFetched = null;
          }
        }
      },
    }
  )
);

// Helper hooks for easier usage
export const useBookings = () => {
  const store = useBookingStore();

  return {
    bookings: store.bookings,
    isLoading: store.isLoading,
    error: store.error,
    fetchAllBookings: store.fetchAllBookings,
    refreshBookings: store.refreshBookings,
    clearError: store.clearError,
  };
};

export const useBookingDetails = () => {
  const store = useBookingStore();

  return {
    selectedBooking: store.selectedBooking,
    isDetailsLoading: store.isDetailsLoading,
    error: store.error,
    fetchBookingDetails: store.fetchBookingDetails,
    clearSelectedBooking: store.clearSelectedBooking,
    clearError: store.clearError,
  };
};

export const useBookingStats = () => {
  const store = useBookingStore();

  return {
    totalBookings: store.getBookingCount(),
    totalAmount: store.getTotalAmount(),
    upcomingBookings: store.getUpcomingBookings(),
    getBookingsByStatus: store.getBookingsByStatus,
  };
};

// Combined hook for all booking operations
export const useBookingOperations = () => {
  const store = useBookingStore();

  return {
    // State
    bookings: store.bookings,
    selectedBooking: store.selectedBooking,
    isLoading: store.isLoading,
    isDetailsLoading: store.isDetailsLoading,
    error: store.error,
    lastFetched: store.lastFetched,

    // Actions
    fetchAllBookings: store.fetchAllBookings,
    fetchBookingDetails: store.fetchBookingDetails,
    refreshBookings: store.refreshBookings,
    clearError: store.clearError,
    clearSelectedBooking: store.clearSelectedBooking,
    setLoading: store.setLoading,
    setDetailsLoading: store.setDetailsLoading,

    // Computed
    getBookingsByStatus: store.getBookingsByStatus,
    getUpcomingBookings: store.getUpcomingBookings,
    getTotalAmount: store.getTotalAmount,
    getBookingCount: store.getBookingCount,
  };
};

// Utility hooks for specific use cases
export const usePendingBookings = () => {
  const { getBookingsByStatus } = useBookingStore();
  return getBookingsByStatus(BookingStatus.Pending);
};

export const useConfirmedBookings = () => {
  const { getBookingsByStatus } = useBookingStore();
  return getBookingsByStatus(BookingStatus.Confirmed);
};

export const useCompletedBookings = () => {
  const { getBookingsByStatus } = useBookingStore();
  return getBookingsByStatus(BookingStatus.Completed);
};

export const useCancelledBookings = () => {
  const { getBookingsByStatus } = useBookingStore();
  return getBookingsByStatus(BookingStatus.Cancelled);
};
