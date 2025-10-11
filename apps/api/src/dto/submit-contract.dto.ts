import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class RenterInfoUpdateDto {
  @ApiProperty({ description: 'Full name of the renter', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'Email of the renter', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the renter', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class SubmitContractDto {
  @ApiProperty({ description: 'Renter information to update', required: false })
  @IsOptional()
  renterInfo?: RenterInfoUpdateDto;
}
