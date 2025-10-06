import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateVehicleDataDto {
  @ApiProperty({
    description: 'Odometer reading in kilometers',
    example: 15200,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  odometerKm: number;

  @ApiProperty({
    description: 'Battery level percentage',
    example: 87.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  batteryLevel: number;

  @ApiProperty({
    description: 'Vehicle condition notes',
    example: 'Normal condition',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicleConditionNotes?: string;

  @ApiProperty({
    description: 'Damage notes',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  damageNotes?: string;
}

export class UpdateVehicleDataResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Vehicle inspection data updated and contract created (Step 3)',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    type: 'object',
    properties: {
      inspectionId: {
        type: 'number',
        description: 'Inspection ID',
        example: 101,
      },
      currentStep: {
        type: 'number',
        description: 'Current step',
        example: 3,
      },
      status: {
        type: 'string',
        description: 'Inspection status',
        example: 'Pending',
      },
      odometerReading: {
        type: 'number',
        description: 'Odometer reading',
        example: 15200,
      },
      batteryLevel: {
        type: 'number',
        description: 'Battery level',
        example: 87.5,
      },
      contract: {
        type: 'object',
        properties: {
          contractId: {
            type: 'string',
            description: 'Contract ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          bookingId: {
            type: 'string',
            description: 'Booking ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          status: {
            type: 'string',
            description: 'Contract status',
            example: 'Draft',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Contract start date',
            example: '2024-01-15T10:00:00Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Contract end date',
            example: '2024-01-20T18:00:00Z',
          },
        },
      },
    },
  })
  data: {
    inspectionId: number;
    currentStep: number;
    status: string;
    odometerReading: number;
    batteryLevel: number;
    contract: {
      contractId: string;
      bookingId: string;
      status: string;
      startDate: Date;
      endDate: Date;
    };
  };
}
