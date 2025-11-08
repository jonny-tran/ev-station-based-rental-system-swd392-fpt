/**
 * Contract API Types
 * API response types for contract endpoints
 */

import { ApiResponse } from "../common/api";
import { ContractStatus } from "./contract-status";

/**
 * Renter Information DTO
 */
export interface RenterInfoDto {
  renterId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

/**
 * Vehicle Information DTO
 */
export interface VehicleInfoDto {
  vehicleId: string;
  brand: string;
  model: string;
  licensePlate: string;
  year?: number;
  color?: string;
}

/**
 * Contract Details Response
 */
export interface ContractDetailsResponse {
  contractId: string;
  bookingId: string;
  status: ContractStatus;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  signedByRenter: boolean;
  signedByStaff: boolean;
  signedAt?: string;
  renter: RenterInfoDto;
  vehicle: VehicleInfoDto;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contract List Item
 */
export interface ContractListItem {
  contractId: string;
  bookingId: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  signedByRenter: boolean;
  signedByStaff: boolean;
  signedAt?: string;
  renterName: string;
  renterEmail: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleLicensePlate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contract List Response
 */
export interface ContractListResponse {
  contracts: ContractListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Contract Response (for submit/sign/reject actions)
 */
export interface ContractResponse {
  contractId: string;
  status: ContractStatus;
  signedByRenter: boolean;
  signedByStaff: boolean;
  signedAt?: string;
  updatedAt: string;
  statusReason?: string;
}

/**
 * Submit Contract Request
 */
export interface SubmitContractRequest {
  renterInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

/**
 * Sign Contract Request
 */
export interface SignContractRequest {
  signatureData?: string;
}

/**
 * Reject Contract Request
 */
export interface RejectContractRequest {
  reason: string;
}

/**
 * Contract List Query Parameters
 */
export interface ContractListQuery {
  page?: number;
  pageSize?: number;
  status?: ContractStatus | "All";
  search?: string;
}

/**
 * API Response Types
 */
export type ContractDetailsApiResponse = ApiResponse<ContractDetailsResponse>;
export type ContractListApiResponse = ApiResponse<ContractListResponse>;
export type ContractActionApiResponse = ApiResponse<ContractResponse>;

/**
 * Contract API Error Codes
 */
export enum ContractErrorCode {
  CONTRACT_NOT_FOUND = "CONTRACT_NOT_FOUND",
  INVALID_STATUS = "INVALID_STATUS",
  ACCESS_DENIED = "ACCESS_DENIED",
  RENTER_NOT_SIGNED = "RENTER_NOT_SIGNED",
  STAFF_NOT_SIGNED = "STAFF_NOT_SIGNED",
  INVALID_INPUT = "INVALID_INPUT",
  SERVER_ERROR = "SERVER_ERROR",
}

/**
 * Contract API Error
 */
export class ContractApiError extends Error {
  public status: number;
  public code?: ContractErrorCode;
  public originalError?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: ContractErrorCode,
    originalError?: unknown
  ) {
    super(message);
    this.name = "ContractApiError";
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }
}
