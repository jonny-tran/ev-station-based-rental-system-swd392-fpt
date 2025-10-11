import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RejectContractDto {
  @ApiProperty({
    description: 'Reason for rejecting the contract',
    example: 'Contract contains incorrect information',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;
}
