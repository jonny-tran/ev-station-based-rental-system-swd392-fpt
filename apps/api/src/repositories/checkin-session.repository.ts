import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, DataSource } from 'typeorm';
import {
  VehicleInspection,
  InspectionType,
  InspectionStatus,
} from '../entities/vehicle-inspection.entity';
import { Contract, ContractStatus } from '../entities/contract.entity';
import { UpdateVehicleDataDto } from '../dto/step2-vehicle-data.dto';

@Injectable()
export class CheckinSessionRepository {
  constructor(
    @InjectRepository(VehicleInspection)
    private readonly vehicleInspectionRepository: Repository<VehicleInspection>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly dataSource: DataSource,
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

  async updatePhotoUrls(
    inspectionId: number,
    photoUrls: string,
  ): Promise<VehicleInspection> {
    const updateData: Partial<VehicleInspection> = {
      PhotoUrls: photoUrls,
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

  async updateVehicleDataAndCreateContract(
    inspectionId: number,
    updateDto: UpdateVehicleDataDto,
  ): Promise<{ inspection: VehicleInspection; contract: Contract }> {
    return this.dataSource.transaction(async (manager) => {
      // Get inspection with booking details
      const inspection = await manager.findOne(VehicleInspection, {
        where: { InspectionDatTTID: inspectionId },
        relations: ['booking'],
      });

      if (!inspection) {
        throw new Error('Inspection not found');
      }

      if (!inspection.booking) {
        throw new Error('Inspection booking not found');
      }

      // Update inspection data
      const updateData: Partial<VehicleInspection> = {
        OdometerReading: updateDto.odometerKm,
        BatteryLevel: updateDto.batteryLevel,
        VehicleConditionNotes: updateDto.vehicleConditionNotes,
        DamageNotes: updateDto.damageNotes,
        CurrentStep: 3,
        UpdatedAt: new Date(),
      };

      await manager.update(
        VehicleInspection,
        { InspectionDatTTID: inspectionId },
        updateData,
      );

      // Create contract
      const contract = manager.create(Contract, {
        BookingID: inspection.BookingID,
        CreatedByStaffID: inspection.StaffID, // Link to staff who created the contract
        TermsAndConditions: 'Standard rental terms and conditions apply.',
        StartDate: new Date(),
        EndDate: inspection.booking.EndTime,
        Status: ContractStatus.Draft,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      });

      const savedContract = await manager.save(Contract, contract);

      // Get updated inspection with minimal relations (avoid timeout)
      const updatedInspection = await manager.findOne(VehicleInspection, {
        where: { InspectionDatTTID: inspectionId },
        relations: ['booking'], // Only load booking relation
      });

      if (!updatedInspection) {
        throw new Error('Failed to retrieve updated inspection');
      }

      return { inspection: updatedInspection, contract: savedContract };
    });
  }

  async updateStep2Rejection(
    inspectionId: number,
    reason: string,
  ): Promise<VehicleInspection> {
    const updateData: Partial<VehicleInspection> = {
      Status: InspectionStatus.Rejected,
      RejectedReason: reason,
      CurrentStep: 2,
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

  async updateStep3Approval(inspectionId: number): Promise<VehicleInspection> {
    const updateData: Partial<VehicleInspection> = {
      CurrentStep: 4,
      SubStatus: 'WaitingPayment',
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

  async updateStep3Rejection(
    inspectionId: number,
    reason: string,
  ): Promise<VehicleInspection> {
    const updateData: Partial<VehicleInspection> = {
      Status: InspectionStatus.Rejected,
      RejectedReason: reason,
      SubStatus: 'ContractVoided',
      CurrentStep: 3,
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

  async findByBookingId(bookingId: string): Promise<VehicleInspection | null> {
    return this.vehicleInspectionRepository.findOne({
      where: { BookingID: bookingId },
      relations: ['booking'],
    });
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
