import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { BookingModule } from './modules/booking.module';
import { CheckinSessionModule } from './modules/checkin-session.module';
import { Account } from './entities/account.entity';
import { Booking } from './entities/booking.entity';
import { Vehicle } from './entities/vehicle.entity';
import { RentalLocation } from './entities/rentalLocation.entity';
import { Renter } from './entities/renter.entity';
import { Staff } from './entities/staff.entity';
import { VehicleInspection } from './entities/vehicle-inspection.entity';
import { DriverLicense } from './entities/driver-license.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '1433'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [
          Account,
          Booking,
          Vehicle,
          RentalLocation,
          Renter,
          Staff,
          VehicleInspection,
          DriverLicense,
        ],
        synchronize: false, // Tắt hoàn toàn synchronize vì đã có sẵn database
        logging: false,
        options: {
          encrypt: process.env.DB_ENCRYPT === 'false',
          trustServerCertificate:
            process.env.DB_TRUSTSERVERCERTIFICATE === 'true',
        },
      }),
    }),
    AuthModule,
    BookingModule,
    CheckinSessionModule,
  ],
})
export class AppModule {}
