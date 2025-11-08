import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InjectRepository,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { VnpayService } from 'nestjs-vnpay';
import { Payment } from '../entities/payment.entity';
import { VehicleInspection } from '../entities/vehicle-inspection.entity';
import { Contract } from '../entities/contract.entity';
import { Booking } from '../entities/booking.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { CreatePaymentUrlDto } from '../dto/create-payment-url.dto';
import { PaymentMethod, PaymentStatus, PaymentType } from '@/packages/types/payment/payment-method';
import { CheckinSessionRepository } from '../repositories/checkin-session.repository';
import { ContractRepository } from '../repositories/contract.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private readonly vnpayService: VnpayService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly checkinSessionRepository: CheckinSessionRepository,
    private readonly contractRepository: ContractRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentUrl(
    dto: CreatePaymentUrlDto,
    ipAddr: string,
  ): Promise<{ paymentUrl: string; paymentId: number }> {
    // Validate payment method
    if (dto.paymentMethod !== PaymentMethod.VNPay) {
      throw new BadRequestException('Only VNPay payment method is supported');
    }

    // Convert inspectionId to number
    const inspectionId = parseInt(dto.inspectionId, 10);
    if (isNaN(inspectionId)) {
      throw new BadRequestException('Invalid inspection ID');
    }

    // Find inspection with all relations
    const inspection =
      await this.checkinSessionRepository.findByIdWithAllRelations(inspectionId);

    if (!inspection) {
      throw new NotFoundException('Vehicle inspection not found');
    }

    // Validate inspection is at step 4
    if (inspection.CurrentStep !== 4) {
      throw new BadRequestException(
        `Inspection is not at step 4. Current step: ${inspection.CurrentStep}`,
      );
    }

    // Get booking with vehicle
    const booking = await this.bookingRepository.findById(inspection.BookingID);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Get contract from booking
    const contract = await this.contractRepository.findByBookingId(
      inspection.BookingID,
    );
    if (!contract) {
      throw new NotFoundException(
        'Contract not found for this inspection. Please complete step 3 first.',
      );
    }

    // Get vehicle to calculate rental price
    const vehicle = await this.vehicleRepository.findById(booking.VehicleID);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Calculate total amount
    // depositAmount from booking
    const depositAmount = booking.DepositAmount || 0;

    // Calculate rental price: Vehicle.RentalRate * duration (in hours)
    const startTime = new Date(booking.StartTime);
    const endTime = new Date(booking.EndTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to hours
    const rentalRate = vehicle.RentalRate || 0;
    const rentalPrice = rentalRate * durationHours;

    // Total amount = deposit + rental price
    const totalAmount = depositAmount + rentalPrice;

    if (totalAmount <= 0) {
      throw new BadRequestException('Total amount must be greater than 0');
    }

    // Create pending payment record
    const newPayment = this.paymentRepository.create({
      ContractDatTTID: contract.ContractDatTTID,
      Amount: totalAmount,
      Currency: 'VND',
      PaymentType: PaymentType.RentalFee,
      PaymentMethod: PaymentMethod.VNPay,
      Status: PaymentStatus.Pending,
      TransactionID: null,
      RefundTransactionID: null,
      ReceiptUrl: null,
      PaymentDate: new Date(),
    });

    const savedPayment = await this.paymentRepository.save(newPayment);

    // Generate VNPay payment URL
    // VNPay requires amount in smallest currency unit (VND * 100)
    const vnpayAmount = Math.round(totalAmount * 100);

    // Get return URL from config or use default
    const returnUrl =
      this.configService.get<string>('VNPAY_RETURN_URL') ||
      'http://localhost:3000/payment/callback';

    // Create order info
    const orderInfo = `Thanh toan checkin xe ${inspection.InspectionDatTTID}`;

    // Generate payment URL using VnpayService
    // Use payment ID as order reference
    // VNPay payment parameters
    const paymentUrl = this.vnpayService.buildPaymentUrl({
      amount: vnpayAmount,
      ipAddr: ipAddr,
      orderId: savedPayment.PaymentID.toString(),
      orderInfo: orderInfo,
      returnUrl: returnUrl,
      locale: 'vn',
      orderType: 'other',
    });

    return {
      paymentUrl: paymentUrl,
      paymentId: savedPayment.PaymentID,
    };
  }
}

