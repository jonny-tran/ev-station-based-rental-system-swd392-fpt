import { ContractData } from "./contract-types";
import {
  ContractService,
  CheckInSessionService,
  BookingService,
} from "@/packages/services";
import {
  ContractDetailsResponse,
  ContractApiError,
} from "@/packages/types/contract/contract-api";

/**
 * Contract Data Service
 * Maps API responses to ContractData for template rendering
 */
export class ContractDataService {
  /**
   * Map contract details response to ContractData
   * This is a helper method to convert API response to template data
   */
  static mapContractDetailsToContractData(
    contractDetails: ContractDetailsResponse,
    additionalData?: {
      odometerReading?: number;
      batteryLevel?: number;
      batteryCapacity?: number;
      currentOdo?: number;
      pickupLocation?: string;
      returnLocation?: string;
      totalPrice?: number;
      staffName?: string;
    }
  ): ContractData {
    // Ensure renter info is properly extracted (handle null/undefined)
    // Helper to safely get string value
    const getStringValue = (value: string | undefined | null): string => {
      if (!value || typeof value !== "string") return "—";
      const trimmed = value.trim();
      return trimmed === "" || trimmed === "null" || trimmed === "undefined"
        ? "—"
        : trimmed;
    };

    const renterFullName = getStringValue(contractDetails.renter?.fullName);
    const renterId = getStringValue(contractDetails.renter?.renterId);
    const renterPhone = getStringValue(contractDetails.renter?.phoneNumber);
    const renterEmail = getStringValue(contractDetails.renter?.email);

    // Safely extract vehicle information
    const vehicle = contractDetails.vehicle || {};
    const licensePlate = getStringValue(vehicle.licensePlate);
    const vehicleBrand = getStringValue(vehicle.brand);
    const vehicleModel = getStringValue(vehicle.model);
    const vehicleModelFull = `${vehicleBrand} ${vehicleModel}`.trim() || "—";

    return {
      // Renter information
      renterName: renterFullName || "—",
      renterId: renterId || "—",
      renterPhone: renterPhone || "—",
      renterEmail: renterEmail || "—",

      // Vehicle information
      licensePlate: licensePlate || "—",
      vehicleModel: vehicleModelFull,
      batteryCapacity:
        additionalData?.batteryCapacity || additionalData?.batteryLevel || 0,
      currentOdo:
        additionalData?.currentOdo || additionalData?.odometerReading || 0,

      // Rental information
      startDate: contractDetails.startDate || new Date().toISOString(),
      endDate: contractDetails.endDate || new Date().toISOString(),
      pickupLocation: additionalData?.pickupLocation || "—",
      returnLocation: additionalData?.returnLocation || "—",
      totalPrice: additionalData?.totalPrice || 0,

      // Contract information
      contractId: contractDetails.contractId || "",
      contractCreatedDate:
        contractDetails.createdAt || new Date().toISOString(),

      // Staff information
      staffName: additionalData?.staffName || "—",

      // Signature information
      renterSignature: contractDetails.signedByRenter ? "signed" : undefined,
      staffSignature: contractDetails.signedByStaff ? "signed" : undefined,
      signDateRenter: contractDetails.signedByRenter
        ? contractDetails.signedAt
        : undefined,
      signDateStaff: contractDetails.signedByStaff
        ? contractDetails.signedAt
        : undefined,
    };
  }

  /**
   * Get contract data by contract ID
   * This method gets contract details, booking details, and enriches the data
   */
  static async getContractDataByContractId(
    contractId: string
  ): Promise<ContractData> {
    try {
      // Step 1: Get contract details from API
      const contractResponse =
        await ContractService.getContractDetails(contractId);

      if (!contractResponse.data) {
        throw new ContractApiError("Contract not found", 404, undefined);
      }

      const contractDetails: ContractDetailsResponse = contractResponse.data;

      // Step 2: Extract data from contract details (no need to call booking API for staff)
      // Note: Booking API `/booking/details` is only accessible by Renter role
      // Staff should use contract details which already contains necessary information
      let pickupLocation = "—";
      let returnLocation = "—";
      let totalPrice = 0;
      let batteryCapacity = 0;
      let currentOdo = 0;

      // Extract vehicle information from contract details
      // Note: VehicleInfoDto in contract API may not have batteryCapacity/mileage
      // These fields might not be available in contract response
      // We'll use default values (0) if not available
      if (contractDetails.vehicle) {
        // VehicleInfoDto only has: vehicleId, brand, model, licensePlate, year, color
        // Battery capacity and mileage are not in contract vehicle info
        // They should be set from inspection data or use defaults
        batteryCapacity = 0; // Will be populated from other sources if available
        currentOdo = 0; // Will be populated from other sources if available
      }

      // Location information is not in contract details
      // Contract details don't include rental location
      // We'll use placeholder values
      pickupLocation = "—";
      returnLocation = "—";

      // Extract price from contract if available
      // Contract details may not have price, so we use 0 as default
      // Price information should come from booking, but since we can't access it as staff,
      // we'll use placeholder or 0

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[ContractDataService] Using contract details only (staff mode):",
          {
            contractId: contractDetails.contractId,
            bookingId: contractDetails.bookingId,
            vehicle: contractDetails.vehicle
              ? {
                  licensePlate: contractDetails.vehicle.licensePlate,
                  batteryCapacity,
                  mileage: currentOdo,
                }
              : null,
            pickupLocation,
            note: "Booking API is not accessible for staff role",
          }
        );
      }

