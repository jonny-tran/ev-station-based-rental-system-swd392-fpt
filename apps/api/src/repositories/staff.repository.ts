import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';

@Injectable()
export class StaffRepository {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async findByAccountId(accountId: string): Promise<Staff | null> {
    return this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.rentalLocation', 'rentalLocation')
      .where('staff.AccountID = :accountId', { accountId })
      .getOne();
  }

  async findById(staffId: string): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { StaffID: staffId },
      relations: ['rentalLocation'],
    });
  }
}
