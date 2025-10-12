import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Renter } from './renter.entity';
import { LicenseType } from '@/packages/types/documents/driver-license';
import { VerificationStatus } from '@/packages/types/common/shared-enums';

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
  VerifiedStatus: VerificationStatus;

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