      // Step 3: Map to ContractData with enriched information
      return this.mapContractDetailsToContractData(contractDetails, {
        pickupLocation,
        returnLocation,
        totalPrice,
        batteryCapacity,
        currentOdo,
      });
    } catch (error) {
      if (error instanceof ContractApiError) {
        throw error;
      }
      throw new Error(
        `Failed to get contract data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get contract data by inspection ID
   * This method combines contract details and inspection data
   */
  static async getContractData(inspectionId: string): Promise<ContractData> {
    try {
      // Convert string to number
      const inspectionIdNum = parseInt(inspectionId, 10);
      if (isNaN(inspectionIdNum)) {
        throw new Error("Invalid inspection ID");
      }

      // Step 1: Get contract details from API
      const contractResponse =
        await ContractService.getContractByInspectionId(inspectionIdNum);

      if (!contractResponse.data) {
        throw new ContractApiError("Contract not found", 404, undefined);
      }

      const contractDetails: ContractDetailsResponse = contractResponse.data;

      // Step 2: Get inspection details to get odometer, battery level, and additional info
      let odometerReading = 0;
      let batteryLevel = 0;
      let pickupLocation = "—";
      let returnLocation = "—";
      let totalPrice = 0;
      let staffName = "—";

      // Fallback renter info from inspection (in case contract details don't have it)
      // Initialize with contract details (may be null/undefined/empty)
      let renterFullName = contractDetails.renter?.fullName || null;
      let renterEmail = contractDetails.renter?.email || null;
      let renterPhone = contractDetails.renter?.phoneNumber || null;
      let renterId = contractDetails.renter?.renterId || null;

      try {
        const inspectionResponse =
          await CheckInSessionService.getSessionById(inspectionIdNum);

        // Extract odometer and battery level from inspection
        if (inspectionResponse?.data?.inspection) {
          odometerReading =
            inspectionResponse.data.inspection.odometerReading || 0;
          batteryLevel = inspectionResponse.data.inspection.batteryLevel || 0;
        }

        // Extract renter info from account (fallback if contract details are missing)
        if (inspectionResponse?.data?.account) {
          const account = inspectionResponse.data.account;
          // Helper to check if value is empty or placeholder
          const isEmpty = (val: string | undefined | null): boolean => {
            if (!val) return true;
            const trimmed = String(val).trim();
            return (
              trimmed === "" ||
              trimmed === "—" ||
              trimmed === "null" ||
              trimmed === "undefined"
            );
          };

          // Only use inspection data if contract details are missing or empty
          if (isEmpty(renterFullName) && account.fullName) {
            renterFullName = account.fullName;
          }
          if (isEmpty(renterEmail) && account.email) {
            renterEmail = account.email;
          }
          if (isEmpty(renterPhone) && account.phoneNumber) {
            renterPhone = account.phoneNumber;
          }

          // Debug logging in development
          if (process.env.NODE_ENV === "development") {
            console.log(
              "ContractDataService: Extracted renter info from inspection",
              {
                fromContract: {
                  fullName: contractDetails.renter?.fullName,
                  email: contractDetails.renter?.email,
                  phoneNumber: contractDetails.renter?.phoneNumber,
                },
                fromInspection: {
                  fullName: account.fullName,
                  email: account.email,
                  phoneNumber: account.phoneNumber,
                },
                final: {
                  fullName: renterFullName,
                  email: renterEmail,
                  phoneNumber: renterPhone,
                },
              }
            );
          }
        }

        // Extract renter ID from renter object if available
        if (inspectionResponse?.data?.renter) {
          if (!renterId || renterId === "—") {
            renterId = inspectionResponse.data.renter.renterId || "—";
          }
        }

        // Extract location from booking
        if (inspectionResponse?.data?.booking) {
          const booking = inspectionResponse.data.booking;
          // Try to get location from booking (if available)
          if (booking.rentalLocation) {
            pickupLocation = booking.rentalLocation.name || "—";
            returnLocation = pickupLocation;
          }
        }

        // Extract total price from booking (if available)
        if (inspectionResponse?.data?.booking?.depositAmount) {
          totalPrice = inspectionResponse.data.booking.depositAmount;
        }

        // Extract staff name from inspection (if available)
        // Note: Staff name might not be in inspection response, but we can try
        // For now, we'll keep it as "—" since staff info is not typically in inspection response
      } catch (error) {
        // If inspection details fail, continue with contract data only
        console.warn("Failed to get inspection details:", error);
      }

      // Step 3: Create updated contract details with fallback renter info
      // Ensure we have valid values (not null/undefined)
      const finalRenterFullName =
        renterFullName && renterFullName !== "null"
          ? renterFullName
          : contractDetails.renter?.fullName || "—";
      const finalRenterEmail =
        renterEmail && renterEmail !== "null"
          ? renterEmail
          : contractDetails.renter?.email || "—";
      const finalRenterPhone =
        renterPhone && renterPhone !== "null"
          ? renterPhone
          : contractDetails.renter?.phoneNumber || "—";
      const finalRenterId =
        renterId && renterId !== "null"
          ? renterId
          : contractDetails.renter?.renterId || "—";

      const enrichedContractDetails: ContractDetailsResponse = {
        ...contractDetails,
        renter: {
          ...contractDetails.renter,
          fullName: finalRenterFullName,
          email: finalRenterEmail,
          phoneNumber: finalRenterPhone,
          renterId: finalRenterId,
        },
      };

      // Step 4: Map API response to ContractData using helper method
      return this.mapContractDetailsToContractData(enrichedContractDetails, {
        odometerReading,
        batteryLevel,
        pickupLocation,
        returnLocation,
        totalPrice,
        staffName,
      });
    } catch (error) {
      if (error instanceof ContractApiError) {
        throw error;
      }
      throw new Error(
        `Failed to get contract data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get contract status
   * This method is deprecated - use ContractService.getContractDetails instead
   * @deprecated Use ContractService.getContractDetails or contract store
   */
  static async getContractStatus(contractId: string): Promise<{
    contractId: string;
    status:
      | "draft"
      | "pending_renter_sign"
      | "pending_staff_sign"
      | "signed"
      | "completed"
      | "cancelled";
    renterSigned: boolean;
    staffSigned: boolean;
    renterSignedAt?: string;
    staffSignedAt?: string;
    completedAt?: string;
  }> {
    try {
      const response = await ContractService.getContractDetails(contractId);
      if (response.data) {
        return {
          contractId: response.data.contractId,
          status: response.data.status.toLowerCase() as any,
          renterSigned: response.data.signedByRenter,
          staffSigned: response.data.signedByStaff,
          renterSignedAt: response.data.signedByRenter
            ? response.data.signedAt
            : undefined,
          staffSignedAt: response.data.signedByStaff
            ? response.data.signedAt
            : undefined,
          completedAt:
            response.data.status === "Completed"
              ? response.data.updatedAt
              : undefined,
        };
      }
      throw new Error("Contract not found");
    } catch (error) {
      throw new Error(
        `Failed to get contract status: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Update contract signature
   * This method is deprecated - use ContractService.staffSignContract or ContractService.renterSignContract instead
   * @deprecated Use ContractService methods or contract store
   */
  static async updateSignature(
    contractId: string,
    role: "renter" | "staff",
    signature: string
  ): Promise<void> {
    try {
      if (role === "staff") {
        await ContractService.staffSignContract(contractId, signature);
      } else {
        // Renter sign - not implemented in staff context
        throw new Error("Renter signing not available in staff context");
      }
    } catch (error) {
      throw new Error(
        `Failed to update signature: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Submit contract for final processing
   * This method is deprecated - use ContractService.submitContract instead
   * @deprecated Use ContractService.submitContract or contract store
   */
  static async submitContract(
    contractId: string,
    renterInfo?: {
      fullName: string;
      email: string;
      phoneNumber: string;
    }
  ): Promise<void> {
    try {
      if (!renterInfo) {
        // Get contract details to extract renter info
        const response = await ContractService.getContractDetails(contractId);
        if (response.data) {
          renterInfo = {
            fullName: response.data.renter.fullName,
            email: response.data.renter.email,
            phoneNumber: response.data.renter.phoneNumber || "",
          };
        } else {
          throw new Error("Contract not found");
        }
      }

      await ContractService.submitContract(contractId, renterInfo);
    } catch (error) {
      throw new Error(
        `Failed to submit contract: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate PDF from contract HTML
   * This method is kept for backward compatibility
   */
  static async generatePDF(
    contractHtml: string,
    contractId: string
  ): Promise<Blob> {
    return new Promise((resolve) => {
      // In real implementation, this would use a PDF generation library
      // For now, return a mock blob
      setTimeout(() => {
        const blob = new Blob([contractHtml], { type: "text/html" });
        resolve(blob);
      }, 1000);
    });
  }

  /**
   * Save contract to storage
   * This method is kept for backward compatibility
   */
  static async saveContract(
    contractId: string,
    contractHtml: string
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storageUrl = `/storage/contracts/${contractId}.html`;
        console.log(`Contract saved to: ${storageUrl}`);
        resolve(storageUrl);
      }, 500);
    });
  }
}
