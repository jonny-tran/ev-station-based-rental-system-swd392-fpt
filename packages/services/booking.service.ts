/**
 * Booking Service
 * Handles all booking-related API calls
 */

import { apiGet } from "../lib/api-client";
import {
  GetAllBookingsResponse,
  GetBookingDetailsResponse,
  BookingWithComputedFields,
  BookingDetailsResponse,
} from "../types/booking";

// Interface for API error responses
interface ApiErrorResponse {
  response?: {
    status?: number; // HTTP status code từ axios
    data?: {
      message?: string;
      status?: number; // API status code từ backend
      code?: string;
    };
  };
}

export class BookingService {
  /**
   * Lấy danh sách tất cả bookings của renter hiện tại
   * GET /booking/all
   */
  static async getAllBookings(): Promise<BookingWithComputedFields[]> {
    try {
      const response = await apiGet<GetAllBookingsResponse>("/booking/all");
      // Trả về data array từ response
      return response.data || [];
    } catch (error) {
      // Handle API errors and transform them to match our interface
      const apiError = error as ApiErrorResponse;

      // If it's an Axios error with response data, use that
      if (apiError.response?.data) {
        const status = apiError.response.data.status || 500;

        throw new BookingError(
          apiError.response.data.message || "Failed to retrieve bookings",
          status,
          apiError.response.data.code,
          apiError.response.data
        );
      }

      // Otherwise, throw a generic error
      throw new BookingError(
        "An error occurred while retrieving bookings",
        500,
        undefined,
        error
      );
    }
  }

  /**
   * Lấy chi tiết booking theo ID
   * GET /booking/details/:bookingId
   */
  static async getBookingDetails(
    bookingId: string
  ): Promise<BookingDetailsResponse> {
    try {
      // Validate bookingId
      if (!bookingId || bookingId.trim() === "") {
        throw new BookingError(
          "Booking ID is required",
          400,
          "INVALID_BOOKING_ID"
        );
      }

      const response = await apiGet<GetBookingDetailsResponse>(
        `/booking/details/${bookingId}`
      );

      // Trả về data object từ response
      return response.data;
    } catch (error) {
      // Handle API errors and transform them to match our interface
      const apiError = error as ApiErrorResponse;

      // If it's an Axios error with response data, use that
      if (apiError.response?.data) {
        const status = apiError.response.data.status || 500;

        throw new BookingError(
          apiError.response.data.message ||
            "Failed to retrieve booking details",
          status,
          apiError.response.data.code,
          apiError.response.data
        );
      }

      // Otherwise, throw a generic error
      throw new BookingError(
        "An error occurred while retrieving booking details",
        500,
        undefined,
        error
      );
    }
  }

  /**
   * Kiểm tra xem booking có tồn tại và thuộc về user hiện tại không
   * Utility method để validate booking ownership
   */
  static async validateBookingOwnership(bookingId: string): Promise<boolean> {
    try {
      await this.getBookingDetails(bookingId);
      return true;
    } catch (error) {
      const bookingError = error as BookingError;

      // Nếu lỗi 404 hoặc 403, booking không tồn tại hoặc không thuộc về user
      if (bookingError.status === 404 || bookingError.status === 403) {
        return false;
      }

      // Nếu là lỗi khác, re-throw
      throw error;
    }
  }

  /**
   * Tính toán số giờ thuê từ startTime và endTime
   * Utility method để tính totalAmount
   */
  static calculateRentalHours(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.max(0, diffInHours); // Đảm bảo không âm
  }

  /**
   * Tính toán tổng tiền thuê
   * Utility method: totalAmount = depositAmount × hours
   */
  static calculateTotalAmount(
    startTime: string,
    endTime: string,
    depositAmount: number
  ): number {
    const hours = this.calculateRentalHours(startTime, endTime);
    return depositAmount * hours;
  }

  /**
   * Format vehicle name từ brand và model
   * Utility method để tạo vehicle name
   */
  static formatVehicleName(brand: string, model: string): string {
    return `${brand} ${model}`.trim();
  }
}

// Export error class for better error handling
export class BookingError extends Error {
  public status: number;
  public code?: string;
  public originalError?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = "BookingError";
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }

  /**
   * Kiểm tra xem có phải lỗi authentication không
   */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /**
   * Kiểm tra xem có phải lỗi not found không
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * Kiểm tra xem có phải lỗi server không
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Kiểm tra xem có phải lỗi client không
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}
