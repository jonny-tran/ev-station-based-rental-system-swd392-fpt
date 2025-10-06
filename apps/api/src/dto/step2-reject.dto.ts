import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Step2RejectDto {
  @ApiProperty({
    description: 'Reason for rejecting the vehicle inspection',
    example: 'Front bumper damaged',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class Step2RejectResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Vehicle inspection rejected',
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
      status: {
        type: 'string',
        description: 'Inspection status',
        example: 'Rejected',
      },
      rejectedReason: {
        type: 'string',
        description: 'Reason for rejection',
        example: 'Front bumper damaged',
      },
    },
  })
  data: {
    inspectionId: number;
    status: string;
    rejectedReason: string;
  };
}
