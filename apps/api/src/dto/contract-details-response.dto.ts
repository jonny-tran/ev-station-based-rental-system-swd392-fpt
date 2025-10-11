import { ApiProperty } from '@nestjs/swagger';

export class RenterInfoDto {
  @ApiProperty({ description: 'Renter ID' })
  renterId: string;

  @ApiProperty({ description: 'Full name of the renter' })
  fullName: string;

  @ApiProperty({ description: 'Email of the renter' })
  email: string;

  @ApiProperty({ description: 'Phone number of the renter', required: false })
  phoneNumber?: string;
}

export class VehicleInfoDto {
  @ApiProperty({ description: 'Vehicle ID' })
  vehicleId: string;

  @ApiProperty({ description: 'Brand of the vehicle' })
  brand: string;

  @ApiProperty({ description: 'Model of the vehicle' })
  model: string;

  @ApiProperty({ description: 'License plate of the vehicle' })
  licensePlate: string;

  @ApiProperty({ description: 'Year of the vehicle', required: false })
  year?: number;

  @ApiProperty({ description: 'Color of the vehicle', required: false })
  color?: string;
}

export class ContractDetailsResponseDto {
  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({ description: 'Booking ID' })
  bookingId: string;

  @ApiProperty({ description: 'Contract status' })
  status: string;

  @ApiProperty({ description: 'Terms and conditions' })
  termsAndConditions: string;

  @ApiProperty({ description: 'Start date of the contract' })
  startDate: Date;

  @ApiProperty({ description: 'End date of the contract' })
  endDate: Date;

  @ApiProperty({ description: 'Whether renter has signed' })
  signedByRenter: boolean;

  @ApiProperty({ description: 'Whether staff has signed' })
  signedByStaff: boolean;

  @ApiProperty({
    description: 'Date when contract was signed',
    required: false,
  })
  signedAt?: Date;

  @ApiProperty({ description: 'Renter information' })
  renter: RenterInfoDto;

  @ApiProperty({ description: 'Vehicle information' })
  vehicle: VehicleInfoDto;

  @ApiProperty({ description: 'Contract creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Contract last update date' })
  updatedAt: Date;
}
