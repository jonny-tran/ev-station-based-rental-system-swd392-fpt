import { VehicleStatus } from "./enum";

export interface Vehicle {
  vehicleId: string;
  rentalLocationId: string;
  licensePlate: string;
  model: string;
  brand: string;
  year: number;
  odometerKm: number;
  batteryLevel: number;
  batteryCapacity: number;
  status: VehicleStatus;
  chargingCycles: number;
  lastServiceDate: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
  imageUrl?: string;
  rentalRate?: number;
}
