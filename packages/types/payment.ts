import { PaymentMethod, PaymentStatus, PaymentType } from "./enum";

export interface Payment {
  paymentId: string;
  contractId: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  transactionId: string;
  refundTransactionId: string;
  receiptUrl: string;
  paidAt: string;
  status: PaymentStatus;
}
