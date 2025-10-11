import { Entity, Column } from 'typeorm';

export enum AccountRole {
  Admin = 'Admin',
  Staff = 'Staff',
  Renter = 'Renter',
}

export enum AccountStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Locked = 'Locked',
  Pending = 'Pending',
}

@Entity('Account')
export class Account {
  [x: string]: any;
  @Column({ name: 'AccountID', type: 'uniqueidentifier', primary: true })
  accountId: string;

  @Column({ name: 'Email', type: 'nvarchar', length: 255 })
  email: string;

  @Column({ name: 'PasswordHash', type: 'nvarchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'PhoneNumber', type: 'nvarchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'FullName', type: 'nvarchar', length: 120 })
  fullName: string;

  @Column({ name: 'AvatarUrl', type: 'nvarchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ name: 'Role', type: 'nvarchar', length: 255 })
  role: string;

  @Column({ name: 'Status', type: 'nvarchar', length: 255 })
  status: string;

  @Column({ name: 'CreatedAt', type: 'datetime2' })
  createdAt: Date;

  @Column({ name: 'UpdatedAt', type: 'datetime2' })
  updatedAt: Date;
}
