/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { RenterRepository } from '../repositories/renter.repository';
import {
  BookingNotFoundException,
  AccessDeniedException,
  UnauthorizedException,
  InternalServerErrorException,
} from '../exceptions/booking.exceptions';

export interface BookingWithComputedFields {
  bookingId: string;
  renterId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  depositAmount: number;
  status: string;
  createdAt: Date;
  totalAmount: number;
  vehicle: {
    name: string;
    licensePlate: string;
  };
  rentalLocation: {
    name: string;
    address: string;
  };
}

export interface BookingDetailsWithComputedFields {
  bookingId: string;
  renterId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  depositAmount: number;
  status: string;
  createdAt: Date;
  totalAmount: number;
  vehicle: {
    vehicleId: string;
    rentalLocationId: string;
    licensePlate: string;
    model: string;
    brand: string;
    year: number;
    mileage: number;
    batteryCapacity: number;
    batteryLevel: number;
    chargingCycles: number;
    color: string;
    imageUrl: string;
    rentalRate: number;
    lastServiceDate: Date;
    status: string;
  };
  rentalLocation: {
    rentalLocationId: string;
    name: string;
    address: string;
    city: string;
    country: string;
    contactNumber: string;
    openingHours: string;
    closingHours: string;
    latitude: number;
    longitude: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface JwtPayload {
  accountId: string;
  email: string;
  role: string;
}

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly renterRepository: RenterRepository,
  ) {}

  private calculateTotalAmount(
    startTime: Date,
    endTime: Date,
    depositAmount: number,
  ): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return depositAmount * hours;
  }

  private combineVehicleName(brand: string, model: string): string {
    return `${brand} ${model}`;
  }

  async findAll(
    user: JwtPayload,
  ): Promise<ApiResponse<BookingWithComputedFields[]>> {
    try {
      // Validate user role
      if (user.role !== 'Renter') {
        throw new AccessDeniedException();
      }

      // Get renter ID from account ID
      const renterId = await this.getRenterIdByAccountId(user.accountId);

      const bookings = await this.bookingRepository.findAllByRenter(renterId);

      const bookingData = bookings.map((booking) => ({
        bookingId: booking.BookingID,
        renterId: booking.RenterID,
        vehicleId: booking.VehicleID,
        startTime: booking.StartTime,
        endTime: booking.EndTime,
        depositAmount: booking.DepositAmount,
        status: booking.Status,
        createdAt: booking.CreatedAt,
        totalAmount: this.calculateTotalAmount(
          booking.StartTime,
          booking.EndTime,
          booking.DepositAmount,
        ),
        vehicle: {
          name: this.combineVehicleName(
            booking.vehicle.Brand,
            booking.vehicle.Model,
          ),
          licensePlate: booking.vehicle.LicensePlate,
        },
        rentalLocation: {
          name: booking.vehicle.rentalLocation.Name,
          address: booking.vehicle.rentalLocation.Address,
        },
      }));

      return {
        message: 'Bookings retrieved successfully',
        data: bookingData,
      };
    } catch (error) {
      if (error instanceof AccessDeniedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve bookings');
    }
  }

  async findById(
    bookingId: string,
    user: JwtPayload,
  ): Promise<ApiResponse<BookingDetailsWithComputedFields>> {
    try {
      // Validate user role
      if (user.role !== 'Renter') {
        throw new AccessDeniedException();
      }

      // Get renter ID from account ID
      const renterId = await this.getRenterIdByAccountId(user.accountId);

      const booking = await this.bookingRepository.findByIdAndRenter(
        bookingId,
        renterId,
      );

      if (!booking) {
        throw new BookingNotFoundException();
      }

      const bookingData = {
        bookingId: booking.BookingID,
        renterId: booking.RenterID,
        vehicleId: booking.VehicleID,
        startTime: booking.StartTime,
        endTime: booking.EndTime,
        depositAmount: booking.DepositAmount,
        status: booking.Status,
        createdAt: booking.CreatedAt,
        totalAmount: this.calculateTotalAmount(
          booking.StartTime,
          booking.EndTime,
          booking.DepositAmount,
        ),
        vehicle: {
          vehicleId: booking.vehicle.VehicleID,
          rentalLocationId: booking.vehicle.RentalLocationID,
          licensePlate: booking.vehicle.LicensePlate,
          model: booking.vehicle.Model,
          brand: booking.vehicle.Brand,
          year: booking.vehicle.Year,
          mileage: booking.vehicle.Mileage,
          batteryCapacity: booking.vehicle.BatteryCapacity,
          batteryLevel: booking.vehicle.BatteryLevel,
          chargingCycles: booking.vehicle.ChargingCycles,
          color: booking.vehicle.Color,
          imageUrl: booking.vehicle.ImageUrl,
          rentalRate: booking.vehicle.RentalRate,
          lastServiceDate: booking.vehicle.LastServiceDate,
          status: booking.vehicle.Status,
        },
        rentalLocation: {
          rentalLocationId: booking.vehicle.rentalLocation.RentalLocationID,
          name: booking.vehicle.rentalLocation.Name,
          address: booking.vehicle.rentalLocation.Address,
          city: booking.vehicle.rentalLocation.City,
          country: booking.vehicle.rentalLocation.Country,
          contactNumber: booking.vehicle.rentalLocation.ContactNumber,
          openingHours: booking.vehicle.rentalLocation.OpeningHours,
          closingHours: booking.vehicle.rentalLocation.ClosingHours,
          latitude: booking.vehicle.rentalLocation.Latitude,
          longitude: booking.vehicle.rentalLocation.Longitude,
        },
      };

      return {
        message: 'Booking details retrieved successfully',
        data: bookingData,
      };
    } catch (error) {
      if (
        error instanceof AccessDeniedException ||
        error instanceof BookingNotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve booking details',
      );
    }
  }

  private async getRenterIdByAccountId(accountId: string): Promise<string> {
    const renterId =
      await this.renterRepository.getRenterIdByAccountId(accountId);
    if (!renterId) {
      throw new UnauthorizedException();
    }
    return renterId;
  }
}
