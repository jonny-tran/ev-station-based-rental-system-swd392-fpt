/**
 * Enum Exports
 * Centralized exports for all enums used across the application
 */

// Contract enums
export { ContractStatus } from "./contract/contract-status";
export type { ContractStatusType } from "./contract/contract-status";

// Booking enums
export { BookingStatus } from "./booking/booking-status";
export type { BookingStatusType } from "./booking/booking-status";

// Vehicle enums
export { VehicleStatus } from "./vehicle/vehicle-status";
export type { VehicleStatusType } from "./vehicle/vehicle-status";
export { VehicleInspectionStatus } from "./vehicle/vehicle-inspection";

// Check-in enums
export type { InspectionStatus } from "./checkin/checkin-session";
export type { InspectionType } from "./checkin/checkin-session";

// Common enums
export {
  UserRole,
  AccountStatus,
  GeneralStatus,
  VerificationStatus,
  Currency,
  SortOrder,
} from "./common/shared-enums";

