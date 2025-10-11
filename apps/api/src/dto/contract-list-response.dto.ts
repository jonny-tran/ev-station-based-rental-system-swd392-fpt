import { ApiProperty } from '@nestjs/swagger';

export class ContractListItemDto {
  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({ description: 'Booking ID' })
  bookingId: string;

  @ApiProperty({ description: 'Contract status' })
  status: string;

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

  @ApiProperty({ description: 'Renter name' })
  renterName: string;

  @ApiProperty({ description: 'Renter email' })
  renterEmail: string;

  @ApiProperty({ description: 'Vehicle brand' })
  vehicleBrand: string;

  @ApiProperty({ description: 'Vehicle model' })
  vehicleModel: string;

  @ApiProperty({ description: 'Vehicle license plate' })
  vehicleLicensePlate: string;

  @ApiProperty({ description: 'Contract creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Contract last update date' })
  updatedAt: Date;
}

export class ContractListResponseDto {
  @ApiProperty({ description: 'List of contracts' })
  contracts: ContractListItemDto[];

  @ApiProperty({ description: 'Total number of contracts' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
