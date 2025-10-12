/**
 * Payment Method and Status Enums
 */

export enum PaymentMethod {
  VNPay = "VNPay",
  Cash = "Cash",
}

export enum PaymentStatus {
  Paid = "Paid",
  Pending = "Pending",
  Refund = "Refund",
  Failed = "Failed",
  Refunded = "Refunded",
}

export enum PaymentType {
  Deposit = "Deposit",
  RentalFee = "RentalFee",
  Penalty = "Penalty",
  Refund = "Refund",
}

export type PaymentMethodType = keyof typeof PaymentMethod;
export type PaymentStatusType = keyof typeof PaymentStatus;
export type PaymentTypeType = keyof typeof PaymentType;
