import { VehicleInspectionStatus, VehicleInspectionType } from "./enum";

export interface VehicleInspection {
  inspectionId: string;
  contractId: string;
  staffId: string;
  inspectionType: VehicleInspectionType;
  inspectionAt: string;
  odometerKm: number;
  batteryLevel: number;
  vehicleConditionNotes: string;
  damageNotes: string;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
  status: VehicleInspectionStatus;
}
