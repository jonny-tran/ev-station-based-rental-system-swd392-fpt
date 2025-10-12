/**
 * Reports Types
 */

import { BaseEntityAutoId } from "../common/base";
import { GeneralStatus } from "../common/shared-enums";

/**
 * Report Type
 */
export enum ReportType {
  Incident = "Incident",
  Renter = "Renter",
  Handover = "Handover",
}

/**
 * Report Status
 */
export enum ReportStatus {
  Open = "Open",
  Closed = "Closed",
  Pending = "Pending",
}

/**
 * Report Entity
 */
export interface Report extends BaseEntityAutoId {
  reportType: ReportType;
  renterId?: string;
  staffId: string;
  vehicleId?: string;
  reportDetails?: string;
  resolvedAt?: string; // datetime2
  status: ReportStatus;
}

/**
 * Create Report Request
 */
export interface CreateReportRequest {
  reportType: ReportType;
  renterId?: string;
  staffId: string;
  vehicleId?: string;
  reportDetails?: string;
  status?: ReportStatus;
}

/**
 * Update Report Request
 */
export interface UpdateReportRequest {
  reportDetails?: string;
  resolvedAt?: string;
  status?: ReportStatus;
}

/**
 * Report with Related Data
 */
export interface ReportWithDetails extends Report {
  staff: {
    id: string;
    accountId: string;
    fullName: string;
    email: string;
  };
  renter?: {
    id: string;
    accountId: string;
    fullName: string;
    email: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    model: string;
    brand: string;
  };
}
