/**
 * Check-in Session API Types
 * API response wrappers cho check-in session endpoints
 */

import { ApiResponse } from "../common/api";
import {
  BookingValidationResponse,
  CreateCheckInSessionRequest,
  CreateCheckInSessionResponse,
  CheckInSessionListQuery,
  CheckInSessionListResponse,
} from "./checkin-session";

/**
 * Validate QR Code Response
 * API response cho validate QR code
 */
export type ValidateQRCodeResponse = ApiResponse<BookingValidationResponse>;

/**
 * Create Check-in Session Response
 * API response cho tạo check-in session
 */
export type CreateCheckInSessionApiResponse =
  ApiResponse<CreateCheckInSessionResponse>;

/**
 * Get Check-in Sessions List Response
 * API response cho danh sách check-in sessions
 */
export type GetCheckInSessionsListResponse =
  ApiResponse<CheckInSessionListResponse>;

/**
 * Check-in Session API Error Codes
 * Các mã lỗi có thể xảy ra từ API
 */
export enum CheckInSessionErrorCode {
  /** Booking không tồn tại */
  BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",
  /** Booking không ở trạng thái Pending */
  BOOKING_NOT_PENDING = "BOOKING_NOT_PENDING",
  /** Đã tồn tại check-in session cho booking này */
  SESSION_ALREADY_EXISTS = "SESSION_ALREADY_EXISTS",
  /** Truy cập bị từ chối - chỉ dành cho staff */
  ACCESS_DENIED = "ACCESS_DENIED",
  /** Dữ liệu đầu vào không hợp lệ */
  INVALID_INPUT = "INVALID_INPUT",
  /** Lỗi server */
  SERVER_ERROR = "SERVER_ERROR",
}

/**
 * Check-in Session API Error
 * Error class cho check-in session APIs
 */
export class CheckInSessionApiError extends Error {
  public status: number;
  public code?: CheckInSessionErrorCode;
  public originalError?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: CheckInSessionErrorCode,
    originalError?: unknown
  ) {
    super(message);
    this.name = "CheckInSessionApiError";
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }
}
