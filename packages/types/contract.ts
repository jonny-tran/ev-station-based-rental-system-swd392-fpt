import { ContractStatus } from "./enum";

export interface Contract {
  contractId: string;
  bookingId: string;
  termsAndConditions: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  status: ContractStatus;
  signedAt: string;
  signedByRenter: boolean;
  signedByStaff: boolean;
  voidedAt: string;
}
