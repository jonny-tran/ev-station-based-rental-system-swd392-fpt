/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CheckinSessionService } from '../src/services/checkin-session.service';
import { BookingRepository } from '../src/repositories/booking.repository';
import { CheckinSessionRepository } from '../src/repositories/checkin-session.repository';
import { VehicleRepository } from '../src/repositories/vehicle.repository';
import { RentalLocationRepository } from '../src/repositories/rental-location.repository';
import { RenterRepository } from '../src/repositories/renter.repository';
import {
  InspectionType,
  InspectionStatus,
} from '../src/entities/vehicle-inspection.entity';
import { Booking } from '../src/entities/booking.entity';
import { VehicleInspection } from '../src/entities/vehicle-inspection.entity';

describe('CheckinSessionService', () => {
  let service: CheckinSessionService;
  let bookingRepository: jest.Mocked<BookingRepository>;
  let checkinSessionRepository: jest.Mocked<CheckinSessionRepository>;

  const mockBooking: Partial<Booking> = {
    BookingID: 'booking-123',
    Status: 'Pending',
    DepositAmount: 150.0,
    StartTime: new Date('2024-01-01T10:00:00Z'),
    EndTime: new Date('2024-01-01T18:00:00Z'),
    CreatedAt: new Date('2024-01-01T09:00:00Z'),
    renter: {
      RenterID: 'renter-123',
      IdentityNumber: '123456789',
      Address: '123 Main St',
      DateOfBirth: new Date('1990-01-01'),
      account: {
        fullName: 'John Doe',
      },
    } as any,
    vehicle: {
      VehicleID: 'vehicle-123',
      Brand: 'Tesla',
      Model: 'Model 3',
      LicensePlate: '51A-12345',
      Year: 2023,
      Color: 'White',
      rentalLocation: {
        RentalLocationID: 'location-123',
        Name: 'EV Hub District 7',
        Address: '123 Nguyen Van Linh, HCMC',
        City: 'Ho Chi Minh City',
        Country: 'Vietnam',
      },
    } as any,
  };

  const mockInspection: Partial<VehicleInspection> = {
    InspectionDatTTID: 1,
    BookingID: 'booking-123',
    StaffID: 'staff-123',
    InspectionType: InspectionType.CheckIn,
    CurrentStep: 1,
    Status: InspectionStatus.Pending,
    CreatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockBookingRepository = {
      findByIdForQRValidation: jest.fn(),
      findById: jest.fn(),
    };

    const mockCheckinSessionRepository = {
      findExistingCheckinSession: jest.fn(),
      createCheckinSession: jest.fn(),
      findCheckinSessionsByStaff: jest.fn(),
    };

    const mockVehicleRepository = {
      findByIdWithRentalLocation: jest.fn(),
      findById: jest.fn(),
    };

    const mockRentalLocationRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const mockRenterRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinSessionService,
        {
          provide: BookingRepository,
          useValue: mockBookingRepository,
        },
        {
          provide: CheckinSessionRepository,
          useValue: mockCheckinSessionRepository,
        },
        {
          provide: VehicleRepository,
          useValue: mockVehicleRepository,
        },
        {
          provide: RentalLocationRepository,
          useValue: mockRentalLocationRepository,
        },
        {
          provide: RenterRepository,
          useValue: mockRenterRepository,
        },
      ],
    }).compile();

    service = module.get<CheckinSessionService>(CheckinSessionService);
    bookingRepository = module.get(BookingRepository);
    checkinSessionRepository = module.get(CheckinSessionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateQRCode', () => {
    it('should validate QR code successfully', async () => {
      bookingRepository.findByIdForQRValidation.mockResolvedValue(
        mockBooking as Booking,
      );
      checkinSessionRepository.findExistingCheckinSession.mockResolvedValue(
        null,
      );

      const result = await service.validateQRCode('booking-123');

      expect(result.message).toBe('Booking validated successfully');
      expect(result.data.booking.bookingId).toBe('booking-123');
      expect(result.data.renter.fullName).toBe('John Doe');
      expect(result.data.vehicle.brand).toBe('Tesla');
      expect(result.data.rentalLocation.name).toBe('EV Hub District 7');
    });

    it('should throw NotFoundException when booking not found', async () => {
      bookingRepository.findByIdForQRValidation.mockResolvedValue(null);

      await expect(service.validateQRCode('invalid-booking')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when booking is not pending', async () => {
      const confirmedBooking = { ...mockBooking, Status: 'Confirmed' };
      bookingRepository.findByIdForQRValidation.mockResolvedValue(
        confirmedBooking as Booking,
      );

      await expect(service.validateQRCode('booking-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when check-in session already exists', async () => {
      bookingRepository.findByIdForQRValidation.mockResolvedValue(
        mockBooking as Booking,
      );
      checkinSessionRepository.findExistingCheckinSession.mockResolvedValue(
        mockInspection as VehicleInspection,
      );

      await expect(service.validateQRCode('booking-123')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('createCheckinSession', () => {
    const createDto = {
      bookingId: 'booking-123',
      staffId: 'staff-123',
    };

    it('should create check-in session successfully', async () => {
      bookingRepository.findById.mockResolvedValue(mockBooking as Booking);
      checkinSessionRepository.findExistingCheckinSession.mockResolvedValue(
        null,
      );
      checkinSessionRepository.createCheckinSession.mockResolvedValue(
        mockInspection as VehicleInspection,
      );

      const result = await service.createCheckinSession(createDto);

      expect(result.message).toBe('Check-in session created successfully');
      expect(result.data.inspectionId).toBe(1);
      expect(result.data.bookingId).toBe('booking-123');
      expect(result.data.staffId).toBe('staff-123');
    });

    it('should throw BadRequestException when booking not found', async () => {
      bookingRepository.findById.mockResolvedValue(null);

      await expect(service.createCheckinSession(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when booking is not pending', async () => {
      const confirmedBooking = { ...mockBooking, Status: 'Confirmed' };
      bookingRepository.findById.mockResolvedValue(confirmedBooking as Booking);

      await expect(service.createCheckinSession(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when check-in session already exists', async () => {
      bookingRepository.findById.mockResolvedValue(mockBooking as Booking);
      checkinSessionRepository.findExistingCheckinSession.mockResolvedValue(
        mockInspection as VehicleInspection,
      );

      await expect(service.createCheckinSession(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getCheckinSessionsList', () => {
    const queryDto = {
      page: 1,
      pageSize: 10,
    };

    const mockSessions = [
      {
        ...mockInspection,
        booking: mockBooking,
      },
    ];

    it('should get check-in sessions list successfully', async () => {
      checkinSessionRepository.findCheckinSessionsByStaff.mockResolvedValue({
        sessions: mockSessions as any,
        total: 1,
      });

      const result = await service.getCheckinSessionsList(
        'staff-123',
        queryDto,
      );

      expect(result.message).toBe('Check-in sessions retrieved successfully');
      expect(result.data.total).toBe(1);
      expect(result.data.sessions).toHaveLength(1);
      expect(result.data.sessions[0].inspectionId).toBe(1);
    });

    it('should handle pagination correctly', async () => {
      checkinSessionRepository.findCheckinSessionsByStaff.mockResolvedValue({
        sessions: mockSessions as any,
        total: 25,
      });

      const result = await service.getCheckinSessionsList('staff-123', {
        page: 2,
        pageSize: 10,
      });

      expect(result.data.page).toBe(2);
      expect(result.data.pageSize).toBe(10);
      expect(result.data.total).toBe(25);
    });
  });
});
