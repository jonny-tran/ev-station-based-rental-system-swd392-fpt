import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from '../controllers/contract.controller';
import { ContractService } from '../services/contract.service';
import { ContractRepository } from '../repositories/contract.repository';
import { CheckinSessionRepository } from '../repositories/checkin-session.repository';
import { Contract } from '../entities/contract.entity';
import { Booking } from '../entities/booking.entity';
import { VehicleInspection } from '../entities/vehicle-inspection.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Renter } from '../entities/renter.entity';
import { Account } from '../entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Booking, VehicleInspection, Vehicle, Renter, Account])],
  controllers: [ContractController],
  providers: [ContractService, ContractRepository, CheckinSessionRepository],
  exports: [ContractService, ContractRepository],
})
export class ContractModule {}
