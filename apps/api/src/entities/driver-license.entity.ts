import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Renter } from './renter.entity';

export enum LicenseType {
  Car = 'Car',
  Motorcycle = 'Motorcycle',
}

export enum VerifiedStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected',
}

@Entity('DriverLicense')
export class DriverLicense {
  @Column({
    name: 'LicenseID',
    type: 'bigint',
    primary: true,
    generated: 'increment',
  })
  LicenseID: number;

  @Column({ name: 'RenterID', type: 'uniqueidentifier' })
  RenterID: string;

  @Column({ name: 'LicenseNumber', type: 'nvarchar', length: 50 })
  LicenseNumber: string;

  @Column({ name: 'IssuedDate', type: 'date' })
  IssuedDate: Date;

  @Column({ name: 'ExpiryDate', type: 'date' })
  ExpiryDate: Date;

  @Column({ name: 'LicenseType', type: 'nvarchar', length: 255 })
  LicenseType: LicenseType;

  @Column({
    name: 'LicenseImageUrl',
    type: 'nvarchar',
    length: 250,
    nullable: true,
  })
  LicenseImageUrl: string;

  @Column({
    name: 'IssuedBy',
    type: 'nvarchar',
    length: 120,
    nullable: true,
  })
  IssuedBy: string;

  @Column({ name: 'VerifiedStatus', type: 'nvarchar', length: 255 })
  VerifiedStatus: VerifiedStatus;

  @Column({
    name: 'VerifiedAt',
    type: 'datetime2',
    nullable: true,
  })
  VerifiedAt: Date;

  // Relations
  @ManyToOne(() => Renter)
  @JoinColumn({ name: 'RenterID' })
  renter: Renter;
}
