import { ContractData, ContractStatus } from "./contract-types";
import { mockService } from "@/packages/services/mock-service";
import { VehicleInspection } from "@/packages/types/vehicleInspection";

/**
 * Mock service for contract data
 * In real implementation, this would call API endpoints
 */
export class ContractDataService {
  /**
   * Get contract data by inspection ID
   */
  static async getContractData(inspectionId: string): Promise<ContractData> {
    // Lấy dữ liệu từ mock-service và map sang ContractData dùng cho render template
    return new Promise((resolve, reject) => {
      try {
        const inspection: VehicleInspection | undefined =
          mockService.getVehicleInspectionById(inspectionId);
        if (!inspection) throw new Error("Inspection not found");

        const booking = inspection.bookingId
          ? mockService.getBookingById(inspection.bookingId)
          : undefined;
        if (!booking) throw new Error("Booking not found");

        const renter = mockService.getRenterById(booking.renterId);
        const account = renter
          ? mockService.getAccountById(renter.accountId)
          : undefined;
        const vehicle = mockService.getVehicleById(booking.vehicleId);
        const location = mockService.getRentalLocationById(
          booking.rentalLocationId
        );

        const renterName = account?.fullName || "—";
        const renterEmail = account?.email || "—";
        const renterPhone = account?.phoneNumber || "—";
        const renterId = renter?.identityNumber || "—";

        const licensePlate = vehicle?.licensePlate || "—";
        const vehicleModel = vehicle
          ? `${vehicle.brand} ${vehicle.model}`
          : "—";
        const batteryCapacity = vehicle?.batteryCapacity
          ? vehicle.batteryCapacity / 1000
          : 0; // nếu đơn vị mAh -> kWh
        const currentOdo = vehicle?.odometerKm || 0;

        const startDate = booking.startTime;
        const endDate = booking.endTime;
        const pickupLocation = location
          ? `${location.name} - ${location.address}`
          : "—";
        const returnLocation = pickupLocation;

        const totalPrice = 0; // chưa tính giá trong mock; để 0 hoặc có thể tính từ booking

        const staff = mockService.getAccountById(inspection.staffId || "");
        const staffName = staff?.fullName || "—";

        resolve({
          renterName,
          renterId,
          renterPhone,
          renterEmail,
          licensePlate,
          vehicleModel,
          batteryCapacity,
          currentOdo,
          startDate,
          endDate,
          pickupLocation,
          returnLocation,
          totalPrice,
          contractId: `HD-${inspectionId}-${Date.now()}`,
          contractCreatedDate: new Date().toISOString(),
          staffName,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get contract status
   */
  static async getContractStatus(contractId: string): Promise<ContractStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          contractId,
          status: "draft",
          renterSigned: false,
          staffSigned: false,
        });
      }, 200);
    });
  }

  /**
   * Update contract signature
   */
  static async updateSignature(
    contractId: string,
    role: "renter" | "staff",
    signature: string
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updated ${role} signature for contract ${contractId}`);
        resolve();
      }, 500);
    });
  }

  /**
   * Submit contract for final processing
   */
  static async submitContract(contractId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Contract ${contractId} submitted successfully`);
        resolve();
      }, 1000);
    });
  }

  /**
   * Generate PDF from contract HTML
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
