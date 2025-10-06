import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Renter } from './renter.entity';

@Entity('Booking')
export class Booking {
  @Column({ name: 'BookingID', type: 'uniqueidentifier', primary: true })
  BookingID: string;

  @Column({ name: 'RenterID', type: 'uniqueidentifier' })
  RenterID: string;

  @Column({ name: 'VehicleID', type: 'uniqueidentifier' })
  VehicleID: string;

  @Column({ name: 'StartTime', type: 'datetime2' })
  StartTime: Date;

  @Column({ name: 'EndTime', type: 'datetime2' })
  EndTime: Date;

  @Column({ name: 'DepositAmount', type: 'decimal', precision: 10, scale: 2 })
  DepositAmount: number;

  @Column({ name: 'Status', type: 'nvarchar', length: 255 })
  Status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Expired' | 'Completed';

  @Column({ name: 'CreatedAt', type: 'datetime2' })
  CreatedAt: Date;

  @Column({ name: 'CancelledAt', type: 'datetime2', nullable: true })
  CancelledAt: Date;

  // Relations
  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'VehicleID' })
  vehicle: Vehicle;

  @ManyToOne(() => Renter)
  @JoinColumn({ name: 'RenterID' })
  renter: Renter;
}
