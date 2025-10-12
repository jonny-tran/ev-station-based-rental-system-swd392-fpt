/**
 * Staff Types
 */

import { BaseEntityUUID } from "../common/base";

/**
 * Staff Entity (extends Account relationship)
 */
export interface Staff extends BaseEntityUUID {
  accountId: string;
  rentalLocationId: string;
}

/**
 * Create Staff Request
 */
export interface CreateStaffRequest {
  accountId: string;
  rentalLocationId: string;
}

/**
 * Update Staff Request
 */
export interface UpdateStaffRequest {
  rentalLocationId?: string;
}

/**
 * Staff with Account Info
 */
export interface StaffWithAccount extends Staff {
  account: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role: string;
    status: string;
  };
}

/**
 * Staff with Location Info
 */
export interface StaffWithLocation extends Staff {
  account: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    avatarUrl?: string;
  };
  rentalLocation: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}
