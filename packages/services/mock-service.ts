import { Booking } from "../types/booking";
import { Vehicle } from "../types/vehicle";
import { Renter } from "../types/renter";
import { Account } from "../types/account";
import { RentalLocation } from "../types/rentalLocation";
import { VehicleInspection } from "../types/vehicleInspection";
import { mockData } from "./mock-data";
import { DriverLicense } from "../types/driverLicense";
import { Contract } from "../types/contract";
import { Payment } from "../types/payment";
import { ContractStatus } from "../types/enum";

// mockData được tách sang ./mock-data

// Mock service functions
export const mockService = {
  // Lấy tất cả booking của renter
  getRenterBookings: (renterId: string): Booking[] => {
    return mockData.bookings.filter((booking) => booking.renterId === renterId);
  },

  // Lấy chi tiết booking
  getBookingById: (bookingId: string): Booking | undefined => {
    return mockData.bookings.find((booking) => booking.bookingId === bookingId);
  },

  // Lấy thông tin xe
  getVehicleById: (vehicleId: string): Vehicle | undefined => {
    return mockData.vehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
  },

  // Lấy thông tin renter
  getRenterById: (renterId: string): Renter | undefined => {
    return mockData.renters.find((renter) => renter.renterId === renterId);
  },

  // Lấy thông tin account
  getAccountById: (accountId: string): Account | undefined => {
    return mockData.accounts.find((account) => account.accountId === accountId);
  },

  // Lấy thông tin địa điểm thuê
  getRentalLocationById: (locationId: string): RentalLocation | undefined => {
    return mockData.rentalLocations.find(
      (location) => location.locationId === locationId
    );
  },

  // Lấy tất cả địa điểm thuê
  getAllRentalLocations: (): RentalLocation[] => {
    return mockData.rentalLocations;
  },

  // Lấy tất cả vehicle inspections
  getAllVehicleInspections: (): VehicleInspection[] => {
    return mockData.vehicleInspections;
  },

  // Lấy vehicle inspection theo ID
  getVehicleInspectionById: (
    inspectionId: string
  ): VehicleInspection | undefined => {
    return mockData.vehicleInspections.find(
      (inspection) => inspection.inspectionId === inspectionId
    );
  },

  // Tìm phiên check-in theo bookingId hoặc contractId (phục vụ điều hướng soạn hợp đồng)
  getCheckInSessionByBookingOrContract: (args: {
    bookingId?: string;
    contractId?: string;
  }): VehicleInspection | undefined => {
    const { bookingId, contractId } = args;
    return mockData.vehicleInspections.find((insp) => {
      const okBooking = bookingId ? insp.bookingId === bookingId : true;
      const okContract = contractId ? insp.contractId === contractId : true;
      return okBooking && okContract && insp.inspectionType === "CheckIn";
    });
  },

  // Lấy vehicle inspections theo staff ID
  getVehicleInspectionsByStaffId: (staffId: string): VehicleInspection[] => {
    return mockData.vehicleInspections.filter(
      (inspection) => inspection.staffId === staffId
    );
  },

  // Lấy driver license theo renterId
  getDriverLicenseByRenterId: (renterId: string): DriverLicense | undefined => {
    return mockData.driverLicenses.find(
      (license) => license.renterId === renterId
    );
  },

  // Contracts
  getContractById: (contractId: string): Contract | undefined => {
    return mockData.contracts?.find(
      (c: Contract) => c.contractId === contractId
    );
  },

  // Lấy danh sách hợp đồng có filter + search + pagination
  getContracts: (params?: {
    page?: number;
    pageSize?: number;
    status?: ContractStatus | "All";
    renterSigned?: boolean | "All";
    staffSigned?: boolean | "All";
    keyword?: string;
  }): { items: Contract[]; total: number; page: number; pageSize: number } => {
    const {
      page = 1,
      pageSize = 10,
      status = "All",
      renterSigned = "All",
      staffSigned = "All",
      keyword = "",
    } = params || {};

    let items = (mockData.contracts as Contract[]).slice();

    // Filter theo status
    if (status !== "All") {
      items = items.filter((c) => c.status === status);
    }

    // Filter theo chữ ký renter/staff
    if (renterSigned !== "All") {
      items = items.filter((c) => c.signedByRenter === renterSigned);
    }
    if (staffSigned !== "All") {
      items = items.filter((c) => c.signedByStaff === staffSigned);
    }

    // Search theo contractId/bookingId (đơn giản)
    const q = keyword.trim().toLowerCase();
    if (q) {
      items = items.filter((c) =>
        [c.contractId, c.bookingId].some((v) => v.toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paged = items.slice(start, end);
    return { items: paged, total, page, pageSize };
  },

  // Staff ký hợp đồng
  signContractByStaff: (contractId: string): Contract | undefined => {
    const contract = mockData.contracts.find(
      (c: Contract) => c.contractId === contractId
    );
    if (!contract) return undefined;
    if (contract.status === ContractStatus.Voided) return contract;

    contract.signedByStaff = true;
    contract.updatedAt = new Date().toISOString();
    // Nếu renter đã ký, cập nhật trạng thái
    if (contract.signedByRenter) {
      // Nếu đang Draft → chuyển Active hoặc Completed tùy luồng; giữ Active để phù hợp UI
      if (contract.status === ContractStatus.Draft) {
        contract.status = ContractStatus.Completed;
        contract.signedAt = contract.signedAt || new Date().toISOString();
      } else if (contract.status === ContractStatus.Active) {
        contract.status = ContractStatus.Completed;
      }
    }
    return contract;
  },

  // Payments
  getPaymentsByContractId: (contractId: string): Payment[] => {
    return (mockData.payments as Payment[]).filter(
      (p) => p.contractId === contractId
    );
  },
};

// Helper function để format tiền tệ
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
