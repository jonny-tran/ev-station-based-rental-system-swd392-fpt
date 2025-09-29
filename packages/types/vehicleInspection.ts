import { VehicleInspectionStatus, VehicleInspectionType } from "./enum";

export interface VehicleInspection {
  inspectionId: string;
  bookingId: string; // liên kết để truy vấn về booking, renter, vehicle
  contractId?: string; // ở Check-in (step 2) có thể chưa tạo hợp đồng
  staffId: string;
  inspectionType: VehicleInspectionType;
  inspectionAt: string;
  odometerKm?: number;
  batteryLevel?: number;
  vehicleConditionNotes?: string;
  damageNotes?: string;
  photoUrls: string[];
  currentStep: number; // 1=license, 2=checklist, 3=contract, 4=payment
  createdAt: string;
  updatedAt: string;
  status: VehicleInspectionStatus;
  subStatus?: string; // ví dụ: WaitingSignature, WaitingPayment
  rejectedReason?: string; // lý do reject
}
