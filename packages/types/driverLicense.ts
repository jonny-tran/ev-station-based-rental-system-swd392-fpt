import { LicenseVerifiedStatus } from "./enum";

export interface DriverLicense {
  driverLicenseId: string;
  renterId: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  licenseImageUrl: string;
  verifiedStatus: LicenseVerifiedStatus;
  verifiedAt: string;
}
