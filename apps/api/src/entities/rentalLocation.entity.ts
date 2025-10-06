import { Entity, Column } from 'typeorm';

@Entity('RentalLocation')
export class RentalLocation {
  @Column({ name: 'RentalLocationID', type: 'uniqueidentifier', primary: true })
  RentalLocationID: string;

  @Column({ name: 'Name', type: 'nvarchar', length: 120 })
  Name: string;

  @Column({ name: 'Address', type: 'nvarchar', length: 255 })
  Address: string;

  @Column({ name: 'City', type: 'nvarchar', length: 80 })
  City: string;

  @Column({ name: 'Country', type: 'nvarchar', length: 80 })
  Country: string;

  @Column({
    name: 'ContactNumber',
    type: 'nvarchar',
    length: 20,
    nullable: true,
  })
  ContactNumber: string;

  @Column({
    name: 'OpeningHours',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  OpeningHours: string;

  @Column({
    name: 'ClosingHours',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  ClosingHours: string;

  @Column({
    name: 'Latitude',
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  Latitude: number;

  @Column({
    name: 'Longitude',
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  Longitude: number;
}
