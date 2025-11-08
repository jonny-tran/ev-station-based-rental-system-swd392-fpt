import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@/packages/types/payment/payment-method';

export class CreatePaymentUrlDto {
  @ApiProperty({
    description: 'Vehicle inspection ID',
    example: '1',
  })
  @IsString()
  inspectionId: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.VNPay,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

