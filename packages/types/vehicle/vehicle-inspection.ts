/**
 * Vehicle Inspection Types
 */

import { BaseEntityAutoId } from "../common/base";

/**
 * Vehicle Inspection Type
 */
export enum VehicleInspectionType {
  CheckIn = "check_in",
  CheckOut = "check_out",
}

/**
 * Vehicle Inspection Status
 */
export enum VehicleInspectionStatus {
  Pending = "Pending",
  Approved = "Approved",
  Completed = "Completed",
  Rejected = "Rejected",
}

/**
 * Vehicle Inspection Entity
 */
export interface VehicleInspection extends BaseEntityAutoId {
  staffId: string;
  bookingId: string;
  inspectionType: VehicleInspectionType;
  inspectionDateTime: string;
  vehicleConditionNotes?: string;
  odometerReading?: number;
  batteryLevel?: number; // decimal(5,2)
  damageNotes?: string;
  photoUrls?: string; // JSON string of URLs
  currentStep?: number; // tinyint
  status: VehicleInspectionStatus;
  subStatus?: string;
  rejectedReason?: string;
}

/**
 * Create Vehicle Inspection Request
 */
export interface CreateVehicleInspectionRequest {
  staffId: string;
  bookingId: string;
  inspectionType: VehicleInspectionType;
  vehicleConditionNotes?: string;
  odometerReading?: number;
  batteryLevel?: number;
  damageNotes?: string;
  photoUrls?: string[];
  currentStep?: number;
  status?: VehicleInspectionStatus;
  subStatus?: string;
}

/**
 * Update Vehicle Inspection Request
 */
export interface UpdateVehicleInspectionRequest {
  vehicleConditionNotes?: string;
  odometerReading?: number;
  batteryLevel?: number;
  damageNotes?: string;
  photoUrls?: string[];
  currentStep?: number;
  status?: VehicleInspectionStatus;
  subStatus?: string;
  rejectedReason?: string;
}
