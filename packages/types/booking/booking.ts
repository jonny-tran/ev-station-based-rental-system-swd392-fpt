/**
 * Booking Types
 */

import { BaseEntityUUID } from "../common/base";
import { BookingStatus } from "./booking-status";

/**
 * Booking Entity
 */
export interface Booking extends BaseEntityUUID {
  renterId: string;
  vehicleId: string;
  rentalLocationId: string;
  startTime: string; // datetime2
  endTime: string; // datetime2
  depositAmount: number; // decimal(10,2)
  status: BookingStatus;
  cancelledAt?: string;
}

/**
 * Create Booking Request
 */
export interface CreateBookingRequest {
  renterId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  depositAmount: number;
}

/**
 * Update Booking Request
 */
export interface UpdateBookingRequest {
  startTime?: string;
  endTime?: string;
  depositAmount?: number;
  status?: BookingStatus;
}

/**
 * Booking with Related Data
 */
export interface BookingWithDetails extends Booking {
  renter: {
    id: string;
    accountId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  vehicle: {
    id: string;
    licensePlate: string;
    model: string;
    brand: string;
    rentalRate?: number;
  };
  rentalLocation: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}

/**
 * Booking History Action
 */
export enum BookingHistoryAction {
  Created = "Created",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Completed = "Completed",
  Expired = "Expired",
}

/**
 * Booking History Performer
 */
export enum BookingHistoryPerformer {
  Staff = "Staff",
  Renter = "Renter",
}
