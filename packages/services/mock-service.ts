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
