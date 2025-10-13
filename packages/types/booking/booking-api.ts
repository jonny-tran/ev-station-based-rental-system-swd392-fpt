/**
 * Booking API Response Types
 * Các types cho API response của booking endpoints
 */

import { BookingStatus } from "./booking-status";

/**
 * Vehicle info trong booking response
 */
export interface BookingVehicleInfo {
  name: string; // Brand + Model
  licensePlate: string;
}

/**
 * Rental Location info trong booking response
 */
export interface BookingRentalLocationInfo {
  name: string;
  address: string;
}

/**
 * Booking info với computed fields (cho GET /booking/all)
 */
export interface BookingWithComputedFields {
  bookingId: string;
  renterId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  depositAmount: number;
  status: BookingStatus;
  createdAt: string;
  totalAmount: number; // Computed field: DepositAmount × hours
  vehicle: BookingVehicleInfo;
  rentalLocation: BookingRentalLocationInfo;
}

/**
 * Vehicle details cho booking details response
 */
export interface BookingVehicleDetails {
  vehicleId: string;
  rentalLocationId: string;
  licensePlate: string;
  model: string;
  brand: string;
  year: number;
  mileage: number;
  batteryCapacity: number;
  batteryLevel: number;
  chargingCycles: number;
  color: string;
  imageUrl: string;
  rentalRate: number;
  lastServiceDate: string;
  status: string;
}

/**
 * Rental Location details cho booking details response
 */
export interface BookingRentalLocationDetails {
  rentalLocationId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  contactNumber: string;
  openingHours: string;
  closingHours: string;
  latitude: number;
  longitude: number;
}

/**
 * Booking details response (cho GET /booking/details/:bookingId)
 */
export interface BookingDetailsResponse {
  bookingId: string;
  renterId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  depositAmount: number;
  status: BookingStatus;
  createdAt: string;
  totalAmount: number;
  vehicle: BookingVehicleDetails;
  rentalLocation: BookingRentalLocationDetails;
}

/**
 * API Response cho GET /booking/all
 */
export interface GetAllBookingsResponse {
  message: string;
  data: BookingWithComputedFields[];
}

/**
 * API Response cho GET /booking/details/:bookingId
 */
export interface GetBookingDetailsResponse {
  message: string;
  data: BookingDetailsResponse;
}
