import { AccountStatus, UserRole } from "./enum";

export interface Account {
  accountId: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}
