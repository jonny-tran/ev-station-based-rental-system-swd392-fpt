export interface ContractData {
  // Renter information
  renterName: string;
  renterId: string;
  renterPhone: string;
  renterEmail: string;

  // Vehicle information
  licensePlate: string;
  vehicleModel: string;
  batteryCapacity: number;
  currentOdo: number;

  // Rental information
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;

  // Contract information
  contractId: string;
  contractCreatedDate: string;

  // Staff information
  staffName: string;

  // Signature information
  renterSignature?: string;
  staffSignature?: string;
  signDateRenter?: string;
  signDateStaff?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  content: string;
  placeholders: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContractSignature {
  role: "renter" | "staff";
  signature: string;
  signedAt: string;
  signedBy: string;
}

export interface ContractStatus {
  contractId: string;
  status:
    | "draft"
    | "pending_renter_sign"
    | "pending_staff_sign"
    | "signed"
    | "completed"
    | "cancelled";
  renterSigned: boolean;
  staffSigned: boolean;
  renterSignedAt?: string;
  staffSignedAt?: string;
  completedAt?: string;
}
