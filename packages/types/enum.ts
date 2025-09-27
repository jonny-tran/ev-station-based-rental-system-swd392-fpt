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
