export enum AccountStatus {
  Active = "Active",
  Inactive = "Inactive",
  Locked = "Locked",
  Pending = "Pending",
}

export enum UserRole {
  Renter = "Renter",
  Staff = "Staff",
  Admin = "Admin",
}

export enum LicenseVerifiedStatus {
  Verified = "Verified",
  Pending = "Pending",
  Rejected = "Rejected",
}

export enum VehicleStatus {
  Available = "Available",
  Rented = "Rented",
  Maintenance = "Maintenance",
  Charging = "Charging",
}

export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Expired = "Expired",
  Completed = "Completed",
}

export enum ContractStatus {
  Draft = "Draft",
  Active = "Active",
  Completed = "Completed",
  Terminated = "Terminated",
  Voided = "Voided",
}

export enum VehicleInspectionType {
  CheckIn = "CheckIn",
  CheckOut = "CheckOut",
}

export enum VehicleInspectionStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum PaymentType {
  Deposit = "Deposit",
  RentalFee = "RentalFee",
  Penalty = "Penalty",
  Refund = "Refund",
}

export enum PaymentMethod {
  VNPay = "VNPay",
  Cash = "Cash",
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
}

// Check-in session flow
export enum CheckInStep {
  ReviewLicense = 1,
  HandoverChecklist = 2,
  SignContract = 3,
  Payment = 4,
}

export enum CheckInSessionStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

// Sub-status để giữ ngữ cảnh khi ở Step 3 (ký hợp đồng)
export enum CheckInSessionSubStatus {
  None = "None",
  WaitingSignature = "WaitingSignature",
}

// Kết quả review nhanh ở Step 1
export enum DriverLicenseReviewStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}
