/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { ContractStatus } from '@/packages/types/contract/contract-status';
import { ContractListQueryDto } from '../dto/contract-list.dto';

@Injectable()
export class ContractRepository {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async findById(contractId: string): Promise<Contract | null> {
    return this.contractRepository.findOne({
      where: { ContractDatTTID: contractId },
      relations: ['booking', 'createdByStaff'],
    });
  }

  async findByIdWithDetails(contractId: string): Promise<Contract | null> {
    return this.contractRepository.findOne({
      where: { ContractDatTTID: contractId },
      relations: [
        'booking',
        'booking.renter',
        'booking.renter.account',
        'booking.vehicle',
        'createdByStaff',
      ],
    });
  }

  async findByBookingId(bookingId: string): Promise<Contract | null> {
    return this.contractRepository.findOne({
      where: { BookingID: bookingId },
      relations: ['booking', 'createdByStaff'],
    });
  }

  async findByStaffId(
    staffId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: ContractStatus,
  ): Promise<{ contracts: Contract[]; total: number }> {
    const queryBuilder = this.createContractsQueryBuilder(staffId);

    if (status) {
      queryBuilder.andWhere('contract.Status = :status', { status });
    }

    const total = await queryBuilder.getCount();

    const contracts = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('contract.CreatedAt', 'DESC')
      .getMany();

    return { contracts, total };
  }

  async create(contractData: Partial<Contract>): Promise<Contract> {
    const contract = this.contractRepository.create(contractData);
    return this.contractRepository.save(contract);
  }

  async update(
    contractId: string,
    updateData: Partial<Contract>,
  ): Promise<Contract> {
    await this.contractRepository.update(
      { ContractDatTTID: contractId },
      updateData,
    );

    const updatedContract = await this.findById(contractId);
    if (!updatedContract) {
      throw new Error('Failed to retrieve updated contract');
    }
    return updatedContract;
  }

  async updateStatus(
    contractId: string,
    status: ContractStatus,
    statusReason?: string,
  ): Promise<Contract> {
    const updateData: Partial<Contract> = {
      Status: status,
      UpdatedAt: new Date(),
    };

    if (statusReason) {
      updateData.StatusReason = statusReason;
    }

    return this.update(contractId, updateData);
  }

  async signContract(
    contractId: string,
    signedByRenter: boolean = false,
    signedByStaff: boolean = false,
  ): Promise<Contract> {
    const updateData: Partial<Contract> = {
      SignedByRenter: signedByRenter,
      SignedByStaff: signedByStaff,
      SignedAt: new Date(),
      UpdatedAt: new Date(),
    };

    // If both parties have signed, mark as Active
    if (signedByRenter && signedByStaff) {
      updateData.Status = ContractStatus.Active;
    }

    return this.update(contractId, updateData);
  }

  async voidContract(contractId: string, reason: string): Promise<Contract> {
    const updateData: Partial<Contract> = {
      Status: ContractStatus.Voided,
      StatusReason: reason,
      VoidedAt: new Date(),
      UpdatedAt: new Date(),
    };

    return this.update(contractId, updateData);
  }

  async updateRenterInfo(
    contractId: string,
    renterInfo: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
    },
  ): Promise<Contract> {
    // Since the Contract entity doesn't have separate renter info fields,
    // we'll just update the timestamp. The renter info is stored in the related booking/account.
    const updateData: Partial<Contract> = {
      UpdatedAt: new Date(),
    };

    return this.update(contractId, updateData);
  }

  async updateStaffSignature(contractId: string): Promise<Contract> {
    const updateData: Partial<Contract> = {
      SignedByStaff: true,
      SignedAt: new Date(),
      UpdatedAt: new Date(),
    };

    return this.update(contractId, updateData);
  }

  async updateRenterSignature(contractId: string): Promise<Contract> {
    const updateData: Partial<Contract> = {
      SignedByRenter: true,
      SignedAt: new Date(),
      UpdatedAt: new Date(),
    };

    return this.update(contractId, updateData);
  }

  async completeContract(contractId: string): Promise<Contract> {
    const updateData: Partial<Contract> = {
      Status: ContractStatus.Completed,
      UpdatedAt: new Date(),
    };

    return this.update(contractId, updateData);
  }

  async findContractsByStaffId(
    staffId: string,
    queryDto: ContractListQueryDto,
  ): Promise<{ contracts: Contract[]; total: number }> {
    const page = queryDto.page || 1;
    const pageSize = queryDto.pageSize || 10;

    const queryBuilder = this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.booking', 'booking')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('contract.createdByStaff', 'staff')
      .where('contract.CreatedByStaffID = :staffId', { staffId });

    if (queryDto.status) {
      queryBuilder.andWhere('contract.Status = :status', {
        status: queryDto.status,
      });
    }

    const total = await queryBuilder.getCount();

    const contracts = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('contract.CreatedAt', 'DESC')
      .getMany();

    return { contracts, total };
  }

  async findContractsByRenterId(
    renterId: string,
    queryDto: ContractListQueryDto,
  ): Promise<{ contracts: Contract[]; total: number }> {
    const page = queryDto.page || 1;
    const pageSize = queryDto.pageSize || 10;

    const queryBuilder = this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.booking', 'booking')
      .leftJoinAndSelect('booking.renter', 'renter')
      .leftJoinAndSelect('renter.account', 'account')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('contract.createdByStaff', 'staff')
      .leftJoin('booking.renter', 'renterFilter')
      .where('renterFilter.AccountID = :renterId', { renterId });

    if (queryDto.status) {
      queryBuilder.andWhere('contract.Status = :status', {
        status: queryDto.status,
      });
    }

    const total = await queryBuilder.getCount();

    const contracts = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('contract.CreatedAt', 'DESC')
      .getMany();

    return { contracts, total };
  }

  private createContractsQueryBuilder(
    staffId: string,
  ): SelectQueryBuilder<Contract> {
    return this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.booking', 'booking')
      .leftJoinAndSelect('contract.createdByStaff', 'staff')
      .where('contract.CreatedByStaffID = :staffId', { staffId });
  }
}
