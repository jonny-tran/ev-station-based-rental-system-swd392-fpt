/**
 * Payment Types
 */

import { BaseEntityAutoId } from "../common/base";
import { PaymentMethod, PaymentStatus, PaymentType } from "./payment-method";

/**
 * Payment Entity
 */
export interface Payment extends BaseEntityAutoId {
  contractId: string; // ContractDatTTID
  amount: number; // decimal(10,2)
  currency: string; // nvarchar(3) - default 'VND'
  paymentType: PaymentType;
  transactionId?: string;
  refundTransactionId?: string;
  receiptUrl?: string;
  paymentDate: string; // datetime2
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
}

/**
 * Create Payment Request
 */
export interface CreatePaymentRequest {
  contractId: string;
  amount: number;
  currency?: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  receiptUrl?: string;
  status?: PaymentStatus;
}

/**
 * Update Payment Request
 */
export interface UpdatePaymentRequest {
  transactionId?: string;
  refundTransactionId?: string;
  receiptUrl?: string;
  paymentDate?: string;
  status?: PaymentStatus;
}

/**
 * Payment with Contract Info
 */
export interface PaymentWithDetails extends Payment {
  contract: {
    id: string;
    bookingId: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  booking: {
    id: string;
    renterId: string;
    vehicleId: string;
    startTime: string;
    endTime: string;
    depositAmount: number;
  };
}
