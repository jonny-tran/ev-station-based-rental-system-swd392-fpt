import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  VehicleInspection,
  InspectionType,
  InspectionStatus,
} from '../entities/vehicle-inspection.entity';

@Injectable()
export class CheckinSessionRepository {
  constructor(
    @InjectRepository(VehicleInspection)
    private readonly vehicleInspectionRepository: Repository<VehicleInspection>,
  ) {}

  async findExistingCheckinSession(
    bookingId: string,
  ): Promise<VehicleInspection | null> {
    return this.vehicleInspectionRepository
      .createQueryBuilder('inspection')
      .where('inspection.BookingID = :bookingId', { bookingId })
      .andWhere('inspection.InspectionType = :type', {
        type: InspectionType.CheckIn,
      })
      .getOne();
  }

  async createCheckinSession(
    bookingId: string,
    staffId: string,
  ): Promise<VehicleInspection> {
    const inspection = this.vehicleInspectionRepository.create({
      BookingID: bookingId,
      StaffID: staffId,
      InspectionType: InspectionType.CheckIn,
      InspectionDateTime: new Date(),
      CurrentStep: 1,
      Status: InspectionStatus.Pending,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    });

    return this.vehicleInspectionRepository.save(inspection);
  }

  async findCheckinSessionsByStaff(
    staffId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: InspectionStatus,
    search?: string,
  ): Promise<{ sessions: VehicleInspection[]; total: number }> {
    const queryBuilder = this.createCheckinSessionsQueryBuilder(staffId);

    if (status) {
      queryBuilder.andWhere('inspection.Status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(booking.BookingID LIKE :search OR vehicle.Brand LIKE :search OR vehicle.Model LIKE :search OR account.FullName LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await queryBuilder.getCount();

    const sessions = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('inspection.CreatedAt', 'DESC')
      .getMany();

    return { sessions, total };
  }

  async findByIdWithAllRelations(
    inspectionId: number,
  ): Promise<VehicleInspection | null> {
    return this.vehicleInspectionRepository
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.booking', 'booking')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.rentalLocation', 'rentalLocation')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .leftJoinAndSelect('renter.driverLicenses', 'driverLicense')
      .where('inspection.InspectionDatTTID = :inspectionId', { inspectionId })
      .getOne();
  }

  async updateStep1Approval(
    inspectionId: number,
    notes?: string,
  ): Promise<VehicleInspection> {
    const updateData: Partial<VehicleInspection> = {
      CurrentStep: 2,
      UpdatedAt: new Date(),
    };

    if (notes) {
      updateData.VehicleConditionNotes = notes;
    }

    await this.vehicleInspectionRepository.update(
      { InspectionDatTTID: inspectionId },
      updateData,
    );

    const updatedInspection = await this.findByIdWithAllRelations(inspectionId);
    if (!updatedInspection) {
      throw new Error('Failed to retrieve updated inspection');
    }
    return updatedInspection;
  }

  async updateStep1Rejection(
    inspectionId: number,
    reason: string,
  ): Promise<VehicleInspection> {
    const updateData: Partial<VehicleInspection> = {
      Status: InspectionStatus.Rejected,
      RejectedReason: reason,
      CurrentStep: 1,
      UpdatedAt: new Date(),
    };

    await this.vehicleInspectionRepository.update(
      { InspectionDatTTID: inspectionId },
      updateData,
    );

    const updatedInspection = await this.findByIdWithAllRelations(inspectionId);
    if (!updatedInspection) {
      throw new Error('Failed to retrieve updated inspection');
    }
    return updatedInspection;
  }

  private createCheckinSessionsQueryBuilder(
    staffId: string,
  ): SelectQueryBuilder<VehicleInspection> {
    return this.vehicleInspectionRepository
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.booking', 'booking')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.rentalLocation', 'rentalLocation')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .where('inspection.StaffID = :staffId', { staffId })
      .andWhere('inspection.InspectionType = :type', {
        type: InspectionType.CheckIn,
      });
  }
}
