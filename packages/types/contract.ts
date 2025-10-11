import { ContractStatus } from "./enum";

export interface Contract {
  contractId: string;
  bookingId: string;
  createdByStaffId: string;
  termsAndConditions: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  status: ContractStatus;
  signedAt?: string; // có thể chưa ký
  signedByRenter: boolean;
  signedByStaff: boolean;
  voidedAt?: string;
  /** Lý do khi hợp đồng bị hủy/chấm dứt (nếu có) */
  statusReason?: string;
}
