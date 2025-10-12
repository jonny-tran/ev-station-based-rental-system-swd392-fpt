/**
 * Account Types
 */

import { BaseEntityUUID } from "../common/base";
import { UserRole, AccountStatus } from "../common/shared-enums";

/**
 * Account Entity
 */
export interface Account extends BaseEntityUUID {
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  status: AccountStatus;
}

/**
 * Account without sensitive data
 */
export interface AccountPublic {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Account Request
 */
export interface CreateAccountRequest {
  email: string;
  password: string;
  phoneNumber?: string;
  fullName: string;
  role: UserRole;
}

/**
 * Update Account Request
 */
export interface UpdateAccountRequest {
  phoneNumber?: string;
  fullName?: string;
  avatarUrl?: string;
  status?: AccountStatus;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: AccountPublic;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber?: string;
  fullName: string;
  role?: UserRole; // Default to Renter
}

/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Reset Password Request
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * Reset Password Confirm Request
 */
export interface ResetPasswordConfirmRequest {
  token: string;
  newPassword: string;
}

/**
 * Auth Context Type
 */
export interface AuthContextType {
  user: AccountPublic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
  updateProfile: (data: UpdateAccountRequest) => Promise<void>;
}
