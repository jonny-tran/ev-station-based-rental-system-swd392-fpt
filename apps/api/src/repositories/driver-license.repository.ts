import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverLicense } from '../entities/driver-license.entity';

@Injectable()
export class DriverLicenseRepository {
  constructor(
    @InjectRepository(DriverLicense)
    private readonly driverLicenseRepository: Repository<DriverLicense>,
  ) {}

  async findByRenterId(renterId: string): Promise<DriverLicense[]> {
    return this.driverLicenseRepository.find({
      where: { RenterID: renterId },
    });
  }

  async findByRenterIdWithRelations(
    renterId: string,
  ): Promise<DriverLicense[]> {
    return this.driverLicenseRepository.find({
      where: { RenterID: renterId },
      relations: ['renter'],
    });
  }
}
