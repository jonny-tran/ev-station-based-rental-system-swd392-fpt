/**
 * Check-in Session Service
 * Handles all check-in session related API calls
 */

import { apiGet, apiPost, apiPut } from "../lib/api-client";
import {
  ValidateQRCodeResponse,
  CreateCheckInSessionApiResponse,
  GetCheckInSessionsListResponse,
  CheckInSessionApiError,
  CheckInSessionErrorCode,
} from "../types/checkin/checkin-session-api";
import {
  CreateCheckInSessionRequest,
  CheckInSessionListQuery,
} from "../types/checkin/checkin-session";

// Interface for API error responses
interface ApiErrorResponse {
  response?: {
    status?: number; // HTTP status code từ axios
    data?: {
      message?: string;
      status?: number; // API status code từ backend
      code?: string;
      error?: string; // Error message from backend
      [key: string]: unknown; // Allow other fields
    };
  };
}

export class CheckInSessionService {
  /**
   * Validate QR Code & Get Booking Info
   * Xác thực QR code và lấy thông tin booking
   *
   * @param bookingId - ID của booking từ QR code
   * @returns Promise<ValidateQRCodeResponse>
   */
  static async validateQRCode(
    bookingId: string
  ): Promise<ValidateQRCodeResponse> {
    try {
      const response = await apiGet<ValidateQRCodeResponse>(
        `/booking/validate-qr/${bookingId}`
      );
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "validateQRCode");
    }
  }

  /**
   * Create Check-in Session
   * Tạo phiên check-in mới
   *
   * @param request - Thông tin tạo phiên check-in
   * @returns Promise<CreateCheckInSessionApiResponse>
   */
  static async createSession(
    request: CreateCheckInSessionRequest
  ): Promise<CreateCheckInSessionApiResponse> {
    try {
      const response = await apiPost<CreateCheckInSessionApiResponse>(
        "/checkin-session/create",
        request
      );
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "createSession");
    }
  }

  /**
   * Get Check-in Sessions List
   * Lấy danh sách phiên check-in với phân trang và lọc
   *
   * @param query - Tham số truy vấn (phân trang, lọc, tìm kiếm)
   * @returns Promise<GetCheckInSessionsListResponse>
   */
  static async getSessionsList(
    query: CheckInSessionListQuery = {}
  ): Promise<GetCheckInSessionsListResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (query.page) {
        params.append("page", query.page.toString());
      }

      if (query.pageSize) {
        params.append("pageSize", query.pageSize.toString());
      }

      if (query.status) {
        params.append("status", query.status);
      }

      if (query.search) {
        params.append("search", query.search);
      }

      const queryString = params.toString();
      const url = queryString
        ? `/checkin-session/list?${queryString}`
        : "/checkin-session/list";

      const response = await apiGet<GetCheckInSessionsListResponse>(url);
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "getSessionsList");
    }
  }

  /**
   * Get Check-in Session by ID
   * Lấy thông tin chi tiết phiên check-in theo ID
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @returns Promise<CheckInSessionApiResponse>
   */
  static async getSessionById(inspectionId: number): Promise<any> {
    try {
      const response = await apiGet(`/checkin-session/${inspectionId}`);
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "getSessionById");
    }
  }

  /**
   * Approve Step 1 - License Verification
   * Phê duyệt bước 1 - Xác thực giấy tờ
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @param notes - Ghi chú (optional)
   * @returns Promise<ApiResponse>
   */
  static async approveStep1(
    inspectionId: number,
    notes?: string
  ): Promise<any> {
    try {
      // Build request body - send empty object if no notes
      const requestBody = notes ? { notes } : {};

      const response = await apiPut(
        `/checkin-session/${inspectionId}/step1/approve`,
        requestBody
      );

      // Log response in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[approveStep1] Response:`, response);
      }

      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "approveStep1");
    }
  }

  /**
   * Reject Step 1 - License Verification
   * Từ chối bước 1 - Xác thực giấy tờ
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @param reason - Lý do từ chối
   * @returns Promise<ApiResponse>
   */
  static async rejectStep1(inspectionId: number, reason: string): Promise<any> {
    try {
      const response = await apiPut(
        `/checkin-session/${inspectionId}/step1/reject`,
        { reason }
      );
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "rejectStep1");
    }
  }

  /**
   * Upload Vehicle Inspection Photos - Step 2
   * Upload 6 ảnh kiểm tra xe (front, rear, left, right, odo, battery)
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @param photos - Object chứa 6 File objects
   * @returns Promise<ApiResponse> với photoUrls
   */
  static async uploadInspectionPhotos(
    inspectionId: number,
    photos: {
      front: File;
      rear: File;
      left: File;
      right: File;
      odo: File;
      battery: File;
    }
  ): Promise<any> {
    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append("front", photos.front);
      formData.append("rear", photos.rear);
      formData.append("left", photos.left);
      formData.append("right", photos.right);
      formData.append("odo", photos.odo);
      formData.append("battery", photos.battery);

      const response = await apiPost(
        `/checkin-session/${inspectionId}/photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(
        error,
        "uploadInspectionPhotos"
      );
    }
  }

  /**
   * Update Vehicle Inspection Data - Step 2
   * Cập nhật dữ liệu kiểm tra xe và tạo contract (chuyển sang Step 3)
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @param data - Dữ liệu xe cần cập nhật
   * @returns Promise<ApiResponse>
   */
  static async updateVehicleData(
    inspectionId: number,
    data: {
      odometerKm: number;
      batteryLevel: number;
      vehicleConditionNotes?: string;
      damageNotes?: string;
    }
  ): Promise<any> {
    try {
      const response = await apiPut(
        `/checkin-session/${inspectionId}/vehicle-data`,
        data
      );
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "updateVehicleData");
    }
  }

  /**
   * Reject Step 2 - Vehicle Inspection
   * Từ chối bước 2 - Kiểm tra xe
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @param reason - Lý do từ chối
   * @returns Promise<ApiResponse>
   */
  static async rejectStep2(inspectionId: number, reason: string): Promise<any> {
    try {
      const response = await apiPut(
        `/checkin-session/${inspectionId}/step2/reject`,
        { reason }
      );
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "rejectStep2");
    }
  }

  /**
   * Update Check-in Session Status
   * Cập nhật trạng thái phiên check-in
   * @deprecated Use approveStep1/rejectStep1 instead for step-specific updates
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @param status - Trạng thái mới
   * @param currentStep - Bước hiện tại (optional)
   * @returns Promise<ApiResponse>
   */
  static async updateSessionStatus(
    inspectionId: number,
    status: "Pending" | "Approved" | "Completed" | "Rejected",
    currentStep?: number
  ): Promise<any> {
    try {
      const updateData: any = { status };
      if (currentStep !== undefined) {
        updateData.currentStep = currentStep;
      }

      const response = await apiPost(
        `/checkin-session/${inspectionId}/status`,
        updateData
      );
      return response;
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "updateSessionStatus");
    }
  }

  /**
   * Delete Check-in Session
   * Xóa phiên check-in (nếu cần thiết)
   *
   * @param inspectionId - ID của phiên kiểm tra
   * @returns Promise<void>
   */
  static async deleteSession(inspectionId: number): Promise<void> {
    try {
      await apiGet(`/checkin-session/${inspectionId}/delete`);
    } catch (error) {
      throw CheckInSessionService.handleApiError(error, "deleteSession");
    }
  }

  /**
   * Handle API errors and transform them to CheckInSessionApiError
   * Xử lý lỗi API và chuyển đổi thành CheckInSessionApiError
   */
  private static handleApiError(
    error: unknown,
    method: string
  ): CheckInSessionApiError {
    const apiError = error as ApiErrorResponse;

    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error(`[CheckInSessionService.${method}] Error:`, error);
      console.error(
        `[CheckInSessionService.${method}] Response:`,
        apiError.response
      );
    }

    // If it's an Axios error with response
    if (apiError.response) {
      const httpStatus = apiError.response.status || 500;
      const responseData = apiError.response.data;

      // Extract message from response data
      let message = `Error in ${method}`;
      if (responseData) {
        if (typeof responseData === "string") {
          message = responseData;
        } else if (responseData.message) {
          message = responseData.message;
        } else if (responseData.error) {
          message = responseData.error;
        }
      }

      // Map HTTP status codes to error codes
      let errorCode: CheckInSessionErrorCode | undefined;

      switch (httpStatus) {
        case 400:
          errorCode = CheckInSessionErrorCode.INVALID_INPUT;
          break;
        case 403:
          errorCode = CheckInSessionErrorCode.ACCESS_DENIED;
          break;
        case 404:
          errorCode = CheckInSessionErrorCode.BOOKING_NOT_FOUND;
          break;
        case 409:
          errorCode = CheckInSessionErrorCode.SESSION_ALREADY_EXISTS;
          break;
        case 500:
        default:
          errorCode = CheckInSessionErrorCode.SERVER_ERROR;
      }

      return new CheckInSessionApiError(
        message,
        httpStatus,
        errorCode,
        responseData || error
      );
    }

    // Handle network errors or other errors without response
    if (error instanceof Error) {
      return new CheckInSessionApiError(
        error.message || `An error occurred in ${method}`,
        500,
        CheckInSessionErrorCode.SERVER_ERROR,
        error
      );
    }

    // Otherwise, throw a generic error
    return new CheckInSessionApiError(
      `An error occurred in ${method}`,
      500,
      CheckInSessionErrorCode.SERVER_ERROR,
      error
    );
  }

  /**
   * Utility method to check if error is CheckInSessionApiError
   * Kiểm tra xem lỗi có phải là CheckInSessionApiError không
   */
  static isCheckInSessionError(
    error: unknown
  ): error is CheckInSessionApiError {
    return error instanceof CheckInSessionApiError;
  }

  /**
   * Utility method to get error message from any error
   * Lấy thông báo lỗi từ bất kỳ error nào
   */
  static getErrorMessage(error: unknown): string {
    if (CheckInSessionService.isCheckInSessionError(error)) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unknown error occurred";
  }
}
