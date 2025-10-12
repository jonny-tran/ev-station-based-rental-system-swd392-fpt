/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ContractRepository } from '../repositories/contract.repository';
import { CheckinSessionRepository } from '../repositories/checkin-session.repository';
import { Contract } from '../entities/contract.entity';
import { ContractStatus } from '@/packages/types/contract/contract-status';
import { VehicleInspection } from '../entities/vehicle-inspection.entity';
import { ContractDetailsResponseDto } from '../dto/contract-details-response.dto';
import { SubmitContractDto } from '../dto/submit-contract.dto';
import { SignContractDto } from '../dto/sign-contract.dto';
import { RejectContractDto } from '../dto/reject-contract.dto';
import { ContractResponseDto } from '../dto/contract-response.dto';
import { ContractListQueryDto } from '../dto/contract-list.dto';
import {
  ContractListResponseDto,
  ContractListItemDto,
} from '../dto/contract-list-response.dto';

@Injectable()
export class ContractService {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly checkinSessionRepository: CheckinSessionRepository,
  ) {}

  async getContractDetails(
    contractId: string,
    userId: string,
    userRole: string,
  ): Promise<ContractDetailsResponseDto> {
    const contract =
      await this.contractRepository.findByIdWithDetails(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Authorization check
    await this.validateContractAccess(contract, userId, userRole);

    return {
      contractId: contract.ContractDatTTID,
      bookingId: contract.BookingID,
      status: contract.Status,
      termsAndConditions: contract.TermsAndConditions,
      startDate: contract.StartDate,
      endDate: contract.EndDate,
      signedByRenter: contract.SignedByRenter,
      signedByStaff: contract.SignedByStaff,
      signedAt: contract.SignedAt,
      renter: {
        renterId: contract.booking.renter.RenterID,
        fullName: contract.booking.renter.account.FullName,
        email: contract.booking.renter.account.Email,
        phoneNumber: contract.booking.renter.account.PhoneNumber,
      },
      vehicle: {
        vehicleId: contract.booking.vehicle.VehicleID,
        brand: contract.booking.vehicle.Brand,
        model: contract.booking.vehicle.Model,
        licensePlate: contract.booking.vehicle.LicensePlate,
        year: contract.booking.vehicle.Year,
        color: contract.booking.vehicle.Color,
      },
      createdAt: contract.CreatedAt,
      updatedAt: contract.UpdatedAt,
    };
  }

  async submitContractForSigning(
    contractId: string,
    userId: string,
    userRole: string,
    submitDto: SubmitContractDto,
  ): Promise<ContractResponseDto> {
    // Authorization check - only staff can submit
    if (userRole !== 'Staff') {
      throw new ForbiddenException(
        'Only staff can submit contracts for signing',
      );
    }

    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Validate contract status
    if (contract.Status !== ContractStatus.Draft) {
      throw new BadRequestException(
        'Contract must be in Draft status to be submitted',
      );
    }

    // Validate staff has access to this contract
    await this.validateStaffAccess(contract.BookingID, userId);

    // Update contract status to Active
    await this.contractRepository.updateStatus(
      contractId,
      ContractStatus.Active,
    );

    // Update renter info if provided
    if (submitDto.renterInfo) {
      await this.contractRepository.updateRenterInfo(
        contractId,
        submitDto.renterInfo,
      );
    }

    // TODO: Send notification to renter
    // await this.notificationService.sendContractSigningNotification(contract.BookingID);

    const updatedContract = await this.contractRepository.findById(contractId);
    return this.mapToContractResponse(updatedContract!);
  }

  async staffSignContract(
    contractId: string,
    userId: string,
    userRole: string,
    signDto: SignContractDto,
  ): Promise<ContractResponseDto> {
    // Authorization check - only staff can sign
    if (userRole !== 'Staff') {
      throw new ForbiddenException('Only staff can sign contracts');
    }

    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Validate contract status
    if (contract.Status !== ContractStatus.Active) {
      throw new BadRequestException(
        'Contract must be in Active status to be signed',
      );
    }

    // Validate staff has access to this contract
    await this.validateStaffAccess(contract.BookingID, userId);

    // Check if renter has already signed
    if (!contract.SignedByRenter) {
      throw new BadRequestException('Renter must sign before staff can sign');
    }

    // Update staff signature
    await this.contractRepository.updateStaffSignature(contractId);

    // Complete contract if both parties have signed
    await this.contractRepository.completeContract(contractId);

    // TODO: Store signature data (base64 image)
    // await this.signatureService.storeSignature(contractId, 'staff', signDto.signatureData);

    const updatedContract = await this.contractRepository.findById(contractId);
    return this.mapToContractResponse(updatedContract!);
  }

  async renterSignContract(
    contractId: string,
    userId: string,
    userRole: string,
    signDto: SignContractDto,
  ): Promise<ContractResponseDto> {
    // Authorization check - only renter can sign
    if (userRole !== 'Renter') {
      throw new ForbiddenException('Only renter can sign contracts');
    }

    const contract =
      await this.contractRepository.findByIdWithDetails(contractId);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Validate contract status
    if (contract.Status !== ContractStatus.Active) {
      throw new BadRequestException(
        'Contract must be in Active status to be signed',
      );
    }

    // Validate renter has access to this contract
    if (contract.booking.renter.AccountID !== userId) {
      throw new ForbiddenException('You can only sign your own contracts');
    }

    // Update renter signature
    await this.contractRepository.updateRenterSignature(contractId);

    // TODO: Store signature data (base64 image)
    // await this.signatureService.storeSignature(contractId, 'renter', signDto.signatureData);

    const updatedContract = await this.contractRepository.findById(contractId);
    return this.mapToContractResponse(updatedContract!);
  }

  async rejectContract(
    contractId: string,
    userId: string,
    userRole: string,
    rejectDto: RejectContractDto,
  ): Promise<ContractResponseDto> {
    // Authorization check - only staff can reject
    if (userRole !== 'Staff') {
      throw new ForbiddenException('Only staff can reject contracts');
    }

    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Validate staff has access to this contract
    await this.validateStaffAccess(contract.BookingID, userId);

    // Update contract status to Voided
    await this.contractRepository.updateStatus(
      contractId,
      ContractStatus.Voided,
      rejectDto.reason,
    );

    // Update related vehicle inspection
    const inspection = await this.checkinSessionRepository.findByBookingId(
      contract.BookingID,
    );
    if (inspection) {
      await this.checkinSessionRepository.updateStep3Rejection(
        inspection.InspectionDatTTID,
        rejectDto.reason,
      );
    }

    const updatedContract = await this.contractRepository.findById(contractId);
    return this.mapToContractResponse(updatedContract!);
  }

  private async validateContractAccess(
    contract: Contract,
    userId: string,
    userRole: string,
  ): Promise<void> {
    if (userRole === 'Staff') {
      // Staff vẫn cần kiểm tra ownership - chỉ staff tạo ra contract mới được xem
      await this.validateStaffAccess(contract.BookingID, userId);
    } else if (userRole === 'Renter') {
      // For renter, check if they own the booking
      if (contract.booking && contract.booking.renter.AccountID !== userId) {
        throw new ForbiddenException('You can only access your own contracts');
      }
    } else {
      throw new ForbiddenException(
        'Access denied. Only Staff and Renter roles are allowed',
      );
    }
  }

  private async validateStaffAccess(
    bookingId: string,
    staffId: string,
  ): Promise<void> {
    const inspection =
      await this.checkinSessionRepository.findByBookingId(bookingId);
    if (!inspection) {
      throw new ForbiddenException('No inspection found for this booking');
    }

    // Check if the staff ID matches the inspection staff ID
    if (inspection.StaffID !== staffId) {
      throw new ForbiddenException('You do not have access to this contract');
    }
  }

  async getContractsByStaffId(
    staffId: string,
    userRole: string,
    queryDto: ContractListQueryDto,
  ): Promise<ContractListResponseDto> {
    // Authorization check - only staff can access
    if (userRole !== 'Staff') {
      throw new ForbiddenException('Only staff can access staff contracts');
    }

    const { contracts, total } =
      await this.contractRepository.findContractsByStaffId(staffId, queryDto);

    return this.mapToContractListResponse(contracts, total, queryDto);
  }

  async getContractsByRenterId(
    renterId: string,
    userRole: string,
    queryDto: ContractListQueryDto,
  ): Promise<ContractListResponseDto> {
    // Authorization check - only renter can access
    if (userRole !== 'Renter') {
      throw new ForbiddenException('Only renter can access renter contracts');
    }

    const { contracts, total } =
      await this.contractRepository.findContractsByRenterId(renterId, queryDto);

    return this.mapToContractListResponse(contracts, total, queryDto);
  }

  private mapToContractResponse(contract: Contract): ContractResponseDto {
    return {
      contractId: contract.ContractDatTTID,
      status: contract.Status,
      signedByRenter: contract.SignedByRenter,
      signedByStaff: contract.SignedByStaff,
      signedAt: contract.SignedAt,
      updatedAt: contract.UpdatedAt,
      statusReason: contract.StatusReason,
    };
  }

  private mapToContractListResponse(
    contracts: Contract[],
    total: number,
    queryDto: ContractListQueryDto,
  ): ContractListResponseDto {
    const contractItems: ContractListItemDto[] = contracts.map((contract) => ({
      contractId: contract.ContractDatTTID,
      bookingId: contract.BookingID,
      status: contract.Status,
      startDate: contract.StartDate,
      endDate: contract.EndDate,
      signedByRenter: contract.SignedByRenter,
      signedByStaff: contract.SignedByStaff,
      signedAt: contract.SignedAt,
      renterName: contract.booking?.renter?.account?.FullName || '',
      renterEmail: contract.booking?.renter?.account?.Email || '',
      vehicleBrand: contract.booking?.vehicle?.Brand || '',
      vehicleModel: contract.booking?.vehicle?.Model || '',
      vehicleLicensePlate: contract.booking?.vehicle?.LicensePlate || '',
      createdAt: contract.CreatedAt,
      updatedAt: contract.UpdatedAt,
    }));

    const page = queryDto.page || 1;
    const pageSize = queryDto.pageSize || 10;
    const totalPages = Math.ceil(total / pageSize);

    return {
      contracts: contractItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
