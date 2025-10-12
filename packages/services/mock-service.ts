import { Booking } from "../types/booking";
import { Vehicle } from "../types/vehicle";
import { Renter } from "../types/rental";
import { Account } from "../types/auth";
import { RentalLocation } from "../types/rental";
import { VehicleInspection } from "../types/vehicle";
import { mockData } from "./mock-data";
import { DriverLicense } from "../types/documents";
import { Contract } from "../types/contract";
import { Payment } from "../types/payment";
import { ContractStatus } from "../types/contract";
import { PaymentStatus, PaymentType, PaymentMethod } from "../types/payment";
import { VehicleInspectionStatus } from "../types/vehicle";
import {
  SettlementConfig,
  SettlementInput,
  SettlementResult,
} from "../types/settlement";
import { computeSettlement } from "../utils/settlement-calculator";

// mockData được tách sang ./mock-data

// Mock service functions
export const mockService = {
  // Lấy tất cả booking của renter
  getRenterBookings: (renterId: string): Booking[] => {
    return mockData.bookings.filter((booking) => booking.renterId === renterId);
  },

  // Lấy chi tiết booking
  getBookingById: (bookingId: string): Booking | undefined => {
    return mockData.bookings.find((booking) => booking.id === bookingId);
  },

  // Lấy thông tin xe
  getVehicleById: (vehicleId: string): Vehicle | undefined => {
    return mockData.vehicles.find((vehicle) => vehicle.id === vehicleId);
  },

  // Lấy thông tin renter
  getRenterById: (renterId: string): Renter | undefined => {
    return mockData.renters.find((renter) => renter.id === renterId);
  },

  // Lấy thông tin account
  getAccountById: (accountId: string): Account | undefined => {
    return mockData.accounts.find((account) => account.id === accountId);
  },

  // Lấy thông tin địa điểm thuê
  getRentalLocationById: (locationId: string): RentalLocation | undefined => {
    return mockData.rentalLocations.find(
      (location) => location.id === locationId
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
    inspectionId: number
  ): VehicleInspection | undefined => {
    return mockData.vehicleInspections.find(
      (inspection) => inspection.id === inspectionId
    );
  },

  // Tìm phiên check-in theo bookingId (phục vụ điều hướng soạn hợp đồng)
  getCheckInSessionByBookingOrContract: (args: {
    bookingId?: string;
    contractId?: string;
  }): VehicleInspection | undefined => {
    const { bookingId } = args;
    return mockData.vehicleInspections.find((insp) => {
      const okBooking = bookingId ? insp.bookingId === bookingId : true;
      return okBooking && insp.inspectionType === "check_in";
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
    return mockData.contracts?.find((c: Contract) => c.id === contractId);
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
        [c.id, c.bookingId].some((v) => v.toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paged = items.slice(start, end);
    return { items: paged, total, page, pageSize };
  },

  // Lấy danh sách hợp đồng cho Renter (lọc theo booking thuộc renter)
  getContractsForRenter: (
    renterId: string,
    params?: {
      page?: number;
      pageSize?: number;
      status?: ContractStatus | "All";
      keyword?: string;
    }
  ): { items: Contract[]; total: number; page: number; pageSize: number } => {
    const {
      page = 1,
      pageSize = 10,
      status = "All",
      keyword = "",
    } = params || {};

    // Lấy bookingId thuộc renter
    const renterBookingIds = mockData.bookings
      .filter((b) => b.renterId === renterId)
      .map((b) => b.id);

    let items = (mockData.contracts as Contract[]).filter((c) =>
      renterBookingIds.includes(c.bookingId)
    );

    // Không hiển thị Draft cho Renter
    items = items.filter((c) => c.status !== ContractStatus.Draft);

    // Filter theo status nếu có
    if (status !== "All") {
      items = items.filter((c) => c.status === status);
    }

    // Search theo contractId/bookingId
    const q = keyword.trim().toLowerCase();
    if (q) {
      items = items.filter((c) =>
        [c.id, c.bookingId].some((v) => v.toLowerCase().includes(q))
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
      (c: Contract) => c.id === contractId
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

  // Renter ký hợp đồng
  signContractByRenter: (contractId: string): Contract | undefined => {
    const contract = mockData.contracts.find(
      (c: Contract) => c.id === contractId
    );
    if (!contract) return undefined;
    if (contract.status === ContractStatus.Voided) return contract;

    // Chỉ xử lý theo spec khi ở trạng thái Active
    if (contract.status === ContractStatus.Active) {
      contract.signedByRenter = true;
      contract.updatedAt = new Date().toISOString();

      if (contract.signedByStaff) {
        // Cả hai đã ký → Completed, set signedAt nếu chưa có
        contract.status = ContractStatus.Completed;
        contract.signedAt = contract.signedAt || new Date().toISOString();
      }
      // Nếu staff chưa ký → giữ Active
    }
    return contract;
  },

  // Payments
  getPaymentsByContractId: (contractId: string): Payment[] => {
    return (mockData.payments as Payment[]).filter(
      (p) => p.contractId === contractId
    );
  },

  getPaymentById: (paymentId: number): Payment | undefined => {
    return (mockData.payments as Payment[]).find((p) => p.id === paymentId);
  },

  // ====== Returns / Check-out helpers ======
  updateCheckoutInspection: (
    inspectionId: number,
    payload: Partial<
      Pick<
        VehicleInspection,
        | "odometerReading"
        | "batteryLevel"
        | "vehicleConditionNotes"
        | "damageNotes"
        | "photoUrls"
      >
    >
  ): VehicleInspection | undefined => {
    const insp = mockData.vehicleInspections.find((i) => i.id === inspectionId);
    if (!insp) return undefined;
    if (insp.inspectionType !== "check_out") return insp;
    Object.assign(insp, payload);
    insp.updatedAt = new Date().toISOString();
    return insp;
  },

  computeSettlementForReturn: (
    input: SettlementInput,
    config: SettlementConfig
  ): SettlementResult => {
    return computeSettlement(input, config);
  },

  createExtraChargePayment: (params: {
    contractId: string;
    amount: number;
    method: PaymentMethod;
  }): Payment => {
    const payment: Payment = {
      id: Date.now(),
      contractId: params.contractId,
      amount: params.amount,
      currency: "VND",
      paymentType: PaymentType.Penalty,
      paymentMethod: params.method,
      status:
        params.method === PaymentMethod.Cash
          ? PaymentStatus.Paid
          : PaymentStatus.Pending,
      paymentDate:
        params.method === PaymentMethod.Cash
          ? new Date().toISOString()
          : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (mockData.payments as Payment[]).push(payment);
    return payment;
  },

  confirmVNPayPayment: (
    paymentId: number,
    ok: boolean,
    transactionId?: string
  ): Payment | undefined => {
    const p = (mockData.payments as Payment[]).find((x) => x.id === paymentId);
    if (!p) return undefined;
    if (p.paymentMethod !== PaymentMethod.VNPay) return p;
    p.status = ok ? PaymentStatus.Paid : PaymentStatus.Failed;
    p.paymentDate = ok ? new Date().toISOString() : p.paymentDate;
    p.transactionId = transactionId || p.transactionId;
    return p;
  },

  finalizeReturn: (inspectionId: number): VehicleInspection | undefined => {
    const insp = mockData.vehicleInspections.find((i) => i.id === inspectionId);
    if (!insp) return undefined;
    if (insp.inspectionType !== "check_out") return insp;
    insp.status = VehicleInspectionStatus.Completed;
    insp.updatedAt = new Date().toISOString();
    return insp;
  },
};

// Helper function để format tiền tệ
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
