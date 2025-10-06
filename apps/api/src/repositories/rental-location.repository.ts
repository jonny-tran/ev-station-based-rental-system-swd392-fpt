import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalLocation } from '../entities/rentalLocation.entity';

@Injectable()
export class RentalLocationRepository {
  constructor(
    @InjectRepository(RentalLocation)
    private readonly rentalLocationRepository: Repository<RentalLocation>,
  ) {}

  async findById(rentalLocationId: string): Promise<RentalLocation | null> {
    return this.rentalLocationRepository.findOne({
      where: { RentalLocationID: rentalLocationId },
    });
  }

  async findAll(): Promise<RentalLocation[]> {
    return this.rentalLocationRepository.find();
  }
}
