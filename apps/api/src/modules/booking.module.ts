import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from '../controllers/booking.controller';
import { BookingService } from '../services/booking.service';
import { BookingRepository } from '../repositories/booking.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { Booking } from '../entities/booking.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { RentalLocation } from '../entities/rentalLocation.entity';
import { Renter } from '../entities/renter.entity';
import { Account } from '../entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Vehicle,
      RentalLocation,
      Renter,
      Account,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, RenterRepository],
  exports: [BookingService, BookingRepository, RenterRepository],
})
export class BookingModule {}
