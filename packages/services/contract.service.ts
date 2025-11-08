/**
 * Contract Service
 * Handles all contract-related API calls
 */

import { apiGet, apiPut } from "../lib/api-client";
import {
  ContractDetailsApiResponse,
  ContractListApiResponse,
  ContractActionApiResponse,
  SubmitContractRequest,
  SignContractRequest,
  RejectContractRequest,
  ContractListQuery,
  ContractApiError,
  ContractErrorCode,
} from "../types/contract/contract-api";
import { CheckInSessionService } from "./checkin-session.service";

// Interface for API error responses
interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
      status?: number;
      code?: string;
      error?: string;
      [key: string]: unknown;
    };
  };
}

export class ContractService {
  /**
   * Get contract details by contract ID
   */
  static async getContractDetails(
    contractId: string
  ): Promise<ContractDetailsApiResponse> {
    try {
      const response = await apiGet<ContractDetailsApiResponse>(
        `/contract/${contractId}`
      );
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "getContractDetails");
    }
  }

  /**
   * Get contract by inspection ID
   * This method gets the inspection, extracts bookingId, then finds the contract
   * Note: This is a workaround until backend provides direct endpoint
   * GET /api/checkin-session/{inspectionId}/contract
   */
  static async getContractByInspectionId(
    inspectionId: number
  ): Promise<ContractDetailsApiResponse> {
    try {
      // Step 1: Get inspection to get bookingId
      const inspectionResponse = await CheckInSessionService.getSessionById(
        inspectionId
      );

      // Extract bookingId from response
      // Response structure: { message, data: { inspection: { bookingId }, booking: { bookingId }, ... } }
      const bookingId =
        inspectionResponse?.data?.inspection?.bookingId ||
        inspectionResponse?.data?.booking?.bookingId ||
        inspectionResponse?.bookingId;

      if (!bookingId) {
        throw new ContractApiError(
          "Booking not found for this inspection",
          404,
          ContractErrorCode.CONTRACT_NOT_FOUND
        );
      }

      // Step 2: Search for contract by bookingId using search parameter
      // This is more efficient than fetching all contracts
      const contractsResponse = await ContractService.getContracts({
        page: 1,
        pageSize: 10,
        search: bookingId,
      });

      const contract = contractsResponse.data?.contracts?.find(
        (c) => c.bookingId === bookingId
      );

      if (!contract) {
        throw new ContractApiError(
          "Contract not found for this inspection. The contract may not have been created yet.",
          404,
          ContractErrorCode.CONTRACT_NOT_FOUND
        );
      }

      // Step 3: Get full contract details
      return await ContractService.getContractDetails(contract.contractId);
    } catch (error) {
      if (error instanceof ContractApiError) {
        throw error;
      }
      throw ContractService.handleApiError(error, "getContractByInspectionId");
    }
  }

  /**
   * Get contracts list for staff
   */
  static async getContracts(
    query: ContractListQuery = {}
  ): Promise<ContractListApiResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (query.page) {
        params.append("page", query.page.toString());
      }

      if (query.pageSize) {
        params.append("pageSize", query.pageSize.toString());
      }

      if (query.status && query.status !== "All") {
        params.append("status", query.status);
      }

      if (query.search) {
        params.append("search", query.search);
      }

      const queryString = params.toString();
      const url = queryString
        ? `/contract/staff/list?${queryString}`
        : "/contract/staff/list";

      const response = await apiGet<ContractListApiResponse>(url);
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "getContracts");
    }
  }

  /**
   * Get contracts list for renter
   */
  static async getRenterContracts(
    query: ContractListQuery = {}
  ): Promise<ContractListApiResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (query.page) {
        params.append("page", query.page.toString());
      }

      if (query.pageSize) {
        params.append("pageSize", query.pageSize.toString());
      }

      if (query.status && query.status !== "All") {
        params.append("status", query.status);
      }

      if (query.search) {
        params.append("search", query.search);
      }

      const queryString = params.toString();
      const url = queryString
        ? `/contract/renter/list?${queryString}`
        : "/contract/renter/list";

      const response = await apiGet<ContractListApiResponse>(url);
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "getRenterContracts");
    }
  }

  /**
   * Submit contract for renter signing
   */
  static async submitContract(
    contractId: string,
    renterInfo: SubmitContractRequest["renterInfo"]
  ): Promise<ContractActionApiResponse> {
    try {
      const response = await apiPut<ContractActionApiResponse>(
        `/contract/${contractId}/submit`,
        {
          renterInfo,
        }
      );
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "submitContract");
    }
  }

  /**
   * Staff signs the contract
   * @param contractId - Contract ID to sign
   * @param signatureData - Optional signature data (base64 image). If not provided, a placeholder will be used.
   */
  static async staffSignContract(
    contractId: string,
    signatureData?: string
  ): Promise<ContractActionApiResponse> {
    try {
      // If signatureData is not provided or is empty, use placeholder
      // TODO: Replace with actual signature capture dialog in the future
      const finalSignatureData =
        signatureData && signatureData.trim() !== ""
          ? signatureData
          : ContractService.generatePlaceholderSignature();

      const response = await apiPut<ContractActionApiResponse>(
        `/contract/${contractId}/staff-sign`,
        {
          signatureData: finalSignatureData,
        }
      );
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "staffSignContract");
    }
  }

  /**
   * Generate a placeholder signature (valid PNG image as base64)
   * This is a temporary solution until signature capture is implemented
   * The placeholder is a minimal valid 1x1 transparent PNG
   * Format: data:image/png;base64,...
   * 
   * Note: In production, this should be replaced with actual signature capture
   * using a signature pad component or similar UI
   */
  private static generatePlaceholderSignature(): string {
    // Minimal valid 1x1 transparent PNG in base64
    // This is the smallest valid PNG image that will pass validation
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A (PNG magic bytes)
    const minimalPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    return `data:image/png;base64,${minimalPngBase64}`;
  }

  /**
   * Renter signs the contract
   * @param contractId - Contract ID to sign
   * @param signatureData - Optional signature data (base64 image). If not provided, a placeholder will be used.
   */
  static async renterSignContract(
    contractId: string,
    signatureData?: string
  ): Promise<ContractActionApiResponse> {
    try {
      // If signatureData is not provided or is empty, use placeholder
      // TODO: Replace with actual signature capture dialog in the future
      const finalSignatureData =
        signatureData && signatureData.trim() !== ""
          ? signatureData
          : ContractService.generatePlaceholderSignature();

      const response = await apiPut<ContractActionApiResponse>(
        `/contract/${contractId}/renter-sign`,
        {
          signatureData: finalSignatureData,
        }
      );
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "renterSignContract");
    }
  }

  /**
   * Reject contract
   */
  static async rejectContract(
    contractId: string,
    reason: string
  ): Promise<ContractActionApiResponse> {
    try {
      const response = await apiPut<ContractActionApiResponse>(
        `/contract/${contractId}/reject`,
        {
          reason,
        }
      );
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "rejectContract");
    }
  }

  /**
   * Approve Step 3 (complete contract signing and move to Step 4)
   */
  static async approveStep3(inspectionId: number): Promise<any> {
    try {
      const response = await apiPut(
        `/checkin-session/${inspectionId}/step3/approve`
      );
      return response;
    } catch (error) {
      throw ContractService.handleApiError(error, "approveStep3");
    }
  }

  /**
   * Handle API errors
   */
  private static handleApiError(
    error: unknown,
    operation: string
  ): ContractApiError {
    const apiError = error as ApiErrorResponse;

    if (apiError.response?.data) {
      const status = apiError.response.status || 500;
      const message =
        apiError.response.data.message ||
        apiError.response.data.error ||
        `Failed to ${operation}`;

      // Map HTTP status codes to error codes
      let errorCode: ContractErrorCode | undefined;
      if (status === 404) {
        errorCode = ContractErrorCode.CONTRACT_NOT_FOUND;
      } else if (status === 403) {
        errorCode = ContractErrorCode.ACCESS_DENIED;
      } else if (status === 400) {
        errorCode = ContractErrorCode.INVALID_STATUS;
      }

      return new ContractApiError(
        message,
        status,
        errorCode,
        apiError.response.data
      );
    }

    return new ContractApiError(
      `An error occurred during ${operation}`,
      500,
      ContractErrorCode.SERVER_ERROR,
      error
    );
  }
}
