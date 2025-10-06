import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class Step1RejectDto {
  @ApiProperty({
    description: 'Reason for rejecting the documents',
    example: 'Driver license expired',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;
}
