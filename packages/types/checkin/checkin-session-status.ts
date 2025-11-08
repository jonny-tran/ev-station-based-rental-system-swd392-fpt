/**
 * Check-in Session Status Types
 * Types related to check-in session status
 */

import { InspectionStatus, InspectionType } from "./checkin-session";

/**
 * Check-in Session Status Options
 * Available status options for filtering
 */
export const INSPECTION_STATUS_OPTIONS: Array<{
  value: InspectionStatus;
  label: string;
  description: string;
}> = [
  {
    value: "Pending",
    label: "Pending",
    description: "Inspection session is pending processing",
  },
  {
    value: "Approved",
    label: "Approved",
    description: "Inspection session has been approved",
  },
  {
    value: "Completed",
    label: "Completed",
    description: "Inspection session has been completed",
  },
  {
    value: "Rejected",
    label: "Rejected",
    description: "Inspection session has been rejected",
  },
];

/**
 * Inspection Type Options
 * Available inspection type options
 */
export const INSPECTION_TYPE_OPTIONS: Array<{
  value: InspectionType;
  label: string;
  description: string;
}> = [
  {
    value: "check_in",
    label: "Check-in",
    description: "Inspection when receiving vehicle",
  },
  {
    value: "check_out",
    label: "Check-out",
    description: "Inspection when returning vehicle",
  },
];

/**
 * Check-in Session Status Colors
 * Colors for different statuses
 */
export const INSPECTION_STATUS_COLORS: Record<InspectionStatus, string> = {
  Pending: "#f59e0b", // amber-500
  Approved: "#10b981", // emerald-500
  Completed: "#059669", // emerald-600
  Rejected: "#ef4444", // red-500
};

/**
 * Check-in Session Status Icons
 * Icons for different statuses
 */
export const INSPECTION_STATUS_ICONS: Record<InspectionStatus, string> = {
  Pending: "clock",
  Approved: "check-circle",
  Completed: "check-circle-2",
  Rejected: "x-circle",
};

/**
 * Check-in Session Step Information
 * Information about steps in the check-in process
 */
export const CHECKIN_SESSION_STEPS = [
  {
    step: 1,
    title: "QR Code Verification",
    description: "Scan and verify booking QR code",
    icon: "qr-code",
  },
  {
    step: 2,
    title: "Vehicle Handover & Inspection",
    description: "Handover vehicle and inspect condition",
    icon: "car",
  },
  {
    step: 3,
    title: "Vehicle Inspection",
    description: "Inspect vehicle condition before handover",
    icon: "car",
  },
  {
    step: 4,
    title: "Contract Signing",
    description: "Sign rental agreement",
    icon: "pen-tool",
  },
  {
    step: 5,
    title: "Completion",
    description: "Complete check-in process",
    icon: "check-circle",
  },
];

/**
 * Get step information by step number
 */
export const getStepInfo = (step: number) => {
  return CHECKIN_SESSION_STEPS.find((s) => s.step === step) || null;
};

/**
 * Get next step number
 */
export const getNextStep = (currentStep: number): number | null => {
  const nextStep = currentStep + 1;
  return nextStep <= CHECKIN_SESSION_STEPS.length ? nextStep : null;
};

/**
 * Get previous step number
 */
export const getPreviousStep = (currentStep: number): number | null => {
  const prevStep = currentStep - 1;
  return prevStep >= 1 ? prevStep : null;
};

/**
 * Check if step is the last step
 */
export const isLastStep = (currentStep: number): boolean => {
  return currentStep === CHECKIN_SESSION_STEPS.length;
};

/**
 * Check if step is the first step
 */
export const isFirstStep = (currentStep: number): boolean => {
  return currentStep === 1;
};
