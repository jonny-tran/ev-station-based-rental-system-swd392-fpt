/**
 * Shared Enums
 * Các enums được sử dụng chung across domains
 */

/**
 * User Roles
 */
export enum UserRole {
  Renter = "Renter",
  Staff = "Staff",
  Admin = "Admin",
}

/**
 * Account Status
 */
export enum AccountStatus {
  Active = "Active",
  Inactive = "Inactive",
  Locked = "Locked",
  Pending = "Pending",
}

/**
 * General Status
 */
export enum GeneralStatus {
  Active = "Active",
  Inactive = "Inactive",
  Pending = "Pending",
}

/**
 * Verification Status
 */
export enum VerificationStatus {
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
}

/**
 * Currency
 */
export enum Currency {
  VND = "VND",
  USD = "USD",
  EUR = "EUR",
}

/**
 * Sort Order
 */
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
