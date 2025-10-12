/**
 * Vehicle Types
 */

import { BaseEntityUUID } from "../common/base";
import { VehicleStatus } from "./vehicle-status";

/**
 * Vehicle Entity
 */
export interface Vehicle extends BaseEntityUUID {
  rentalLocationId: string;
  licensePlate: string;
  model: string;
  brand: string;
  year?: number;
  mileage: number; // Odometer reading
  batteryCapacity?: number;
  batteryLevel?: number; // decimal(5,2)
  chargingCycles?: number;
  color?: string;
  imageUrl?: string;
  rentalRate?: number; // decimal(10,2)
  lastServiceDate?: string;
  status: VehicleStatus;
}

/**
 * Create Vehicle Request
 */
export interface CreateVehicleRequest {
  rentalLocationId: string;
  licensePlate: string;
  model: string;
  brand: string;
  year?: number;
  mileage?: number;
  batteryCapacity?: number;
  batteryLevel?: number;
  chargingCycles?: number;
  color?: string;
  imageUrl?: string;
  rentalRate?: number;
  lastServiceDate?: string;
  status?: VehicleStatus;
}

/**
 * Update Vehicle Request
 */
export interface UpdateVehicleRequest {
  model?: string;
  brand?: string;
  year?: number;
  mileage?: number;
  batteryCapacity?: number;
  batteryLevel?: number;
  chargingCycles?: number;
  color?: string;
  imageUrl?: string;
  rentalRate?: number;
  lastServiceDate?: string;
  status?: VehicleStatus;
}

/**
 * Vehicle with Location Info
 */
export interface VehicleWithLocation extends Vehicle {
  rentalLocation: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}
