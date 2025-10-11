/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { CheckinSessionRepository } from '../repositories/checkin-session.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { RentalLocationRepository } from '../repositories/rental-location.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { CreateCheckinSessionDto } from '../dto/create-checkin-session.dto';
import { CheckinSessionListDto } from '../dto/checkin-session-list.dto';
import {
  ValidateQRResponseDto,
  CreateCheckinSessionResponseDto,
  CheckinSessionListResponseDto,
} from '../dto/checkin-session-response.dto';
import {
  CheckinSessionDetailsResponseDto,
  Step1ApprovalResponseDto,
  Step1RejectionResponseDto,
} from '../dto/step1-response.dto';
import { Step1ApproveDto } from '../dto/step1-approve.dto';
import { Step1RejectDto } from '../dto/step1-reject.dto';
import { UploadPhotosResponseDto } from '../dto/step2-upload-photos.dto';
import {
  UpdateVehicleDataDto,
  UpdateVehicleDataResponseDto,
} from '../dto/step2-vehicle-data.dto';
import {
  Step2RejectDto,
  Step2RejectResponseDto,
} from '../dto/step2-reject.dto';
import { CloudinaryService } from '../../third-party/cloudinary/cloudinary.service';
@Injectable()
export class CheckinSessionService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly checkinSessionRepository: CheckinSessionRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly rentalLocationRepository: RentalLocationRepository,
    private readonly renterRepository: RenterRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async validateQRCode(bookingId: string): Promise<ValidateQRResponseDto> {
    try {
      // Check if booking exists with all related entities
      const booking =
        await this.bookingRepository.findByIdForQRValidation(bookingId);

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      // Validate booking status is "Pending" (as per requirements)
      if (booking.Status !== 'Pending') {
        throw new BadRequestException('Booking is not pending');
      }

      // Check if there's already a check-in session
      const existingSession =
        await this.checkinSessionRepository.findExistingCheckinSession(
          bookingId,
        );

      if (existingSession) {
        throw new ConflictException('Check-in session already exists');
      }

      // Map response data
      const responseData = {
        booking: {
          bookingId: booking.BookingID,
          status: booking.Status,
          depositAmount: booking.DepositAmount,
          startTime: booking.StartTime,
          endTime: booking.EndTime,
          createdAt: booking.CreatedAt,
        },
        renter: {
          renterId: booking.renter.RenterID,
          fullName: booking.renter.account.fullName,
          identityNumber: booking.renter.IdentityNumber,
          address: booking.renter.Address,
          dateOfBirth: booking.renter.DateOfBirth,
        },
        vehicle: {
          vehicleId: booking.vehicle.VehicleID,
          brand: booking.vehicle.Brand,
          model: booking.vehicle.Model,
          licensePlate: booking.vehicle.LicensePlate,
          year: booking.vehicle.Year,
          color: booking.vehicle.Color,
        },
        rentalLocation: {
          rentalLocationId: booking.vehicle.rentalLocation.RentalLocationID,
          name: booking.vehicle.rentalLocation.Name,
          address: booking.vehicle.rentalLocation.Address,
          city: booking.vehicle.rentalLocation.City,
          country: booking.vehicle.rentalLocation.Country,
        },
      };

      return {
        message: 'Booking validated successfully',
        data: responseData,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate QR code');
    }
  }

  async createCheckinSession(
    createDto: CreateCheckinSessionDto,
    staffId: string,
  ): Promise<CreateCheckinSessionResponseDto> {
    try {
      const { bookingId } = createDto;

      // Validate booking exists and is pending
      const booking = await this.bookingRepository.findById(bookingId);

      if (!booking) {
        throw new BadRequestException('Invalid booking ID');
      }

      if (booking.Status !== 'Pending') {
        throw new BadRequestException('Booking is not pending');
      }

      // Check if check-in session already exists
      const existingSession =
        await this.checkinSessionRepository.findExistingCheckinSession(
          bookingId,
        );

      if (existingSession) {
        throw new ConflictException('Check-in session already exists');
      }

      // Create new check-in session
      const inspection =
        await this.checkinSessionRepository.createCheckinSession(
          bookingId,
          staffId,
        );

      const responseData = {
        inspectionId: inspection.InspectionDatTTID,
        bookingId: inspection.BookingID,
        staffId: inspection.StaffID,
        inspectionType: inspection.InspectionType,
        currentStep: inspection.CurrentStep,
        status: inspection.Status,
        createdAt: inspection.CreatedAt,
      };

      return {
        message: 'Check-in session created successfully',
        data: responseData,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create check-in session',
      );
    }
  }

  async getCheckinSessionsList(
    staffId: string,
    queryDto: CheckinSessionListDto,
  ): Promise<CheckinSessionListResponseDto> {
    try {
      const { page = 1, pageSize = 10, status, search } = queryDto;

      const { sessions, total } =
        await this.checkinSessionRepository.findCheckinSessionsByStaff(
          staffId,
          page,
          pageSize,
          status,
          search,
        );

      const mappedSessions = sessions.map((session) => ({
        inspectionId: session.InspectionDatTTID,
        status: session.Status,
        currentStep: session.CurrentStep,
        booking: {
          bookingId: session.booking.BookingID,
          status: session.booking.Status,
          depositAmount: session.booking.DepositAmount,
          startTime: session.booking.StartTime,
          endTime: session.booking.EndTime,
        },
        vehicle: {
          brand: session.booking.vehicle.Brand,
          model: session.booking.vehicle.Model,
          licensePlate: session.booking.vehicle.LicensePlate,
        },
        renter: {
          fullName: session.booking.renter.account.fullName,
          identityNumber: session.booking.renter.IdentityNumber,
        },
      }));

      return {
        message: 'Check-in sessions retrieved successfully',
        data: {
          total,
          page,
          pageSize,
          sessions: mappedSessions,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve check-in sessions',
      );
    }
  }

  async getCheckinSessionDetails(
    inspectionId: number,
    staffId: string,
  ): Promise<CheckinSessionDetailsResponseDto> {
    try {
      // Get inspection with all related entities
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Get the first driver license (assuming one primary license)
      const primaryDriverLicense =
        inspection.booking.renter.driverLicenses?.[0];

      const responseData = {
        inspection: {
          inspectionId: inspection.InspectionDatTTID,
          staffId: inspection.StaffID,
          bookingId: inspection.BookingID,
          inspectionType: inspection.InspectionType,
          inspectionDateTime: inspection.InspectionDateTime,
          vehicleConditionNotes: inspection.VehicleConditionNotes,
          odometerReading: inspection.OdometerReading,
          batteryLevel: inspection.BatteryLevel,
          damageNotes: inspection.DamageNotes,
          photoUrls: inspection.PhotoUrls,
          currentStep: inspection.CurrentStep,
          status: inspection.Status,
          subStatus: inspection.SubStatus,
          rejectedReason: inspection.RejectedReason,
          createdAt: inspection.CreatedAt,
          updatedAt: inspection.UpdatedAt,
        },
        booking: {
          bookingId: inspection.booking.BookingID,
          renterId: inspection.booking.RenterID,
          vehicleId: inspection.booking.VehicleID,
          startTime: inspection.booking.StartTime,
          endTime: inspection.booking.EndTime,
          depositAmount: inspection.booking.DepositAmount,
          status: inspection.booking.Status,
          createdAt: inspection.booking.CreatedAt,
          cancelledAt: inspection.booking.CancelledAt,
        },
        renter: {
          renterId: inspection.booking.renter.RenterID,
          accountId: inspection.booking.renter.AccountID,
          address: inspection.booking.renter.Address,
          dateOfBirth: inspection.booking.renter.DateOfBirth,
          identityNumber: inspection.booking.renter.IdentityNumber,
          frontIdentityImageUrl:
            inspection.booking.renter.FrontIdentityImageUrl,
          backIdentityImageUrl: inspection.booking.renter.BackIdentityImageUrl,
        },
        account: {
          accountId: inspection.booking.renter.account.accountId,
          email: inspection.booking.renter.account.email,
          phoneNumber: inspection.booking.renter.account.phoneNumber,
          fullName: inspection.booking.renter.account.fullName,
          avatarUrl: inspection.booking.renter.account.avatarUrl,
          role: inspection.booking.renter.account.role,
          status: inspection.booking.renter.account.status,
          createdAt: inspection.booking.renter.account.createdAt,
          updatedAt: inspection.booking.renter.account.updatedAt,
        },
        driverLicense: primaryDriverLicense
          ? {
              licenseId: primaryDriverLicense.LicenseID,
              renterId: primaryDriverLicense.RenterID,
              licenseNumber: primaryDriverLicense.LicenseNumber,
              issuedDate: primaryDriverLicense.IssuedDate,
              expiryDate: primaryDriverLicense.ExpiryDate,
              licenseType: primaryDriverLicense.LicenseType,
              licenseImageUrl: primaryDriverLicense.LicenseImageUrl,
              issuedBy: primaryDriverLicense.IssuedBy,
              verifiedStatus: primaryDriverLicense.VerifiedStatus.toString(),
              verifiedAt: primaryDriverLicense.VerifiedAt,
            }
          : null,
        vehicle: {
          vehicleId: inspection.booking.vehicle.VehicleID,
          rentalLocationId: inspection.booking.vehicle.RentalLocationID,
          licensePlate: inspection.booking.vehicle.LicensePlate,
          model: inspection.booking.vehicle.Model,
          brand: inspection.booking.vehicle.Brand,
          year: inspection.booking.vehicle.Year,
          mileage: inspection.booking.vehicle.Mileage,
          batteryCapacity: inspection.booking.vehicle.BatteryCapacity,
          batteryLevel: inspection.booking.vehicle.BatteryLevel,
          chargingCycles: inspection.booking.vehicle.ChargingCycles,
          color: inspection.booking.vehicle.Color,
          imageUrl: inspection.booking.vehicle.ImageUrl,
          rentalRate: inspection.booking.vehicle.RentalRate,
          lastServiceDate: inspection.booking.vehicle.LastServiceDate,
          status: inspection.booking.vehicle.Status,
        },
        rentalLocation: {
          rentalLocationId:
            inspection.booking.vehicle.rentalLocation.RentalLocationID,
          name: inspection.booking.vehicle.rentalLocation.Name,
          address: inspection.booking.vehicle.rentalLocation.Address,
          city: inspection.booking.vehicle.rentalLocation.City,
          country: inspection.booking.vehicle.rentalLocation.Country,
          contactNumber:
            inspection.booking.vehicle.rentalLocation.ContactNumber,
          openingHours: inspection.booking.vehicle.rentalLocation.OpeningHours,
          closingHours: inspection.booking.vehicle.rentalLocation.ClosingHours,
          latitude: inspection.booking.vehicle.rentalLocation.Latitude,
          longitude: inspection.booking.vehicle.rentalLocation.Longitude,
        },
        contract: null, // Contract will be null until step 3
      };

      return {
        message: 'Check-in session details retrieved successfully',
        data: responseData,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve check-in session details',
      );
    }
  }

  async approveStep1(
    inspectionId: number,
    staffId: string,
    approveDto: Step1ApproveDto,
  ): Promise<Step1ApprovalResponseDto> {
    try {
      // Get inspection to validate
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Validate current step and status
      if (inspection.CurrentStep !== 1) {
        throw new BadRequestException('Invalid step. Must be at step 1.');
      }

      if (inspection.Status !== 'Pending') {
        throw new BadRequestException('Invalid status. Must be Pending.');
      }

      // Update to step 2
      const updatedInspection =
        await this.checkinSessionRepository.updateStep1Approval(
          inspectionId,
          approveDto.notes,
        );

      const responseData = {
        inspectionId: updatedInspection.InspectionDatTTID,
        currentStep: updatedInspection.CurrentStep,
        status: updatedInspection.Status,
        updatedAt: updatedInspection.UpdatedAt,
      };

      return {
        message: 'License verification approved. Moved to Step 2.',
        data: responseData,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to approve step 1');
    }
  }

  async rejectStep1(
    inspectionId: number,
    staffId: string,
    rejectDto: Step1RejectDto,
  ): Promise<Step1RejectionResponseDto> {
    try {
      // Get inspection to validate
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Validate current step
      if (inspection.CurrentStep !== 1) {
        throw new BadRequestException('Invalid step. Must be at step 1.');
      }

      // Update to rejected status
      const updatedInspection =
        await this.checkinSessionRepository.updateStep1Rejection(
          inspectionId,
          rejectDto.reason,
        );

      const responseData = {
        inspectionId: updatedInspection.InspectionDatTTID,
        status: updatedInspection.Status,
        rejectedReason: updatedInspection.RejectedReason,
        currentStep: updatedInspection.CurrentStep,
      };

      return {
        message: 'License verification rejected.',
        data: responseData,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reject step 1');
    }
  }

  async uploadInspectionPhotos(
    inspectionId: number,
    staffId: string,
    files: Express.Multer.File[],
  ): Promise<UploadPhotosResponseDto> {
    try {
      // Get inspection to validate
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Validate current step
      if (inspection.CurrentStep !== 2) {
        throw new BadRequestException('Invalid step. Must be at step 2.');
      }

      // Validate file count
      if (!files || files.length !== 6) {
        throw new BadRequestException('All 6 inspection photos are required');
      }

      // Validate file types and sizes
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (const file of files) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException(
            'Invalid file type. Only JPEG and PNG are allowed.',
          );
        }
        if (file.size > maxSize) {
          throw new BadRequestException(
            'File size too large. Maximum size is 5MB.',
          );
        }
      }

      // Upload files to Cloudinary
      const photoUrls =
        await this.cloudinaryService.uploadMultipleImages(files);

      // Update inspection with photo URLs
      const updatedInspection =
        await this.checkinSessionRepository.updatePhotoUrls(
          inspectionId,
          JSON.stringify(photoUrls),
        );

      return {
        message: 'Vehicle inspection photos uploaded successfully',
        data: {
          inspectionId: updatedInspection.InspectionDatTTID,
          photoUrls,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload photos');
    }
  }

  async updateVehicleData(
    inspectionId: number,
    staffId: string,
    updateDto: UpdateVehicleDataDto,
  ): Promise<UpdateVehicleDataResponseDto> {
    try {
      // Get inspection to validate
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Validate current step and status
      if (inspection.CurrentStep !== 2) {
        throw new BadRequestException('Invalid step. Must be at step 2.');
      }

      if (inspection.Status !== 'Pending') {
        throw new BadRequestException('Invalid status. Must be Pending.');
      }

      // Update vehicle inspection data and create contract
      const result =
        await this.checkinSessionRepository.updateVehicleDataAndCreateContract(
          inspectionId,
          updateDto,
        );

      return {
        message:
          'Vehicle inspection data updated and contract created (Step 3)',
        data: {
          inspectionId: result.inspection.InspectionDatTTID,
          currentStep: result.inspection.CurrentStep,
          status: result.inspection.Status,
          odometerReading: result.inspection.OdometerReading,
          batteryLevel: result.inspection.BatteryLevel,
          contract: {
            contractId: result.contract.ContractDatTTID,
            bookingId: result.contract.BookingID,
            createdByStaffId: result.contract.CreatedByStaffID,
            status: result.contract.Status,
            startDate: result.contract.StartDate,
            endDate: result.contract.EndDate,
          },
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update vehicle data');
    }
  }

  async rejectStep2(
    inspectionId: number,
    staffId: string,
    rejectDto: Step2RejectDto,
  ): Promise<Step2RejectResponseDto> {
    try {
      // Get inspection to validate
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Validate current step
      if (inspection.CurrentStep !== 2) {
        throw new BadRequestException('Invalid step. Must be at step 2.');
      }

      // Update to rejected status
      const updatedInspection =
        await this.checkinSessionRepository.updateStep2Rejection(
          inspectionId,
          rejectDto.reason,
        );

      return {
        message: 'Vehicle inspection rejected',
        data: {
          inspectionId: updatedInspection.InspectionDatTTID,
          status: updatedInspection.Status,
          rejectedReason: updatedInspection.RejectedReason,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reject step 2');
    }
  }

  async approveStep3(inspectionId: number, staffId: string) {
    try {
      // Get inspection to validate
      const inspection =
        await this.checkinSessionRepository.findByIdWithAllRelations(
          inspectionId,
        );

      if (!inspection) {
        throw new NotFoundException('Inspection not found');
      }

      // Verify staff ownership
      if (inspection.StaffID !== staffId) {
        throw new ForbiddenException(
          'Access denied. Staff only or mismatched staff ID.',
        );
      }

      // Validate current step
      if (inspection.CurrentStep !== 3) {
        throw new BadRequestException('Invalid step. Must be at step 3.');
      }

      // Update to step 4
      const updatedInspection =
        await this.checkinSessionRepository.updateStep3Approval(inspectionId);

      return updatedInspection;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to approve step 3');
    }
  }
}
