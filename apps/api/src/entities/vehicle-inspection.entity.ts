import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

export enum InspectionType {
  CheckIn = 'check_in',
  CheckOut = 'check_out',
}

export enum InspectionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

@Entity('VehicleInspectionDatTT')
export class VehicleInspection {
  @Column({
    name: 'InspectionDatTTID',
    type: 'bigint',
    primary: true,
    generated: 'increment',
  })
  InspectionDatTTID: number;

  @Column({ name: 'StaffID', type: 'uniqueidentifier' })
  StaffID: string;

  @Column({ name: 'BookingID', type: 'uniqueidentifier' })
  BookingID: string;

  @Column({ name: 'InspectionType', type: 'nvarchar', length: 255 })
  InspectionType: InspectionType;

  @Column({ name: 'InspectionDateTime', type: 'datetime2' })
  InspectionDateTime: Date;

  @Column({
    name: 'VehicleConditionNotes',
    type: 'nvarchar',
    length: 'max',
    nullable: true,
  })
  VehicleConditionNotes: string;

  @Column({ name: 'OdometerReading', type: 'int', nullable: true })
  OdometerReading: number;

  @Column({
    name: 'BatteryLevel',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  BatteryLevel: number;

  @Column({
    name: 'DamageNotes',
    type: 'nvarchar',
    length: 'max',
    nullable: true,
  })
  DamageNotes: string;

  @Column({
    name: 'PhotoUrls',
    type: 'nvarchar',
    length: 'max',
    nullable: true,
  })
  PhotoUrls: string;

  @Column({ name: 'CurrentStep', type: 'tinyint', nullable: true })
  CurrentStep: number;

  @Column({ name: 'CreatedAt', type: 'datetime2' })
  CreatedAt: Date;

  @Column({ name: 'UpdatedAt', type: 'datetime2' })
  UpdatedAt: Date;

  @Column({ name: 'Status', type: 'nvarchar', length: 255 })
  Status: InspectionStatus;

  @Column({ name: 'SubStatus', type: 'nvarchar', length: 50, nullable: true })
  SubStatus: string;

  @Column({
    name: 'RejectedReason',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  RejectedReason: string;

  // Relations
  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'BookingID' })
  booking: Booking;
}
