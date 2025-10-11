import { ApiProperty } from '@nestjs/swagger';

export class ContractResponseDto {
  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({ description: 'Contract status' })
  status: string;

  @ApiProperty({ description: 'Whether renter has signed' })
  signedByRenter: boolean;

  @ApiProperty({ description: 'Whether staff has signed' })
  signedByStaff: boolean;

  @ApiProperty({
    description: 'Date when contract was signed',
    required: false,
  })
  signedAt?: Date;

  @ApiProperty({ description: 'Contract last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Status reason if voided', required: false })
  statusReason?: string;
}
