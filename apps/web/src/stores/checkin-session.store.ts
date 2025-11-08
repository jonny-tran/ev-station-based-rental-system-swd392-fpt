/**
 * Check-in Session Store using Zustand
 * Global state management for check-in session operations
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckInSessionService } from "@/packages/services";
import { CheckInSessionApiError } from "@/packages/types/checkin";
import {
  BookingValidationResponse,
  CreateCheckInSessionResponse,
  CheckInSessionListItem,
  CheckInSessionListQuery,
  InspectionStatus,
} from "@/packages/types/checkin";
import { toast } from "@/lib/toast";
import { useLoadingStore } from "./loading.store";

// Import router for navigation
type Router = {
  push: (url: string) => void;
};

let router: Router | null = null;
export const setRouter = (routerInstance: Router) => {
  router = routerInstance;
};

// Interface for check-in session state
interface CheckInSessionState {
  // QR Code Validation State
  validatedBooking: BookingValidationResponse | null;
  isValidationLoading: boolean;
  validationError: string | null;

  // Current Session State
  currentSession: CreateCheckInSessionResponse | null;
  isCreatingSession: boolean;
  sessionError: string | null;

  // Session Details State (for step pages)
  sessionDetails: any | null;
  isLoadingSessionDetails: boolean;
  sessionDetailsError: string | null;

  // Sessions List State
  sessionsList: CheckInSessionListItem[];
  sessionsListTotal: number;
  sessionsListPage: number;
  sessionsListPageSize: number;
  isSessionsListLoading: boolean;
  sessionsListError: string | null;

  // Current Step State
  currentStep: number;
  isStepTransitioning: boolean;

  // Actions for QR Code Validation
  validateQRCode: (bookingId: string) => Promise<void>;
  clearValidation: () => void;

  // Actions for Session Management
  createSession: (bookingId: string) => Promise<void>;
  updateSessionStatus: (
    inspectionId: number,
    status: InspectionStatus,
    step?: number
  ) => Promise<void>;
  approveStep1: (inspectionId: number, notes?: string) => Promise<void>;
  rejectStep1: (inspectionId: number, reason: string) => Promise<void>;
  approveStep2: (
    inspectionId: number,
    photos: {
      front: File;
      rear: File;
      left: File;
      right: File;
      odo: File;
      battery: File;
    },
    vehicleData: {
      odometerKm: number;
      batteryLevel: number;
      vehicleConditionNotes?: string;
      damageNotes?: string;
    }
  ) => Promise<void>;
  rejectStep2: (inspectionId: number, reason: string) => Promise<void>;
  loadSessionDetails: (inspectionId: number) => Promise<void>;
  clearCurrentSession: () => void;
  clearSessionDetails: () => void;

  // Actions for Sessions List
  fetchSessionsList: (query?: CheckInSessionListQuery) => Promise<void>;
  refreshSessionsList: () => Promise<void>;
  clearSessionsList: () => void;

  // Actions for Step Management
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetSteps: () => void;

  // General Actions
  clearAllErrors: () => void;
  resetStore: () => void;

  // Computed Getters
  canProceedToNextStep: () => boolean;
  canGoToPreviousStep: () => boolean;
  getSessionsByStatus: (status: InspectionStatus) => CheckInSessionListItem[];
  getCurrentSessionStep: () => number;
}

export const useCheckInSessionStore = create<CheckInSessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      validatedBooking: null,
      isValidationLoading: false,
      validationError: null,
      currentSession: null,
      isCreatingSession: false,
      sessionError: null,
      sessionDetails: null,
      isLoadingSessionDetails: false,
      sessionDetailsError: null,
      sessionsList: [],
      sessionsListTotal: 0,
      sessionsListPage: 1,
      sessionsListPageSize: 10,
      isSessionsListLoading: false,
      sessionsListError: null,
      currentStep: 1,
      isStepTransitioning: false,

      // Validate QR Code
      validateQRCode: async (bookingId: string) => {
        if (!bookingId || bookingId.trim() === "") {
          set({ validationError: "Invalid booking ID" });
          return;
        }

        set({ isValidationLoading: true, validationError: null });
        useLoadingStore.getState().setApiLoading(true, "Validating QR code...");

        try {
          const response =
            await CheckInSessionService.validateQRCode(bookingId);

          // Check if there is data (regardless of success field)
          if (response.data) {
            set({
              validatedBooking: response.data,
              validationError: null,
            });

            toast.success("QR code validated successfully!");

            // Auto-create session after successful validation
            try {
              await get().createSession(bookingId);
            } catch (createError) {
              throw createError;
            }
          } else {
            // Only throw error if there is no data and success is false
            throw new CheckInSessionApiError(
              response.message || "QR code validation failed"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("QR code validation failed");

          set({ validationError: sessionError.message });

          // Handle specific error cases
          switch (sessionError.code) {
            case "BOOKING_NOT_FOUND":
              toast.error("Booking not found. Please check the QR code.");
              break;
            case "BOOKING_NOT_PENDING":
              toast.error("This booking is not in pending status.");
              break;
            case "SESSION_ALREADY_EXISTS":
              toast.error(
                "A check-in session already exists for this booking."
              );
              break;
            case "ACCESS_DENIED":
              toast.error(
                "Access denied. Only staff members can perform check-in."
              );
              break;
            default:
              toast.error(sessionError.message);
          }

          throw sessionError;
        } finally {
          set({ isValidationLoading: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Create Session
      createSession: async (bookingId: string) => {
        set({ isCreatingSession: true, sessionError: null });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Creating check-in session...");

        try {
          const response = await CheckInSessionService.createSession({
            bookingId,
          });

          // Check if there is data (regardless of success field)
          if (response.data) {
            set({
              currentSession: response.data,
              sessionError: null,
              currentStep: response.data.currentStep,
            });

            toast.success("Check-in session created successfully!");

            // TODO: Navigate to step1 page with inspectionId (commented out for now)
            // if (router && response.data.inspectionId) {
            //   router.push(
            //     `/staff/checkin-session/${response.data.inspectionId}/step1`
            //   );
            // }

            // Refresh sessions list to include the new session
            await get().refreshSessionsList();
          } else {
            throw new CheckInSessionApiError(
              response.message || "Failed to create check-in session"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to create check-in session");

          set({ sessionError: sessionError.message });

          // Handle specific error cases
          switch (sessionError.code) {
            case "SESSION_ALREADY_EXISTS":
              toast.error(
                "A check-in session already exists for this booking."
              );
              break;
            case "BOOKING_NOT_PENDING":
              toast.error("This booking is not in pending status.");
              break;
            case "ACCESS_DENIED":
              toast.error(
                "Access denied. Only staff members can create sessions."
              );
              break;
            default:
              toast.error(sessionError.message);
          }

          throw sessionError;
        } finally {
          set({ isCreatingSession: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Approve Step 1
      approveStep1: async (inspectionId: number, notes?: string) => {
        set({ isStepTransitioning: true });
        useLoadingStore.getState().setApiLoading(true, "Approving...");

        try {
          const response = await CheckInSessionService.approveStep1(
            inspectionId,
            notes
          );

          // Log response for debugging
          if (process.env.NODE_ENV === "development") {
            console.log("[approveStep1] Store response:", response);
          }

          // Kiểm tra nếu có data thì coi như thành công (bất kể success field)
          // Hoặc nếu có message và không phải error thì cũng coi là thành công
          if (response.data || (response.message && !response.errors)) {
            const responseData = response.data || response;

            // Update current session if it's the same session
            const currentSession = get().currentSession;
            if (
              currentSession &&
              currentSession.inspectionId === inspectionId
            ) {
              set({
                currentSession: {
                  ...currentSession,
                  status: responseData.status || "Pending",
                  currentStep: responseData.currentStep || 2,
                },
                currentStep: responseData.currentStep || 2,
              });
            }

            // Refresh sessions list
            await get().refreshSessionsList();

            toast.success(
              response.message || "Approved successfully. Moving to step 2."
            );
          } else {
            throw new CheckInSessionApiError(
              response.message || "Failed to approve step 1"
            );
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("[approveStep1] Store error:", error);
          }
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to approve step 1");

          toast.error(sessionError.message);
          throw sessionError;
        } finally {
          set({ isStepTransitioning: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Reject Step 1
      rejectStep1: async (inspectionId: number, reason: string) => {
        set({ isStepTransitioning: true });
        useLoadingStore.getState().setApiLoading(true, "Rejecting...");

        try {
          const response = await CheckInSessionService.rejectStep1(
            inspectionId,
            reason
          );

          // Kiểm tra nếu có data thì coi như thành công (bất kể success field)
          if (response.data) {
            // Update current session if it's the same session
            const currentSession = get().currentSession;
            if (
              currentSession &&
              currentSession.inspectionId === inspectionId
            ) {
              set({
                currentSession: {
                  ...currentSession,
                  status: "Rejected",
                },
              });
            }

            // Refresh sessions list
            await get().refreshSessionsList();

            toast.success(response.message || "Rejected successfully.");
          } else {
            throw new CheckInSessionApiError(
              response.message || "Failed to reject step 1"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to reject step 1");

          toast.error(sessionError.message);
          throw sessionError;
        } finally {
          set({ isStepTransitioning: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Approve Step 2 - Upload photos first, then update vehicle data
      approveStep2: async (
        inspectionId: number,
        photos: {
          front: File;
          rear: File;
          left: File;
          right: File;
          odo: File;
          battery: File;
        },
        vehicleData: {
          odometerKm: number;
          batteryLevel: number;
          vehicleConditionNotes?: string;
          damageNotes?: string;
        }
      ) => {
        set({ isStepTransitioning: true });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Uploading vehicle inspection photos...");

        try {
          // Step 1: Upload photos
          const uploadResponse =
            await CheckInSessionService.uploadInspectionPhotos(
              inspectionId,
              photos
            );

          // Kiểm tra nếu upload thành công
          // Response có thể có cấu trúc { data: { photoUrls: [...] } } hoặc { data: { ... } }
          if (!uploadResponse.data) {
            throw new CheckInSessionApiError(
              uploadResponse.message ||
                "Failed to upload vehicle inspection photos"
            );
          }

          toast.success("Vehicle inspection photos uploaded successfully!");

          // Step 2: Update vehicle data (this will create contract and move to step 3)
          useLoadingStore
            .getState()
            .setApiLoading(true, "Updating vehicle data...");

          const updateResponse = await CheckInSessionService.updateVehicleData(
            inspectionId,
            vehicleData
          );

          // Kiểm tra nếu có data thì coi như thành công (bất kể success field)
          if (
            updateResponse.data ||
            (updateResponse.message && !updateResponse.errors)
          ) {
            const responseData = updateResponse.data || updateResponse;

            // Update current session if it's the same session
            const currentSession = get().currentSession;
            if (
              currentSession &&
              currentSession.inspectionId === inspectionId
            ) {
              set({
                currentSession: {
                  ...currentSession,
                  status: responseData.status || "Pending",
                  currentStep: responseData.currentStep || 3,
                },
                currentStep: responseData.currentStep || 3,
              });
            }

            // Refresh sessions list
            await get().refreshSessionsList();

            toast.success(
              updateResponse.message ||
                "Vehicle data updated successfully. Moving to step 3."
            );
          } else {
            throw new CheckInSessionApiError(
              updateResponse.message || "Failed to update vehicle data"
            );
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("[approveStep2] Store error:", error);
          }
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to approve step 2");

          // Handle specific error cases
          switch (sessionError.code) {
            case "INVALID_INPUT":
              toast.error("Invalid data. Please check the information.");
              break;
            case "ACCESS_DENIED":
              toast.error(
                "Access denied. Only staff members can perform this action."
              );
              break;
            default:
              toast.error(sessionError.message);
          }

          throw sessionError;
        } finally {
          set({ isStepTransitioning: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Reject Step 2
      rejectStep2: async (inspectionId: number, reason: string) => {
        set({ isStepTransitioning: true });
        useLoadingStore.getState().setApiLoading(true, "Rejecting...");

        try {
          const response = await CheckInSessionService.rejectStep2(
            inspectionId,
            reason
          );

          // Kiểm tra nếu có data thì coi như thành công (bất kể success field)
          if (response.data || (response.message && !response.errors)) {
            // Update current session if it's the same session
            const currentSession = get().currentSession;
            if (
              currentSession &&
              currentSession.inspectionId === inspectionId
            ) {
              set({
                currentSession: {
                  ...currentSession,
                  status: "Rejected",
                },
              });
            }

            // Refresh sessions list
            await get().refreshSessionsList();

            toast.success(response.message || "Rejected successfully.");
          } else {
            throw new CheckInSessionApiError(
              response.message || "Failed to reject step 2"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to reject step 2");

          toast.error(sessionError.message);
          throw sessionError;
        } finally {
          set({ isStepTransitioning: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Update Session Status
      updateSessionStatus: async (
        inspectionId: number,
        status: InspectionStatus,
        step?: number
      ) => {
        set({ isStepTransitioning: true });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Updating session status...");

        try {
          const response = await CheckInSessionService.updateSessionStatus(
            inspectionId,
            status,
            step
          );

          if (response.success) {
            // Update current session if it's the same session
            const currentSession = get().currentSession;
            if (
              currentSession &&
              currentSession.inspectionId === inspectionId
            ) {
              set({
                currentSession: {
                  ...currentSession,
                  status,
                  currentStep: step || currentSession.currentStep,
                },
                currentStep: step || currentSession.currentStep,
              });
            }

            // Refresh sessions list
            await get().refreshSessionsList();

            toast.success("Session status updated successfully!");
          } else {
            throw new CheckInSessionApiError(
              response.message || "Failed to update session status"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to update session status");

          toast.error(sessionError.message);
          throw sessionError;
        } finally {
          set({ isStepTransitioning: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Fetch Sessions List
      fetchSessionsList: async (query: CheckInSessionListQuery = {}) => {
        set({ isSessionsListLoading: true, sessionsListError: null });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Loading sessions list...");

        try {
          // Merge with current pagination state
          const currentQuery = {
            page: get().sessionsListPage,
            pageSize: get().sessionsListPageSize,
            ...query,
          };

          const response =
            await CheckInSessionService.getSessionsList(currentQuery);

          // Check if response has data (successful response)
          if (response && response.data) {
            // Handle both direct data and nested data structure
            const data = response.data;
            if (data && typeof data === "object" && "sessions" in data) {
              // Nested structure: { total, page, pageSize, sessions }
              const { total, page, pageSize, sessions } = data;
              set({
                sessionsList: sessions || [],
                sessionsListTotal: total || 0,
                sessionsListPage: page || 1,
                sessionsListPageSize: pageSize || 10,
                sessionsListError: null,
              });
            } else if (Array.isArray(data)) {
              // Direct array structure
              const sessionsArray = data as CheckInSessionListItem[];
              set({
                sessionsList: sessionsArray,
                sessionsListTotal: sessionsArray.length,
                sessionsListPage: currentQuery.page || 1,
                sessionsListPageSize: currentQuery.pageSize || 10,
                sessionsListError: null,
              });
            } else {
              // Fallback for other structures
              set({
                sessionsList: [],
                sessionsListTotal: 0,
                sessionsListPage: currentQuery.page || 1,
                sessionsListPageSize: currentQuery.pageSize || 10,
                sessionsListError: null,
              });
            }
          } else {
            throw new CheckInSessionApiError(
              response.message || "Failed to load sessions list"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError("Failed to load sessions list");

          set({ sessionsListError: sessionError.message });

          if (sessionError.code === "ACCESS_DENIED") {
            toast.error("Access denied. Only staff members can view sessions.");
          } else {
            toast.error(sessionError.message);
          }

          throw sessionError;
        } finally {
          set({ isSessionsListLoading: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Refresh Sessions List
      refreshSessionsList: async () => {
        const currentQuery = {
          page: get().sessionsListPage,
          pageSize: get().sessionsListPageSize,
        };
        await get().fetchSessionsList(currentQuery);
      },

      // Clear Validation
      clearValidation: () => {
        set({
          validatedBooking: null,
          validationError: null,
          isValidationLoading: false,
        });
      },

      // Load Session Details by ID
      loadSessionDetails: async (inspectionId: number) => {
        set({ isLoadingSessionDetails: true, sessionDetailsError: null });
        useLoadingStore
          .getState()
          .setApiLoading(true, "Loading check-in session information...");

        try {
          const response =
            await CheckInSessionService.getSessionById(inspectionId);

          // Kiểm tra nếu có data thì coi như thành công (bất kể success field)
          if (response.data) {
            set({
              sessionDetails: response.data,
              sessionDetailsError: null,
            });

            // Update current step based on session data
            if (response.data.inspection?.currentStep) {
              set({ currentStep: response.data.inspection.currentStep });
            }
          } else {
            throw new CheckInSessionApiError(
              response.message || "Check-in session information not found"
            );
          }
        } catch (error) {
          const sessionError = CheckInSessionService.isCheckInSessionError(
            error
          )
            ? error
            : new CheckInSessionApiError(
                "Error loading check-in session information"
              );

          set({ sessionDetailsError: sessionError.message });
          throw sessionError;
        } finally {
          set({ isLoadingSessionDetails: false });
          useLoadingStore.getState().setApiLoading(false);
        }
      },

      // Clear Current Session
      clearCurrentSession: () => {
        set({
          currentSession: null,
          sessionError: null,
          isCreatingSession: false,
          currentStep: 1,
        });
      },

      // Clear Session Details
      clearSessionDetails: () => {
        set({
          sessionDetails: null,
          sessionDetailsError: null,
          isLoadingSessionDetails: false,
        });
      },

      // Clear Sessions List
      clearSessionsList: () => {
        set({
          sessionsList: [],
          sessionsListTotal: 0,
          sessionsListPage: 1,
          sessionsListError: null,
          isSessionsListLoading: false,
        });
      },

      // Set Current Step
      setCurrentStep: (step: number) => {
        if (step >= 1 && step <= 5) {
          set({ currentStep: step });
        }
      },

      // Go to Next Step
      goToNextStep: () => {
        const currentStep = get().currentStep;
        if (currentStep < 5) {
          set({ currentStep: currentStep + 1 });
        }
      },

      // Go to Previous Step
      goToPreviousStep: () => {
        const currentStep = get().currentStep;
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Reset Steps
      resetSteps: () => {
        set({ currentStep: 1 });
      },

      // Clear All Errors
      clearAllErrors: () => {
        set({
          validationError: null,
          sessionError: null,
          sessionsListError: null,
        });
      },

      // Reset Store
      resetStore: () => {
        set({
          validatedBooking: null,
          isValidationLoading: false,
          validationError: null,
          currentSession: null,
          isCreatingSession: false,
          sessionError: null,
          sessionDetails: null,
          isLoadingSessionDetails: false,
          sessionDetailsError: null,
          sessionsList: [],
          sessionsListTotal: 0,
          sessionsListPage: 1,
          sessionsListPageSize: 10,
          isSessionsListLoading: false,
          sessionsListError: null,
          currentStep: 1,
          isStepTransitioning: false,
        });
      },

      // Computed: Can proceed to next step
      canProceedToNextStep: () => {
        const { currentStep, currentSession } = get();
        return currentStep < 5 && currentSession !== null;
      },

      // Computed: Can go to previous step
      canGoToPreviousStep: () => {
        const { currentStep } = get();
        return currentStep > 1;
      },

      // Computed: Get sessions by status
      getSessionsByStatus: (status: InspectionStatus) => {
        return get().sessionsList.filter(
          (session) => session.status === status
        );
      },

      // Computed: Get current session step
      getCurrentSessionStep: () => {
        const { currentSession, currentStep } = get();
        return currentSession?.currentStep || currentStep;
      },
    }),
    {
      name: "checkin-session-storage", // localStorage key
      partialize: (state) => ({
        // Only persist essential state, not loading states or errors
        currentSession: state.currentSession,
        currentStep: state.currentStep,
        sessionsListPage: state.sessionsListPage,
        sessionsListPageSize: state.sessionsListPageSize,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, validate the current session
        if (state && state.currentSession) {
          // Reset to step 1 if session exists but no current step
          if (!state.currentStep) {
            state.currentStep = 1;
          }
        }
      },
    }
  )
);

// Helper hooks for easier usage
export const useQRCodeValidation = () => {
  const store = useCheckInSessionStore();

  return {
    validatedBooking: store.validatedBooking,
    isValidationLoading: store.isValidationLoading,
    validationError: store.validationError,
    validateQRCode: store.validateQRCode,
    clearValidation: store.clearValidation,
  };
};

export const useCurrentSession = () => {
  const store = useCheckInSessionStore();

  return {
    currentSession: store.currentSession,
    isCreatingSession: store.isCreatingSession,
    sessionError: store.sessionError,
    createSession: store.createSession,
    updateSessionStatus: store.updateSessionStatus,
    approveStep1: store.approveStep1,
    rejectStep1: store.rejectStep1,
    approveStep2: store.approveStep2,
    rejectStep2: store.rejectStep2,
    clearCurrentSession: store.clearCurrentSession,
    // Session Details
    sessionDetails: store.sessionDetails,
    isLoadingSessionDetails: store.isLoadingSessionDetails,
    sessionDetailsError: store.sessionDetailsError,
    loadSessionDetails: store.loadSessionDetails,
    clearSessionDetails: store.clearSessionDetails,
  };
};

export const useSessionsList = () => {
  const store = useCheckInSessionStore();

  return {
    sessionsList: store.sessionsList,
    sessionsListTotal: store.sessionsListTotal,
    sessionsListPage: store.sessionsListPage,
    sessionsListPageSize: store.sessionsListPageSize,
    isSessionsListLoading: store.isSessionsListLoading,
    sessionsListError: store.sessionsListError,
    fetchSessionsList: store.fetchSessionsList,
    refreshSessionsList: store.refreshSessionsList,
    clearSessionsList: store.clearSessionsList,
    getSessionsByStatus: store.getSessionsByStatus,
  };
};

export const useSessionSteps = () => {
  const store = useCheckInSessionStore();

  return {
    currentStep: store.currentStep,
    isStepTransitioning: store.isStepTransitioning,
    setCurrentStep: store.setCurrentStep,
    goToNextStep: store.goToNextStep,
    goToPreviousStep: store.goToPreviousStep,
    resetSteps: store.resetSteps,
    canProceedToNextStep: store.canProceedToNextStep(),
    canGoToPreviousStep: store.canGoToPreviousStep(),
    getCurrentSessionStep: store.getCurrentSessionStep(),
  };
};

// Combined hook for all check-in session operations
export const useCheckInSessionOperations = () => {
  const store = useCheckInSessionStore();

  return {
    // QR Code Validation
    validatedBooking: store.validatedBooking,
    isValidationLoading: store.isValidationLoading,
    validationError: store.validationError,
    validateQRCode: store.validateQRCode,
    clearValidation: store.clearValidation,

    // Current Session
    currentSession: store.currentSession,
    isCreatingSession: store.isCreatingSession,
    sessionError: store.sessionError,
    createSession: store.createSession,
    updateSessionStatus: store.updateSessionStatus,
    approveStep1: store.approveStep1,
    rejectStep1: store.rejectStep1,
    approveStep2: store.approveStep2,
    rejectStep2: store.rejectStep2,
    clearCurrentSession: store.clearCurrentSession,
    // Session Details
    sessionDetails: store.sessionDetails,
    isLoadingSessionDetails: store.isLoadingSessionDetails,
    sessionDetailsError: store.sessionDetailsError,
    loadSessionDetails: store.loadSessionDetails,
    clearSessionDetails: store.clearSessionDetails,

    // Sessions List
    sessionsList: store.sessionsList,
    sessionsListTotal: store.sessionsListTotal,
    sessionsListPage: store.sessionsListPage,
    sessionsListPageSize: store.sessionsListPageSize,
    isSessionsListLoading: store.isSessionsListLoading,
    sessionsListError: store.sessionsListError,
    fetchSessionsList: store.fetchSessionsList,
    refreshSessionsList: store.refreshSessionsList,
    clearSessionsList: store.clearSessionsList,
    getSessionsByStatus: store.getSessionsByStatus,

    // Steps Management
    currentStep: store.currentStep,
    isStepTransitioning: store.isStepTransitioning,
    setCurrentStep: store.setCurrentStep,
    goToNextStep: store.goToNextStep,
    goToPreviousStep: store.goToPreviousStep,
    resetSteps: store.resetSteps,
    canProceedToNextStep: store.canProceedToNextStep(),
    canGoToPreviousStep: store.canGoToPreviousStep(),
    getCurrentSessionStep: store.getCurrentSessionStep(),

    // General Actions
    clearAllErrors: store.clearAllErrors,
    resetStore: store.resetStore,
  };
};

// Utility hooks for specific use cases
export const usePendingSessions = () => {
  const { getSessionsByStatus } = useCheckInSessionStore();
  return getSessionsByStatus("Pending");
};

export const useApprovedSessions = () => {
  const { getSessionsByStatus } = useCheckInSessionStore();
  return getSessionsByStatus("Approved");
};

export const useCompletedSessions = () => {
  const { getSessionsByStatus } = useCheckInSessionStore();
  return getSessionsByStatus("Completed");
};

export const useRejectedSessions = () => {
  const { getSessionsByStatus } = useCheckInSessionStore();
  return getSessionsByStatus("Rejected");
};
