import { ApiProperty } from '@nestjs/swagger';

export class CheckinSessionDetailsDto {
  @ApiProperty({
    description: 'Complete inspection details',
    example: {
      inspectionId: 101,
      staffId: 'staff-123',
      bookingId: 'booking-123',
      inspectionType: 'check_in',
      inspectionDateTime: '2024-01-15T10:00:00Z',
      vehicleConditionNotes: null,
      odometerReading: null,
      batteryLevel: null,
      damageNotes: null,
      photoUrls: null,
      currentStep: 1,
      status: 'Pending',
      subStatus: null,
      rejectedReason: null,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  })
  inspection: {
    inspectionId: number;
    staffId: string;
    bookingId: string;
    inspectionType: string;
    inspectionDateTime: Date;
    vehicleConditionNotes: string | null;
    odometerReading: number | null;
    batteryLevel: number | null;
    damageNotes: string | null;
    photoUrls: string | null;
    currentStep: number | null;
    status: string;
    subStatus: string | null;
    rejectedReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({
    description: 'Complete booking details',
    example: {
      bookingId: '123e4567-e89b-12d3-a456-426614174000',
      renterId: 'renter-123',
      vehicleId: 'vehicle-123',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T18:00:00Z',
      depositAmount: 150000,
      status: 'Pending',
      createdAt: '2024-01-14T10:00:00Z',
      cancelledAt: null,
    },
  })
  booking: {
    bookingId: string;
    renterId: string;
    vehicleId: string;
    startTime: Date;
    endTime: Date;
    depositAmount: number;
    status: string;
    createdAt: Date;
    cancelledAt: Date | null;
  };

  @ApiProperty({
    description: 'Complete renter details',
    example: {
      renterId: '123e4567-e89b-12d3-a456-426614174000',
      accountId: 'account-123',
      address: '123 Main Street, District 1',
      dateOfBirth: '1990-01-01',
      identityNumber: '123456789',
      frontIdentityImageUrl: 'https://example.com/front-id.jpg',
      backIdentityImageUrl: 'https://example.com/back-id.jpg',
    },
  })
  renter: {
    renterId: string;
    accountId: string;
    address: string | null;
    dateOfBirth: Date | null;
    identityNumber: string | null;
    frontIdentityImageUrl: string | null;
    backIdentityImageUrl: string | null;
  };

  @ApiProperty({
    description: 'Complete account details',
    example: {
      accountId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'renter@example.com',
      phoneNumber: '0901234567',
      fullName: 'Nguyen Van A',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'Renter',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  })
  account: {
    accountId: string;
    email: string;
    phoneNumber: string | null;
    fullName: string;
    avatarUrl: string | null;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({
    description: 'Complete driver license details',
    example: {
      licenseId: 1,
      renterId: 'renter-123',
      licenseNumber: 'B1234567',
      issuedDate: '2020-01-01',
      expiryDate: '2027-09-30',
      licenseType: 'Car',
      licenseImageUrl: 'https://example.com/license.jpg',
      issuedBy: 'Traffic Department',
      verifiedStatus: 'Verified',
      verifiedAt: '2024-01-01T00:00:00Z',
    },
  })
  driverLicense: {
    licenseId: number;
    renterId: string;
    licenseNumber: string;
    issuedDate: Date;
    expiryDate: Date;
    licenseType: string;
    licenseImageUrl: string | null;
    issuedBy: string | null;
    verifiedStatus: string;
    verifiedAt: Date | null;
  } | null;

  @ApiProperty({
    description: 'Complete vehicle details',
    example: {
      vehicleId: '123e4567-e89b-12d3-a456-426614174000',
      rentalLocationId: 'location-123',
      licensePlate: '51A-99999',
      model: 'Model 3',
      brand: 'Tesla',
      year: 2023,
      mileage: 10000,
      batteryCapacity: 75,
      batteryLevel: 85.5,
      chargingCycles: 150,
      color: 'White',
      imageUrl: 'https://example.com/vehicle.jpg',
      rentalRate: 500000,
      lastServiceDate: '2024-01-01T00:00:00Z',
      status: 'Available',
    },
  })
  vehicle: {
    vehicleId: string;
    rentalLocationId: string;
    licensePlate: string;
    model: string;
    brand: string;
    year: number | null;
    mileage: number;
    batteryCapacity: number | null;
    batteryLevel: number | null;
    chargingCycles: number | null;
    color: string | null;
    imageUrl: string | null;
    rentalRate: number | null;
    lastServiceDate: Date | null;
    status: string;
  };

  @ApiProperty({
    description: 'Complete rental location details',
    example: {
      rentalLocationId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Downtown Station',
      address: '456 Downtown Avenue, District 1',
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      contactNumber: '0901234567',
      openingHours: '08:00',
      closingHours: '22:00',
      latitude: 10.762622,
      longitude: 106.660172,
    },
  })
  rentalLocation: {
    rentalLocationId: string;
    name: string;
    address: string;
    city: string;
    country: string;
    contactNumber: string | null;
    openingHours: string | null;
    closingHours: string | null;
    latitude: number | null;
    longitude: number | null;
  };

  @ApiProperty({
    description: 'Contract details (null if not yet created - before step 3)',
    example: null,
  })
  contract: {
    contractId: string;
    bookingId: string;
    termsAndConditions: string | null;
    startDate: Date;
    endDate: Date;
    signedAt: Date | null;
    signedByRenter: boolean;
    signedByStaff: boolean;
    contractPdfUrl: string | null;
    voidedAt: Date | null;
    status: string;
    statusReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export class CheckinSessionDetailsResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Check-in session details retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Check-in session details data',
    type: CheckinSessionDetailsDto,
  })
  data: CheckinSessionDetailsDto;
}

export class Step1ApprovalResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'License verification approved. Moved to Step 2.',
  })
  message: string;

  @ApiProperty({
    description: 'Updated inspection data',
    example: {
      inspectionId: 101,
      currentStep: 2,
      status: 'Pending',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  data: {
    inspectionId: number;
    currentStep: number;
    status: string;
    updatedAt: Date;
  };
}

export class Step1RejectionResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'License verification rejected.',
  })
  message: string;

  @ApiProperty({
    description: 'Updated inspection data',
    example: {
      inspectionId: 101,
      status: 'Rejected',
      rejectedReason: 'Driver license expired',
      currentStep: 1,
    },
  })
  data: {
    inspectionId: number;
    status: string;
    rejectedReason: string;
    currentStep: number;
  };
}
