import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RentalLocation } from './rentalLocation.entity';
import { VehicleStatus } from '@/packages/types/vehicle/vehicle-status';

@Entity('Vehicle')
export class Vehicle {
  @Column({ name: 'VehicleID', type: 'uniqueidentifier', primary: true })
  VehicleID: string;

  @Column({ name: 'RentalLocationID', type: 'uniqueidentifier' })
  RentalLocationID: string;

  @Column({ name: 'LicensePlate', type: 'nvarchar', length: 20 })
  LicensePlate: string;

  @Column({ name: 'Model', type: 'nvarchar', length: 120 })
  Model: string;

  @Column({ name: 'Brand', type: 'nvarchar', length: 120 })
  Brand: string;

  @Column({ name: 'Year', type: 'smallint', nullable: true })
  Year: number;

  @Column({ name: 'Mileage', type: 'int' })
  Mileage: number;

  @Column({ name: 'BatteryCapacity', type: 'int', nullable: true })
  BatteryCapacity: number;

  @Column({
    name: 'BatteryLevel',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  BatteryLevel: number;

  @Column({ name: 'ChargingCycles', type: 'int', nullable: true })
  ChargingCycles: number;

  @Column({ name: 'Color', type: 'nvarchar', length: 50, nullable: true })
  Color: string;

  @Column({ name: 'ImageUrl', type: 'nvarchar', length: 255, nullable: true })
  ImageUrl: string;

  @Column({
    name: 'RentalRate',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  RentalRate: number;

  @Column({ name: 'LastServiceDate', type: 'datetime2', nullable: true })
  LastServiceDate: Date;

  @Column({ name: 'Status', type: 'nvarchar', length: 255 })
  Status: VehicleStatus;

  // Relations
  @ManyToOne(() => RentalLocation)
  @JoinColumn({ name: 'RentalLocationID' })
  rentalLocation: RentalLocation;
}
