/**
 * Vehicle Status Enums and Types
 */

export enum VehicleStatus {
  Available = "Available",
  Rented = "Rented",
  Maintenance = "Maintenance",
  Charging = "Charging",
}

export type VehicleStatusType = keyof typeof VehicleStatus;
