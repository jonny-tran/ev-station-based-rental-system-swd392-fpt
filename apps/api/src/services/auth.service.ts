/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AccountRepository } from '../repositories/account.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../strategies/jwt.strategy';
import {
  EmailNotFoundException,
  PhoneNotFoundException,
  InvalidPasswordException,
  AccountInactiveException,
  AccountLockedException,
} from '../exceptions/auth.exceptions';
import { Account } from '../entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly staffRepository: StaffRepository,
    private readonly renterRepository: RenterRepository,
    private readonly jwtService: JwtService,
  ) {}

  private checkAccountStatus(status: string): void {
    switch (status) {
      case 'Inactive':
        throw new AccountInactiveException();
      case 'Locked':
        throw new AccountLockedException();
      default:
        // Account is active/pending continue
        break;
    }
  }

  async validateUser(emailOrPhone: string, password: string) {
    const startTime = Date.now();

    // Kiểm tra xem input là email hay phone number
    const isEmail = emailOrPhone.includes('@');
    let account: Account | null = null;

    if (isEmail) {
      account = await this.accountRepository.findByEmail(emailOrPhone);
      if (!account) {
        throw new EmailNotFoundException();
      }
    } else {
      account = await this.accountRepository.findByPhone(emailOrPhone);
      if (!account) {
        throw new PhoneNotFoundException();
      }
    }

    // Kiểm tra trạng thái tài khoản
    this.checkAccountStatus(account.status);

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(
      password,
      account.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    // Return account info without password
    const { passwordHash, ...result } = account;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(
      loginDto.emailOrPhone,
      loginDto.password,
    );

    const payload: JwtPayload = {
      accountId: user.accountId,
      fullName: user.fullName,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        accountId: user.accountId,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async getUserInfo(accountId: string) {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    const baseInfo = {
      accountId: account.accountId,
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
      role: account.role,
      status: account.status,
    };

    // Lấy thông tin bổ sung dựa trên role
    if (account.role === 'Staff') {
      const staff = await this.staffRepository.findByAccountId(accountId);
      return {
        ...baseInfo,
        staffId: staff?.StaffID || null,
        rentalLocationId: staff?.RentalLocationID || null,
        rentalLocation: staff?.rentalLocation || null,
      };
    } else if (account.role === 'Renter') {
      const renter = await this.renterRepository.findByAccountId(accountId);
      return {
        ...baseInfo,
        renterId: renter?.RenterID || null,
        address: renter?.Address || null,
        dateOfBirth: renter?.DateOfBirth || null,
        identityNumber: renter?.IdentityNumber || null,
      };
    }

    return baseInfo;
  }
}
