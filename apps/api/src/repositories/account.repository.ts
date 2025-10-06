import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findByEmailOrPhone(emailOrPhone: string): Promise<Account | null> {
    // Kiểm tra xem input là email hay phone number
    const isEmail = emailOrPhone.includes('@');

    if (isEmail) {
      return this.accountRepository.findOne({
        where: { email: emailOrPhone },
      });
    } else {
      return this.accountRepository.findOne({
        where: { phoneNumber: emailOrPhone },
      });
    }
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { email },
    });
  }

  async findByPhone(phoneNumber: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { phoneNumber },
    });
  }

  async findById(accountId: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { accountId },
    });
  }
}
