import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contract } from './contract.entity';
import { PaymentMethod, PaymentStatus, PaymentType } from '@/packages/types/payment/payment-method';

@Entity('Payment')
export class Payment {
  @Column({
    name: 'PaymentID',
    type: 'bigint',
    primary: true,
    generated: 'increment',
  })
  PaymentID: number;

  @Column({ name: 'ContractDatTTID', type: 'uniqueidentifier' })
  ContractDatTTID: string;

  @Column({
    name: 'Amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  Amount: number;

  @Column({
    name: 'Currency',
    type: 'nvarchar',
    length: 3,
    default: 'VND',
  })
  Currency: string;

  @Column({
    name: 'PaymentType',
    type: 'nvarchar',
    length: 50,
  })
  PaymentType: PaymentType;

  @Column({
    name: 'TransactionID',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  TransactionID: string | null;

  @Column({
    name: 'RefundTransactionID',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  RefundTransactionID: string | null;

  @Column({
    name: 'ReceiptUrl',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  ReceiptUrl: string | null;

  @Column({
    name: 'PaymentDate',
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  PaymentDate: Date;

  @Column({
    name: 'PaymentMethod',
    type: 'nvarchar',
    length: 255,
  })
  PaymentMethod: PaymentMethod;

  @Column({
    name: 'Status',
    type: 'nvarchar',
    length: 255,
    default: PaymentStatus.Pending,
  })
  Status: PaymentStatus;

  // Relations
  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'ContractDatTTID' })
  contract: Contract;
}

