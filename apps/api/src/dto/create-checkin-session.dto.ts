/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckinSessionDto {
  @ApiProperty({
    description: 'Booking ID from QR code',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}
