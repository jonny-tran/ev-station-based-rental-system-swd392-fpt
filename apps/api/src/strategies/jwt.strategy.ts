/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../repositories/account.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { RenterRepository } from '../repositories/renter.repository';

export interface JwtPayload {
  accountId: string;
  fullName: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountRepository: AccountRepository,
    private readonly staffRepository: StaffRepository,
    private readonly renterRepository: RenterRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const account = await this.accountRepository.findById(payload.accountId);

    if (!account || account.status !== 'Active') {
      throw new UnauthorizedException('Invalid token or account inactive');
    }

    const baseUser = {
      accountId: account.accountId,
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
      role: account.role,
      status: account.status,
    };

    // Lấy thông tin bổ sung dựa trên role
    if (account.role === 'Staff') {
      const staff = await this.staffRepository.findByAccountId(
        payload.accountId,
      );
      return {
        ...baseUser,
        staffId: staff?.StaffID || null,
        rentalLocationId: staff?.RentalLocationID || null,
      };
    } else if (account.role === 'Renter') {
      const renter = await this.renterRepository.findByAccountId(
        payload.accountId,
      );
      return {
        ...baseUser,
        renterId: renter?.RenterID || null,
      };
    }

    return baseUser;
  }
}
