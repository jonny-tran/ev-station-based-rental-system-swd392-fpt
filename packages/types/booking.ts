import { BookingStatus } from "./enum";

export interface Booking {
  bookingId: string;
  renterId: string;
  vehicleId: string;
  rentalLocationId: string;
  depositAmount: number;
  bookingStatus: BookingStatus;
  startTime: string; // format: YYYY-MM-DD HH:MM:SS ISO date-time
  endTime: string; // format: YYYY-MM-DD HH:MM:SS ISO date-time
  createdAt: string; // format: YYYY-MM-DD HH:MM:SS ISO date-time
  cancelledAt?: string;
}
