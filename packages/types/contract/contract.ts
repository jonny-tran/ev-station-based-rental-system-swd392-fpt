/**
 * Contract Types
 */

import { BaseEntityUUID } from "../common/base";
import { ContractStatus } from "./contract-status";

/**
 * Contract Entity (ContractDatTT)
 */
export interface Contract extends BaseEntityUUID {
  bookingId: string;
  createdByStaffId: string;
  termsAndConditions?: string;
  startDate: string; // datetime2
  endDate: string; // datetime2
  signedAt?: string; // datetime2
  signedByRenter: boolean;
  signedByStaff: boolean;
  contractPdfUrl?: string;
  voidedAt?: string; // datetime2
  status: ContractStatus;
  statusReason?: string;
}

/**
 * Create Contract Request
 */
export interface CreateContractRequest {
  bookingId: string;
  createdByStaffId: string;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  status?: ContractStatus;
}

/**
 * Update Contract Request
 */
export interface UpdateContractRequest {
  termsAndConditions?: string;
  startDate?: string;
  endDate?: string;
  signedByRenter?: boolean;
  signedByStaff?: boolean;
  contractPdfUrl?: string;
  status?: ContractStatus;
  statusReason?: string;
}

/**
 * Contract with Related Data
 */
export interface ContractWithDetails extends Contract {
  booking: {
    id: string;
    renterId: string;
    vehicleId: string;
    startTime: string;
    endTime: string;
    depositAmount: number;
  };
  createdByStaff: {
    id: string;
    accountId: string;
    fullName: string;
    email: string;
  };
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
  };
}
