import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

export enum ContractStatus {
  Draft = 'Draft',
  Active = 'Active',
  Completed = 'Completed',
  Terminated = 'Terminated',
  Voided = 'Voided',
}

@Entity('ContractDatTT')
export class Contract {
  @Column({
    name: 'ContractDatTTID',
    type: 'uniqueidentifier',
    primary: true,
    generated: 'uuid',
    default: () => 'NEWID()',
  })
  ContractDatTTID: string;

  @Column({ name: 'BookingID', type: 'uniqueidentifier' })
  BookingID: string;

  @Column({
    name: 'TermsAndConditions',
    type: 'nvarchar',
    length: 'max',
    nullable: true,
  })
  TermsAndConditions: string;

  @Column({ name: 'StartDate', type: 'datetime2' })
  StartDate: Date;

  @Column({ name: 'EndDate', type: 'datetime2' })
  EndDate: Date;

  @Column({ name: 'SignedAt', type: 'datetime2', nullable: true })
  SignedAt: Date;

  @Column({ name: 'SignedByRenter', type: 'bit', default: false })
  SignedByRenter: boolean;

  @Column({ name: 'SignedByStaff', type: 'bit', default: false })
  SignedByStaff: boolean;

  @Column({
    name: 'ContractPdfUrl',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  ContractPdfUrl: string;

  @Column({ name: 'VoidedAt', type: 'datetime2', nullable: true })
  VoidedAt: Date;

  @Column({ name: 'CreatedAt', type: 'datetime2' })
  CreatedAt: Date;

  @Column({ name: 'UpdatedAt', type: 'datetime2' })
  UpdatedAt: Date;

  @Column({ name: 'Status', type: 'nvarchar', length: 255 })
  Status: ContractStatus;

  @Column({
    name: 'StatusReason',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  StatusReason: string;

  // Relations
  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'BookingID' })
  booking: Booking;
}
