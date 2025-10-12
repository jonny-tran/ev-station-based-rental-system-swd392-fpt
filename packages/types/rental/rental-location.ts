/**
 * Rental Location Types
 */

import { BaseEntityUUID } from "../common/base";

/**
 * Rental Location Entity
 */
export interface RentalLocation extends BaseEntityUUID {
  name: string;
  address: string;
  city: string;
  country: string;
  contactNumber?: string;
  openingHours?: string;
  closingHours?: string;
  latitude?: number; // decimal(10,6)
  longitude?: number; // decimal(10,6)
}

/**
 * Create Rental Location Request
 */
export interface CreateRentalLocationRequest {
  name: string;
  address: string;
  city: string;
  country: string;
  contactNumber?: string;
  openingHours?: string;
  closingHours?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Update Rental Location Request
 */
export interface UpdateRentalLocationRequest {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  contactNumber?: string;
  openingHours?: string;
  closingHours?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Rental Location with Stats
 */
export interface RentalLocationWithStats extends RentalLocation {
  totalVehicles: number;
  availableVehicles: number;
  totalBookings: number;
}
