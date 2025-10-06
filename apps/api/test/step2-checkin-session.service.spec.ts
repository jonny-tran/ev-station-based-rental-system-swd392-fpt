import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CheckinSessionService } from '../src/services/checkin-session.service';
import { CheckinSessionRepository } from '../src/repositories/checkin-session.repository';
// Mock CloudinaryService
class MockCloudinaryService {
  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    return files.map(() => 'https://res.cloudinary.com/test/image.jpg');
  }
}
import {
  VehicleInspection,
  InspectionStatus,
} from '../src/entities/vehicle-inspection.entity';
import { Contract, ContractStatus } from '../src/entities/contract.entity';
import { UpdateVehicleDataDto } from '../src/dto/step2-vehicle-data.dto';
import { Step2RejectDto } from '../src/dto/step2-reject.dto';

describe('CheckinSessionService - Step 2', () => {
  let service: CheckinSessionService;
  let checkinSessionRepository: jest.Mocked<CheckinSessionRepository>;
  let cloudinaryService: jest.Mocked<MockCloudinaryService>;

  const mockInspection: VehicleInspection = {
    InspectionDatTTID: 101,
    StaffID: 'staff-123',
    BookingID: 'booking-123',
    InspectionType: 'check_in' as any,
    InspectionDateTime: new Date(),
    VehicleConditionNotes: '',
    OdometerReading: 0,
    BatteryLevel: 0,
    DamageNotes: '',
    PhotoUrls: '',
    CurrentStep: 2,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    Status: InspectionStatus.Pending,
    SubStatus: '',
    RejectedReason: '',
    booking: {} as any,
  };

  const mockContract: Contract = {
    ContractDatTTID: 'contract-123',
    BookingID: 'booking-123',
    TermsAndConditions: 'Standard terms',
    StartDate: new Date(),
    EndDate: new Date(),
    SignedAt: new Date(),
    SignedByRenter: false,
    SignedByStaff: false,
    ContractPdfUrl: '',
    VoidedAt: new Date(),
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    Status: ContractStatus.Draft,
    StatusReason: '',
    booking: {} as any,
  };

  beforeEach(async () => {
    const mockCheckinSessionRepository = {
      findByIdWithAllRelations: jest.fn(),
      updatePhotoUrls: jest.fn(),
      updateVehicleDataAndCreateContract: jest.fn(),
      approveStep2AndCreateContract: jest.fn(),
      updateStep2Rejection: jest.fn(),
    };

    const mockCloudinaryService = {
      uploadMultipleImages: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinSessionService,
        {
          provide: CheckinSessionRepository,
          useValue: mockCheckinSessionRepository,
        },
        {
          provide: 'CloudinaryService',
          useClass: MockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<CheckinSessionService>(CheckinSessionService);
    checkinSessionRepository = module.get(CheckinSessionRepository);
    cloudinaryService = module.get(MockCloudinaryService);
  });

  describe('uploadInspectionPhotos', () => {
    const mockFiles: Express.Multer.File[] = [
      {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
      {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
      {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
      {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
      {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
      {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
    ];

    it('should upload photos successfully', async () => {
      const photoUrls = [
        'https://res.cloudinary.com/test/front.jpg',
        'https://res.cloudinary.com/test/rear.jpg',
        'https://res.cloudinary.com/test/left.jpg',
        'https://res.cloudinary.com/test/right.jpg',
        'https://res.cloudinary.com/test/odo.jpg',
        'https://res.cloudinary.com/test/battery.jpg',
      ];

      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );
      cloudinaryService.uploadMultipleImages.mockResolvedValue(photoUrls);
      checkinSessionRepository.updatePhotoUrls.mockResolvedValue({
        ...mockInspection,
        PhotoUrls: JSON.stringify(photoUrls),
      });

      const result = await service.uploadInspectionPhotos(
        101,
        'staff-123',
        mockFiles,
      );

      expect(result.message).toBe(
        'Vehicle inspection photos uploaded successfully',
      );
      expect(result.data.inspectionId).toBe(101);
      expect(result.data.photoUrls).toEqual(photoUrls);
    });

    it('should throw NotFoundException when inspection not found', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(null);

      await expect(
        service.uploadInspectionPhotos(101, 'staff-123', mockFiles),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when staff ID mismatch', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.uploadInspectionPhotos(101, 'different-staff', mockFiles),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when not at step 2', async () => {
      const inspectionAtStep1 = { ...mockInspection, CurrentStep: 1 };
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        inspectionAtStep1,
      );

      await expect(
        service.uploadInspectionPhotos(101, 'staff-123', mockFiles),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when not exactly 6 files', async () => {
      const only5Files = mockFiles.slice(0, 5);
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.uploadInspectionPhotos(101, 'staff-123', only5Files),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const invalidFiles = [
        ...mockFiles.slice(0, 5),
        {
          buffer: Buffer.from('test'),
          mimetype: 'text/plain',
          size: 1024,
        } as Express.Multer.File,
      ];
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.uploadInspectionPhotos(101, 'staff-123', invalidFiles),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for file too large', async () => {
      const largeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 6 * 1024 * 1024,
      } as Express.Multer.File;
      const filesWithLarge = [...mockFiles.slice(0, 5), largeFile];
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.uploadInspectionPhotos(101, 'staff-123', filesWithLarge),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateVehicleData', () => {
    const updateDto: UpdateVehicleDataDto = {
      odometerKm: 15200,
      batteryLevel: 87.5,
      vehicleConditionNotes: 'Normal condition',
      damageNotes: '',
    };

    it('should update vehicle data and create contract successfully', async () => {
      const result = {
        inspection: {
          ...mockInspection,
          CurrentStep: 3,
          OdometerReading: 15200,
          BatteryLevel: 87.5,
        },
        contract: mockContract,
      };

      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );
      checkinSessionRepository.updateVehicleDataAndCreateContract.mockResolvedValue(
        result,
      );

      const response = await service.updateVehicleData(
        101,
        'staff-123',
        updateDto,
      );

      expect(response.message).toBe(
        'Vehicle inspection data updated and contract created (Step 3)',
      );
      expect(response.data.inspectionId).toBe(101);
      expect(response.data.currentStep).toBe(3);
      expect(response.data.contract.contractId).toBe('contract-123');
    });

    it('should throw NotFoundException when inspection not found', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(null);

      await expect(
        service.updateVehicleData(101, 'staff-123', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when staff ID mismatch', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.updateVehicleData(101, 'different-staff', updateDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when not at step 2', async () => {
      const inspectionAtStep1 = { ...mockInspection, CurrentStep: 1 };
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        inspectionAtStep1,
      );

      await expect(
        service.updateVehicleData(101, 'staff-123', updateDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when status is not Pending', async () => {
      const rejectedInspection = {
        ...mockInspection,
        Status: InspectionStatus.Rejected,
      };
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        rejectedInspection,
      );

      await expect(
        service.updateVehicleData(101, 'staff-123', updateDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('rejectStep2', () => {
    const rejectDto: Step2RejectDto = {
      reason: 'Front bumper damaged',
    };

    it('should reject step 2 successfully', async () => {
      const rejectedInspection = {
        ...mockInspection,
        Status: InspectionStatus.Rejected,
        RejectedReason: 'Front bumper damaged',
      };

      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );
      checkinSessionRepository.updateStep2Rejection.mockResolvedValue(
        rejectedInspection,
      );

      const response = await service.rejectStep2(101, 'staff-123', rejectDto);

      expect(response.message).toBe('Vehicle inspection rejected');
      expect(response.data.inspectionId).toBe(101);
      expect(response.data.status).toBe('Rejected');
      expect(response.data.rejectedReason).toBe('Front bumper damaged');
    });

    it('should throw NotFoundException when inspection not found', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(null);

      await expect(
        service.rejectStep2(101, 'staff-123', rejectDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when staff ID mismatch', async () => {
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        mockInspection,
      );

      await expect(
        service.rejectStep2(101, 'different-staff', rejectDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when not at step 2', async () => {
      const inspectionAtStep1 = { ...mockInspection, CurrentStep: 1 };
      checkinSessionRepository.findByIdWithAllRelations.mockResolvedValue(
        inspectionAtStep1,
      );

      await expect(
        service.rejectStep2(101, 'staff-123', rejectDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
