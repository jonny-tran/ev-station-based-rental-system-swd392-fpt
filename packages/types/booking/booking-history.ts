/**
 * Booking History Types
 */

import { BaseEntityAutoId } from "../common/base";
import { BookingHistoryAction, BookingHistoryPerformer } from "./booking";

/**
 * Booking History Entity
 */
export interface BookingHistory extends BaseEntityAutoId {
  bookingId: string;
  action: BookingHistoryAction;
  actionDateTime: string;
  performedBy: BookingHistoryPerformer;
  description?: string;
}

/**
 * Create Booking History Request
 */
export interface CreateBookingHistoryRequest {
  bookingId: string;
  action: BookingHistoryAction;
  performedBy: BookingHistoryPerformer;
  description?: string;
}
