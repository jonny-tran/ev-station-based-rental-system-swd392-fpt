import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async findAllByRenter(renterId: string): Promise<Booking[]> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.rentalLocation', 'rentalLocation')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .where('booking.RenterID = :renterId', { renterId })
      .getMany();
  }

  async findByIdAndRenter(
    bookingId: string,
    renterId: string,
  ): Promise<Booking | null> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.rentalLocation', 'rentalLocation')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .where('booking.BookingID = :bookingId', { bookingId })
      .andWhere('booking.RenterID = :renterId', { renterId })
      .getOne();
  }

  async findByIdForQRValidation(bookingId: string): Promise<Booking | null> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.rentalLocation', 'rentalLocation')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .where('booking.BookingID = :bookingId', { bookingId })
      .getOne();
  }

  async findById(bookingId: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      where: { BookingID: bookingId },
    });
  }
}
