import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async findByIdWithRentalLocation(vehicleId: string): Promise<Vehicle | null> {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.rentalLocation', 'rentalLocation')
      .where('vehicle.VehicleID = :vehicleId', { vehicleId })
      .getOne();
  }

  async findById(vehicleId: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { VehicleID: vehicleId },
    });
  }
}
