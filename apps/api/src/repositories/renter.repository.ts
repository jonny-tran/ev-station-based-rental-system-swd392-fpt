import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Renter } from '../entities/renter.entity';

@Injectable()
export class RenterRepository {
  constructor(
    @InjectRepository(Renter)
    private readonly renterRepository: Repository<Renter>,
  ) {}

  async findByAccountId(accountId: string): Promise<Renter | null> {
    return this.renterRepository
      .createQueryBuilder('renter')
      .where('renter.AccountID = :accountId', { accountId })
      .getOne();
  }

  async getRenterIdByAccountId(accountId: string): Promise<string | null> {
    const renter = await this.findByAccountId(accountId);
    return renter ? renter.RenterID : null;
  }
}
