/**
 * Driver License Types
 */

import { BaseEntityAutoId } from "../common/base";
import { VerificationStatus } from "../common/shared-enums";

/**
 * License Type
 */
export enum LicenseType {
  Car = "Car",
  Motorcycle = "Motorcycle",
}

/**
 * Driver License Entity
 */
export interface DriverLicense extends BaseEntityAutoId {
  renterId: string;
  licenseNumber: string;
  issuedDate: string; // date
  expiryDate: string; // date
  licenseType: LicenseType;
  licenseImageUrl?: string;
  issuedBy?: string;
  verifiedStatus: VerificationStatus;
  verifiedAt?: string; // datetime2
}

/**
 * Create Driver License Request
 */
export interface CreateDriverLicenseRequest {
  renterId: string;
  licenseNumber: string;
  issuedDate: string;
  expiryDate: string;
  licenseType: LicenseType;
  licenseImageUrl?: string;
  issuedBy?: string;
  verifiedStatus?: VerificationStatus;
}

/**
 * Update Driver License Request
 */
export interface UpdateDriverLicenseRequest {
  licenseNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  licenseType?: LicenseType;
  licenseImageUrl?: string;
  issuedBy?: string;
  verifiedStatus?: VerificationStatus;
  verifiedAt?: string;
}

/**
 * Driver License with Renter Info
 */
export interface DriverLicenseWithRenter extends DriverLicense {
  renter: {
    id: string;
    accountId: string;
    fullName: string;
    email: string;
  };
}
