import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account.entity';
import { RentalLocation } from './rentalLocation.entity';

@Entity('Staff')
export class Staff {
  @Column({ name: 'StaffID', type: 'uniqueidentifier', primary: true })
  StaffID: string;

  @Column({ name: 'AccountID', type: 'uniqueidentifier' })
  AccountID: string;

  @Column({ name: 'RentalLocationID', type: 'uniqueidentifier' })
  RentalLocationID: string;

  // Relations
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'AccountID' })
  account: Account;

  @ManyToOne(() => RentalLocation)
  @JoinColumn({ name: 'RentalLocationID' })
  rentalLocation: RentalLocation;
}
