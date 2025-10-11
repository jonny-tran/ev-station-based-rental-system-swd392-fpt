import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ContractService } from '../src/services/contract.service';
import { ContractRepository } from '../src/repositories/contract.repository';
import { CheckinSessionRepository } from '../src/repositories/checkin-session.repository';
import { Contract, ContractStatus } from '../src/entities/contract.entity';
import { VehicleInspection } from '../src/entities/vehicle-inspection.entity';
import { Booking } from '../src/entities/booking.entity';
import { Vehicle } from '../src/entities/vehicle.entity';
import { Renter } from '../src/entities/renter.entity';
import { Account } from '../src/entities/account.entity';
import { ContractListQueryDto } from '../src/dto/contract-list.dto';

describe('ContractService', () => {
  let service: ContractService;
  let contractRepository: jest.Mocked<ContractRepository>;
  let checkinSessionRepository: jest.Mocked<CheckinSessionRepository>;

  const mockContract: Contract = {
    ContractDatTTID: 'contract-123',
    BookingID: 'booking-123',
    TermsAndConditions: 'Test terms',
    StartDate: new Date('2024-01-01'),
    EndDate: new Date('2024-01-02'),
    SignedAt: null,
    SignedByRenter: false,
    SignedByStaff: false,
    ContractPdfUrl: null,
    VoidedAt: null,
    CreatedAt: new Date('2024-01-01'),
    UpdatedAt: new Date('2024-01-01'),
    Status: ContractStatus.Draft,
    StatusReason: null,
    booking: {
      BookingID: 'booking-123',
      RenterID: 'renter-123',
      VehicleID: 'vehicle-123',
      StartTime: new Date('2024-01-01'),
      EndTime: new Date('2024-01-02'),
      DepositAmount: 100,
      Status: 'Confirmed',
      CreatedAt: new Date('2024-01-01'),
      CancelledAt: null,
      vehicle: {
        VehicleID: 'vehicle-123',
        RentalLocationID: 'location-123',
        LicensePlate: '51A-12345',
        Model: 'Model 3',
        Brand: 'Tesla',
        Year: 2023,
        Mileage: 10000,
        BatteryCapacity: 75,
        BatteryLevel: 80.5,
        ChargingCycles: 50,
        Color: 'White',
        ImageUrl: null,
        RentalRate: 500000,
        LastServiceDate: null,
        Status: 'Available',
        rentalLocation: null,
      } as Vehicle,
      renter: {
        RenterID: 'renter-123',
        AccountID: 'account-123',
        Address: '123 Test St',
        DateOfBirth: new Date('1990-01-01'),
        IdentityNumber: '123456789',
        FrontIdentityImageUrl: null,
        BackIdentityImageUrl: null,
        account: {
          AccountID: 'account-123',
          Email: 'test@example.com',
          PasswordHash: 'hash',
          PhoneNumber: '0901234567',
          FullName: 'Test User',
          AvatarUrl: null,
          Role: 'Renter',
          Status: 'Active',
          CreatedAt: new Date('2024-01-01'),
          UpdatedAt: new Date('2024-01-01'),
        } as Account,
        bookings: [],
        driverLicenses: [],
      } as Renter,
    } as Booking,
  };

  const mockInspection: VehicleInspection = {
    InspectionDatTTID: 1,
    StaffID: 'staff-123',
    BookingID: 'booking-123',
    InspectionType: 'check_in' as any,
    InspectionDateTime: new Date('2024-01-01'),
    VehicleConditionNotes: null,
    OdometerReading: null,
    BatteryLevel: null,
    DamageNotes: null,
    PhotoUrls: null,
    CurrentStep: 3,
    CreatedAt: new Date('2024-01-01'),
    UpdatedAt: new Date('2024-01-01'),
    Status: 'Pending' as any,
    SubStatus: null,
    RejectedReason: null,
    booking: null,
  };

  beforeEach(async () => {
    const mockContractRepository = {
      findById: jest.fn(),
      findByIdWithDetails: jest.fn(),
      findByBookingId: jest.fn(),
      updateStatus: jest.fn(),
      updateRenterSignature: jest.fn(),
      updateStaffSignature: jest.fn(),
      completeContract: jest.fn(),
      updateRenterInfo: jest.fn(),
      save: jest.fn(),
      findContractsByStaffId: jest.fn(),
      findContractsByRenterId: jest.fn(),
      createContractsQueryBuilder: jest.fn(),
      applyFiltersAndPagination: jest.fn(),
    };

    const mockCheckinSessionRepository = {
      findByBookingId: jest.fn(),
      updateStep3Rejection: jest.fn(),
      findByIdWithAllRelations: jest.fn(),
      updateStep3Approval: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: ContractRepository,
          useValue: mockContractRepository,
        },
        {
          provide: CheckinSessionRepository,
          useValue: mockCheckinSessionRepository,
        },
      ],
    }).compile();

    service = module.get<ContractService>(ContractService);
    contractRepository = module.get(ContractRepository);
    checkinSessionRepository = module.get(CheckinSessionRepository);
  });

  describe('getContractDetails', () => {
    it('should return contract details for staff', async () => {
      contractRepository.findByIdWithDetails.mockResolvedValue(mockContract);
      checkinSessionRepository.findByBookingId.mockResolvedValue(
        mockInspection,
      );

      const result = await service.getContractDetails(
        'contract-123',
        'staff-123',
        'Staff',
      );

      expect(result).toEqual({
        contractId: 'contract-123',
        bookingId: 'booking-123',
        status: ContractStatus.Draft,
        termsAndConditions: 'Test terms',
        startDate: mockContract.StartDate,
        endDate: mockContract.EndDate,
        signedByRenter: false,
        signedByStaff: false,
        signedAt: null,
        renter: {
          renterId: 'renter-123',
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '0901234567',
        },
        vehicle: {
          vehicleId: 'vehicle-123',
          brand: 'Tesla',
          model: 'Model 3',
          licensePlate: '51A-12345',
          year: 2023,
          color: 'White',
        },
        createdAt: mockContract.CreatedAt,
        updatedAt: mockContract.UpdatedAt,
      });
    });

    it('should throw NotFoundException when contract not found', async () => {
      contractRepository.findByIdWithDetails.mockResolvedValue(null);

      await expect(
        service.getContractDetails('contract-123', 'staff-123', 'Staff'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when staff has no access', async () => {
      contractRepository.findByIdWithDetails.mockResolvedValue(mockContract);
      checkinSessionRepository.findByBookingId.mockResolvedValue(null);

      await expect(
        service.getContractDetails('contract-123', 'other-staff-123', 'Staff'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('submitContractForSigning', () => {
    it('should submit contract for signing', async () => {
      contractRepository.findById.mockResolvedValue(mockContract);
      checkinSessionRepository.findByBookingId.mockResolvedValue(
        mockInspection,
      );
      contractRepository.updateStatus.mockResolvedValue();
      contractRepository.updateRenterInfo.mockResolvedValue();
      contractRepository.findById
        .mockResolvedValueOnce(mockContract)
        .mockResolvedValueOnce({
          ...mockContract,
          Status: ContractStatus.Active,
          UpdatedAt: new Date('2024-01-01T10:00:00'),
        });

      const result = await service.submitContractForSigning(
        'contract-123',
        'staff-123',
        'Staff',
        { renterInfo: { fullName: 'Updated Name' } },
      );

      expect(contractRepository.updateStatus).toHaveBeenCalledWith(
        'contract-123',
        ContractStatus.Active,
      );
      expect(contractRepository.updateRenterInfo).toHaveBeenCalledWith(
        'contract-123',
        {
          fullName: 'Updated Name',
        },
      );
      expect(result.status).toBe(ContractStatus.Active);
    });

    it('should throw ForbiddenException when user is not staff', async () => {
      await expect(
        service.submitContractForSigning(
          'contract-123',
          'user-123',
          'Renter',
          {},
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when contract is not in Draft status', async () => {
      const activeContract = { ...mockContract, Status: ContractStatus.Active };
      contractRepository.findById.mockResolvedValue(activeContract);

      await expect(
        service.submitContractForSigning(
          'contract-123',
          'staff-123',
          'Staff',
          {},
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('staffSignContract', () => {
    it('should sign contract as staff', async () => {
      const activeContract = {
        ...mockContract,
        Status: ContractStatus.Active,
        SignedByRenter: true,
      };
      contractRepository.findById.mockResolvedValue(activeContract);
      checkinSessionRepository.findByBookingId.mockResolvedValue(
        mockInspection,
      );
      contractRepository.updateStaffSignature.mockResolvedValue();
      contractRepository.completeContract.mockResolvedValue();
      contractRepository.findById
        .mockResolvedValueOnce(activeContract)
        .mockResolvedValueOnce({
          ...activeContract,
          SignedByStaff: true,
          Status: ContractStatus.Completed,
          SignedAt: new Date('2024-01-01T10:00:00'),
        });

      const result = await service.staffSignContract(
        'contract-123',
        'staff-123',
        'Staff',
        { signatureData: 'base64signature' },
      );

      expect(contractRepository.updateStaffSignature).toHaveBeenCalledWith(
        'contract-123',
      );
      expect(contractRepository.completeContract).toHaveBeenCalledWith(
        'contract-123',
      );
      expect(result.signedByStaff).toBe(true);
      expect(result.status).toBe(ContractStatus.Completed);
    });

    it('should throw BadRequestException when renter has not signed', async () => {
      const activeContract = {
        ...mockContract,
        Status: ContractStatus.Active,
        SignedByRenter: false,
      };
      contractRepository.findById.mockResolvedValue(activeContract);
      checkinSessionRepository.findByBookingId.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.staffSignContract('contract-123', 'staff-123', 'Staff', {
          signatureData: 'base64signature',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('renterSignContract', () => {
    it('should sign contract as renter', async () => {
      const activeContract = { ...mockContract, Status: ContractStatus.Active };
      contractRepository.findByIdWithDetails.mockResolvedValue(activeContract);
      contractRepository.updateRenterSignature.mockResolvedValue();
      contractRepository.findById
        .mockResolvedValueOnce(activeContract)
        .mockResolvedValueOnce({
          ...activeContract,
          SignedByRenter: true,
        });

      const result = await service.renterSignContract(
        'contract-123',
        'account-123',
        'Renter',
        { signatureData: 'base64signature' },
      );

      expect(contractRepository.updateRenterSignature).toHaveBeenCalledWith(
        'contract-123',
      );
      expect(result.signedByRenter).toBe(true);
    });

    it('should throw ForbiddenException when renter is not authorized', async () => {
      const activeContract = { ...mockContract, Status: ContractStatus.Active };
      contractRepository.findByIdWithDetails.mockResolvedValue(activeContract);

      await expect(
        service.renterSignContract(
          'contract-123',
          'other-account-123',
          'Renter',
          { signatureData: 'base64signature' },
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('rejectContract', () => {
    it('should reject contract', async () => {
      contractRepository.findById.mockResolvedValue(mockContract);
      checkinSessionRepository.findByBookingId.mockResolvedValue(
        mockInspection,
      );
      contractRepository.updateStatus.mockResolvedValue();
      checkinSessionRepository.updateStep3Rejection.mockResolvedValue(
        mockInspection,
      );
      contractRepository.findById
        .mockResolvedValueOnce(mockContract)
        .mockResolvedValueOnce({
          ...mockContract,
          Status: ContractStatus.Voided,
          StatusReason: 'Test reason',
          VoidedAt: new Date('2024-01-01T10:00:00'),
        });

      const result = await service.rejectContract(
        'contract-123',
        'staff-123',
        'Staff',
        { reason: 'Test reason' },
      );

      expect(contractRepository.updateStatus).toHaveBeenCalledWith(
        'contract-123',
        ContractStatus.Voided,
        'Test reason',
      );
      expect(
        checkinSessionRepository.updateStep3Rejection,
      ).toHaveBeenCalledWith(1, 'Test reason');
      expect(result.status).toBe(ContractStatus.Voided);
      expect(result.statusReason).toBe('Test reason');
    });
  });

  describe('approveStep3', () => {
    it('should approve step 3', async () => {
      const completedContract = {
        ...mockContract,
        Status: ContractStatus.Completed,
      };
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );
      contractRepository.findByBookingId.mockResolvedValue(completedContract);
      checkinSessionRepository.updateStep3Approval.mockResolvedValue({
        ...mockInspection,
        CurrentStep: 4,
        SubStatus: 'WaitingPayment',
      });

      const result = await service.approveStep3(1, 'staff-123', 'Staff');

      expect(checkinSessionRepository.updateStep3Approval).toHaveBeenCalledWith(
        1,
      );
      expect(result.CurrentStep).toBe(4);
      expect(result.SubStatus).toBe('WaitingPayment');
    });

    it('should throw BadRequestException when contract is not completed', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );
      contractRepository.findByBookingId.mockResolvedValue(mockContract);

      await expect(
        service.approveStep3(1, 'staff-123', 'Staff'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getContractsByStaffId', () => {
    const mockQueryDto: ContractListQueryDto = {
      page: 1,
      pageSize: 10,
    };

    it('should return contracts for staff', async () => {
      const mockContracts = [mockContract];
      contractRepository.findContractsByStaffId.mockResolvedValue({
        contracts: mockContracts,
        total: 1,
      });

      const result = await service.getContractsByStaffId(
        'staff-123',
        'Staff',
        mockQueryDto,
      );

      expect(contractRepository.findContractsByStaffId).toHaveBeenCalledWith(
        'staff-123',
        mockQueryDto,
      );
      expect(result.contracts).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should throw ForbiddenException when user is not staff', async () => {
      await expect(
        service.getContractsByStaffId('staff-123', 'Renter', mockQueryDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getContractsByRenterId', () => {
    const mockQueryDto: ContractListQueryDto = {
      page: 1,
      pageSize: 10,
    };

    it('should return contracts for renter', async () => {
      const mockContracts = [mockContract];
      contractRepository.findContractsByRenterId.mockResolvedValue({
        contracts: mockContracts,
        total: 1,
      });

      const result = await service.getContractsByRenterId(
        'renter-123',
        'Renter',
        mockQueryDto,
      );

      expect(contractRepository.findContractsByRenterId).toHaveBeenCalledWith(
        'renter-123',
        mockQueryDto,
      );
      expect(result.contracts).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should throw ForbiddenException when user is not renter', async () => {
      await expect(
        service.getContractsByRenterId('renter-123', 'Staff', mockQueryDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
