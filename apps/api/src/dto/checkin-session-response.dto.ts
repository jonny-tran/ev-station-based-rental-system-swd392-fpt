/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ApiProperty } from '@nestjs/swagger';
import {
  VehicleInspectionStatus,
  VehicleInspectionType,
} from '@/packages/types/vehicle/vehicle-inspection';

export class BookingInfoDto {
  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  depositAmount: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  createdAt: Date;
}

export class RenterInfoDto {
  @ApiProperty()
  renterId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  identityNumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  dateOfBirth: Date;
}

export class VehicleInfoDto {
  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  licensePlate: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  color: string;
}

export class RentalLocationInfoDto {
  @ApiProperty()
  rentalLocationId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;
}

export class ValidateQRResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: {
    booking: BookingInfoDto;
    renter: RenterInfoDto;
    vehicle: VehicleInfoDto;
    rentalLocation: RentalLocationInfoDto;
  };
}

export class CheckinSessionInfoDto {
  @ApiProperty()
  inspectionId: number;

  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  staffId: string;

  @ApiProperty({
    enum: Object.values(VehicleInspectionType),
    enumName: 'VehicleInspectionType',
  })
  inspectionType: VehicleInspectionType;

  @ApiProperty()
  currentStep: number;

  @ApiProperty({
    enum: Object.values(VehicleInspectionStatus),
    enumName: 'VehicleInspectionStatus',
  })
  status: VehicleInspectionStatus;

  @ApiProperty()
  createdAt: Date;
}

export class CreateCheckinSessionResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: CheckinSessionInfoDto;
}

export class CheckinSessionListItemDto {
  @ApiProperty()
  inspectionId: number;

  @ApiProperty({
    enum: Object.values(VehicleInspectionStatus),
    enumName: 'VehicleInspectionStatus',
  })
  status: VehicleInspectionStatus;

  @ApiProperty()
  currentStep: number;

  @ApiProperty()
  booking: {
    bookingId: string;
    status: string;
    depositAmount: number;
    startTime: Date;
    endTime: Date;
  };

  @ApiProperty()
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
  };

  @ApiProperty()
  renter: {
    fullName: string;
    identityNumber: string;
  };
}

export class CheckinSessionListResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: {
    total: number;
    page: number;
    pageSize: number;
    sessions: CheckinSessionListItemDto[];
  };
}
