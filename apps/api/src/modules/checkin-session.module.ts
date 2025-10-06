import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinSessionController } from '../controllers/checkin-session.controller';
import { CheckinSessionService } from '../services/checkin-session.service';
import { BookingRepository } from '../repositories/booking.repository';
import { CheckinSessionRepository } from '../repositories/checkin-session.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { RentalLocationRepository } from '../repositories/rental-location.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { DriverLicenseRepository } from '../repositories/driver-license.repository';
import { Booking } from '../entities/booking.entity';
import { VehicleInspection } from '../entities/vehicle-inspection.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { RentalLocation } from '../entities/rentalLocation.entity';
import { Renter } from '../entities/renter.entity';
import { Account } from '../entities/account.entity';
import { DriverLicense } from '../entities/driver-license.entity';
import { Contract } from '../entities/contract.entity';
import { CloudinaryService } from '../../third-party/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      VehicleInspection,
      Vehicle,
      RentalLocation,
      Renter,
      Account,
      DriverLicense,
      Contract,
    ]),
  ],
  controllers: [CheckinSessionController],
  providers: [
    CheckinSessionService,
    BookingRepository,
    CheckinSessionRepository,
    VehicleRepository,
    RentalLocationRepository,
    RenterRepository,
    DriverLicenseRepository,
    CloudinaryService,
  ],
  exports: [CheckinSessionService],
})
export class CheckinSessionModule {}
