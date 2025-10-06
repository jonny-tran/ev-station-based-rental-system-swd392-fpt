import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AccountRepository } from '../repositories/account.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { Account } from '../entities/account.entity';
import { Staff } from '../entities/staff.entity';
import { Renter } from '../entities/renter.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([Account, Staff, Renter]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountRepository,
    StaffRepository,
    RenterRepository,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
