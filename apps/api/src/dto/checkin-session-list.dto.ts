/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleInspectionStatus } from '@/packages/types/vehicle/vehicle-inspection';

export class CheckinSessionListDto {
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
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiProperty({
    description: 'Filter by inspection status',
    enum: Object.values(VehicleInspectionStatus),
    enumName: 'VehicleInspectionStatus',
    required: false,
  })
  @IsOptional()
  @IsEnum(VehicleInspectionStatus)
  status?: VehicleInspectionStatus;

  @ApiProperty({
    description: 'Search by booking ID, vehicle model, or renter name',
    example: 'Tesla',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
