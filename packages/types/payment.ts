import { PaymentMethod, PaymentStatus, PaymentType } from "./enum";

export interface Payment {
  paymentId: string;
  contractId: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  transactionId?: string; // có thể không có khi thanh toán tiền mặt
  refundTransactionId?: string;
  receiptUrl?: string; // có thể không có khi cash
  paidAt?: string;
  status: PaymentStatus;
}
