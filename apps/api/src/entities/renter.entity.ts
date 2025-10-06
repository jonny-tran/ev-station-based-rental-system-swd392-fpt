import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Account } from './account.entity';
import { Booking } from './booking.entity';
import { DriverLicense } from './driver-license.entity';

@Entity('Renter')
export class Renter {
  @Column({ name: 'RenterID', type: 'uniqueidentifier', primary: true })
  RenterID: string;

  @Column({ name: 'AccountID', type: 'uniqueidentifier' })
  AccountID: string;

  @Column({ name: 'Address', type: 'nvarchar', length: 255, nullable: true })
  Address: string;

  @Column({ name: 'DateOfBirth', type: 'date', nullable: true })
  DateOfBirth: Date;

  @Column({
    name: 'IdentityNumber',
    type: 'nvarchar',
    length: 20,
    nullable: true,
  })
  IdentityNumber: string;

  @Column({
    name: 'FrontIdentityImageUrl',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  FrontIdentityImageUrl: string;

  @Column({
    name: 'BackIdentityImageUrl',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  BackIdentityImageUrl: string;

  // Relations
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'AccountID' })
  account: Account;

  @OneToMany(() => Booking, (booking) => booking.renter)
  bookings: Booking[];

  @OneToMany(() => DriverLicense, (driverLicense) => driverLicense.renter)
  driverLicenses: DriverLicense[];
}
