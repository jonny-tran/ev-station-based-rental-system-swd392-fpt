import {
  Controller,
  Post,
  Body,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentUrlDto } from '../dto/create-payment-url.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PaymentMethod } from '@/packages/types/payment/payment-method';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('api/payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-url')
  @ApiOperation({
    summary: 'Create VNPay payment URL for check-in session step 4',
    description:
      'Validates inspection is at step 4, creates pending payment record, and generates VNPay payment URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment URL created successfully',
    schema: {
      type: 'object',
      properties: {
        paymentUrl: {
          type: 'string',
          example:
            'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...',
        },
        paymentId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or inspection not at step 4',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection or contract not found',
  })
  async createPaymentUrl(
    @Body() createPaymentDto: CreatePaymentUrlDto,
    @Req() req: Request,
  ) {
    // Validate payment method
    if (createPaymentDto.paymentMethod !== PaymentMethod.VNPay) {
      throw new BadRequestException('Only VNPay payment method is supported');
    }

    // Get IP address from request
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.paymentService.createPaymentUrl(createPaymentDto, ipAddr);
  }
}
