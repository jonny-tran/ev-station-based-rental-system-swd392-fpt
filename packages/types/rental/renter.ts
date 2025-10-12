/**
 * Renter Types
 */

import { BaseEntityUUID } from "../common/base";

/**
 * Renter Entity
 */
export interface Renter extends BaseEntityUUID {
  accountId: string;
  address?: string;
  dateOfBirth?: string; // date
  identityNumber?: string;
  frontIdentityImageUrl?: string;
  backIdentityImageUrl?: string;
}

/**
 * Create Renter Request
 */
export interface CreateRenterRequest {
  accountId: string;
  address?: string;
  dateOfBirth?: string;
  identityNumber?: string;
  frontIdentityImageUrl?: string;
  backIdentityImageUrl?: string;
}

/**
 * Update Renter Request
 */
export interface UpdateRenterRequest {
  address?: string;
  dateOfBirth?: string;
  identityNumber?: string;
  frontIdentityImageUrl?: string;
  backIdentityImageUrl?: string;
}

/**
 * Renter with Account Info
 */
export interface RenterWithAccount extends Renter {
  account: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    status: string;
  };
}

