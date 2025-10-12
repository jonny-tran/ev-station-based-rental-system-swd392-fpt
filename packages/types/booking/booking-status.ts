/**
 * Booking Status Enums and Types
 */

export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Expired = "Expired",
  Completed = "Completed",
}

export type BookingStatusType = keyof typeof BookingStatus;
