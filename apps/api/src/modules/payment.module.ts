import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VnpayModule } from 'nestjs-vnpay';
import { Payment } from '../entities/payment.entity';
import { VehicleInspection } from '../entities/vehicle-inspection.entity';
import { Contract } from '../entities/contract.entity';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';
import { CheckinSessionRepository } from '../repositories/checkin-session.repository';
import { ContractRepository } from '../repositories/contract.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { Booking } from '../entities/booking.entity';
import { Vehicle } from '../entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      VehicleInspection,
      Contract,
      Booking,
      Vehicle,
    ]),
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        tmnCode: configService.getOrThrow<string>('VNPAY_TMN_CODE'),
        secureSecret: configService.getOrThrow<string>('VNPAY_SECURE_SECRET'),
        vnpayHost: configService.get<string>('VNPAY_HOST') || 'https://sandbox.vnpayment.vn',
        testMode: configService.get<string>('VNPAY_TEST_MODE') === 'true',
        hashAlgorithm: configService.get<string>('VNPAY_HASH_ALGORITHM') || 'SHA512',
        enableLog: configService.get<string>('VNPAY_ENABLE_LOG') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    CheckinSessionRepository,
    ContractRepository,
    BookingRepository,
    VehicleRepository,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}

