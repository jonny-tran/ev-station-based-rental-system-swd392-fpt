/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContractStatus } from '@/packages/types/contract/contract-status';

export class ContractListQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({
    description: 'Filter by contract status',
    enum: Object.values(ContractStatus),
    enumName: 'ContractStatus',
    required: false,
  })
  @IsOptional()
  @IsEnum(Object.values(ContractStatus))
  status?: ContractStatus;

  @ApiProperty({
    description: 'Search by booking ID, vehicle license plate, or renter name',
    example: '51A-12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
