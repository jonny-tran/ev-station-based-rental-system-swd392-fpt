/**
 * Check-in Session Types
 * Dựa trên tài liệu API từ backend
 */

import { BookingStatus } from "../booking/booking-status";
import { Vehicle } from "../vehicle/vehicle";
import { Renter } from "../rental/renter";
import { RentalLocation } from "../rental/rental-location";

/**
 * Vehicle Inspection Status
 * Trạng thái của quá trình kiểm tra xe
 */
export type InspectionStatus =
  | "Pending"
  | "Approved"
  | "Completed"
  | "Rejected";

/**
 * Inspection Type
 * Loại kiểm tra
 */
export type InspectionType = "check_in" | "check_out";

/**
 * Check-in Session Entity
 * Entity chính cho check-in session
 */
export interface CheckInSession {
  /** ID của phiên kiểm tra */
  inspectionId: number;
  /** ID của booking */
  bookingId: string;
  /** ID của nhân viên */
  staffId: string;
  /** Loại kiểm tra */
  inspectionType: InspectionType;
  /** Bước hiện tại trong quy trình */
  currentStep: number;
  /** Trạng thái phiên */
  status: InspectionStatus;
  /** Thời gian tạo */
  createdAt: string;
  /** Thời gian cập nhật */
  updatedAt?: string;
}

/**
 * Booking Validation Response
 * Response từ API validate QR code
 */
export interface BookingValidationResponse {
  /** Thông tin booking */
  booking: {
    bookingId: string;
    status: BookingStatus;
    depositAmount: number;
    startTime: string;
    endTime: string;
    createdAt: string;
  };
  /** Thông tin người thuê */
  renter: {
    renterId: string;
    fullName: string;
    identityNumber: string;
    address: string;
    dateOfBirth: string;
  };
  /** Thông tin xe */
  vehicle: {
    vehicleId: string;
    brand: string;
    model: string;
    licensePlate: string;
    year: number;
    color: string;
  };
  /** Thông tin địa điểm thuê */
  rentalLocation: {
    rentalLocationId: string;
    name: string;
    address: string;
    city: string;
    country: string;
  };
}

/**
 * Create Check-in Session Request
 * Request tạo phiên check-in
 */
export interface CreateCheckInSessionRequest {
  /** ID của booking */
  bookingId: string;
  // staffId sẽ được lấy từ accessToken tự động
}

/**
 * Create Check-in Session Response
 * Response tạo phiên check-in
 */
export interface CreateCheckInSessionResponse {
  /** ID của phiên kiểm tra */
  inspectionId: number;
  /** ID của booking */
  bookingId: string;
  /** ID của nhân viên */
  staffId: string;
  /** Loại kiểm tra */
  inspectionType: InspectionType;
  /** Bước hiện tại */
  currentStep: number;
  /** Trạng thái phiên */
  status: InspectionStatus;
  /** Thời gian tạo */
  createdAt: string;
}

/**
 * Check-in Session List Item
 * Item trong danh sách check-in sessions
 */
export interface CheckInSessionListItem {
  /** ID của phiên kiểm tra */
  inspectionId: number;
  /** Trạng thái phiên */
  status: InspectionStatus;
  /** Bước hiện tại */
  currentStep: number;
  /** Thông tin booking */
  booking: {
    bookingId: string;
    status: BookingStatus;
    depositAmount: number;
    startTime: string;
    endTime: string;
  };
  /** Thông tin xe */
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
  };
  /** Thông tin người thuê */
  renter: {
    fullName: string;
    identityNumber: string;
  };
}

/**
 * Check-in Session List Response
 * Response danh sách check-in sessions
 */
export interface CheckInSessionListResponse {
  /** Tổng số records */
  total: number;
  /** Trang hiện tại */
  page: number;
  /** Kích thước trang */
  pageSize: number;
  /** Danh sách sessions */
  sessions: CheckInSessionListItem[];
}

/**
 * Check-in Session List Query Parameters
 * Parameters cho API lấy danh sách
 */
export interface CheckInSessionListQuery {
  /** Số trang (default: 1) */
  page?: number;
  /** Kích thước trang (default: 10, max: 100) */
  pageSize?: number;
  /** Lọc theo trạng thái */
  status?: InspectionStatus;
  /** Tìm kiếm theo booking ID, vehicle model, hoặc tên renter */
  search?: string;
}
