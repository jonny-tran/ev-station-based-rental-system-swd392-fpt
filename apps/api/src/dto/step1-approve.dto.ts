import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class Step1ApproveDto {
  @ApiProperty({
    description: 'Optional notes about the document verification',
    example: 'All documents verified successfully',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
