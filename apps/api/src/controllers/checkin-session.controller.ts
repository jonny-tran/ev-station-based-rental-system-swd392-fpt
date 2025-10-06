/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CheckinSessionService } from '../services/checkin-session.service';
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

@ApiTags('Check-in Session')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard)
export class CheckinSessionController {
  constructor(private readonly checkinSessionService: CheckinSessionService) {}

  @Get('booking/validate-qr/:bookingId')
  @ApiOperation({ summary: 'Validate QR code and get booking details' })
  @ApiParam({
    name: 'bookingId',
    description: 'Booking ID from QR code',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking validated successfully',
    type: ValidateQRResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only.',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Booking is not pending',
  })
  @ApiResponse({
    status: 409,
    description: 'Check-in session already exists',
  })
  async validateQRCode(
    @Param('bookingId') bookingId: string,
    @Request() req: any,
  ): Promise<ValidateQRResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return this.checkinSessionService.validateQRCode(bookingId);
  }

  @Post('checkin-session/create')
  @ApiOperation({ summary: 'Create new check-in session' })
  @ApiResponse({
    status: 201,
    description: 'Check-in session created successfully',
    type: CreateCheckinSessionResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking or not pending',
  })
  @ApiResponse({
    status: 409,
    description: 'Check-in session already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createCheckinSession(
    @Body() createDto: CreateCheckinSessionDto,
    @Request() req: any,
  ): Promise<CreateCheckinSessionResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return this.checkinSessionService.createCheckinSession(
      createDto,
      req.user.staffId,
    );
  }

  @Get('checkin-session/list')
  @ApiOperation({ summary: 'Get paginated list of check-in sessions' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by inspection status',
    enum: ['Pending', 'Approved', 'Completed', 'Rejected'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by booking ID, vehicle model, or renter name',
    example: 'Tesla',
  })
  @ApiResponse({
    status: 200,
    description: 'Check-in sessions retrieved successfully',
    type: CheckinSessionListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCheckinSessionsList(
    @Query() queryDto: CheckinSessionListDto,
    @Request() req: any,
  ): Promise<CheckinSessionListResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    // Get staff ID from JWT token
    const staffId = req.user.staffId;

    return this.checkinSessionService.getCheckinSessionsList(staffId, queryDto);
  }

  @Get('checkin-session/:inspectionId')
  @ApiOperation({
    summary: 'Get check-in session details with all related information',
  })
  @ApiParam({
    name: 'inspectionId',
    description: 'Inspection ID',
    example: 101,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Check-in session details retrieved successfully',
    type: CheckinSessionDetailsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only or mismatched staff ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCheckinSessionDetails(
    @Param('inspectionId') inspectionId: number,
    @Request() req: any,
  ): Promise<CheckinSessionDetailsResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return await this.checkinSessionService.getCheckinSessionDetails(
      inspectionId,
      req.user.staffId,
    );
  }

  @Put('checkin-session/:inspectionId/step1/approve')
  @ApiOperation({ summary: 'Approve Step 1 - License Verification' })
  @ApiParam({
    name: 'inspectionId',
    description: 'Inspection ID',
    example: 101,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'License verification approved. Moved to Step 2.',
    type: Step1ApprovalResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid step or status',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only or mismatched staff ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Update failed',
  })
  async approveStep1(
    @Param('inspectionId') inspectionId: number,
    @Body() approveDto: Step1ApproveDto,
    @Request() req: any,
  ): Promise<Step1ApprovalResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return await this.checkinSessionService.approveStep1(
      inspectionId,
      req.user.staffId,
      approveDto,
    );
  }

  @Put('checkin-session/:inspectionId/step1/reject')
  @ApiOperation({ summary: 'Reject Step 1 - License Verification' })
  @ApiParam({
    name: 'inspectionId',
    description: 'Inspection ID',
    example: 101,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'License verification rejected.',
    type: Step1RejectionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid state or missing reason',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only or mismatched staff ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Update failed',
  })
  async rejectStep1(
    @Param('inspectionId') inspectionId: number,
    @Body() rejectDto: Step1RejectDto,
    @Request() req: any,
  ): Promise<Step1RejectionResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return this.checkinSessionService.rejectStep1(
      inspectionId,
      req.user.staffId,
      rejectDto,
    );
  }

  @Post('checkin-session/:inspectionId/photos')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'front', maxCount: 1 },
      { name: 'rear', maxCount: 1 },
      { name: 'left', maxCount: 1 },
      { name: 'right', maxCount: 1 },
      { name: 'odo', maxCount: 1 },
      { name: 'battery', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Upload vehicle inspection photos' })
  @ApiParam({
    name: 'inspectionId',
    description: 'Inspection ID',
    example: 101,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle inspection photos uploaded successfully',
    type: UploadPhotosResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing or invalid files',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only or mismatched staff ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Cloudinary upload failure',
  })
  async uploadInspectionPhotos(
    @Param('inspectionId') inspectionId: number,
    @UploadedFiles()
    files: {
      front?: Express.Multer.File[];
      rear?: Express.Multer.File[];
      left?: Express.Multer.File[];
      right?: Express.Multer.File[];
      odo?: Express.Multer.File[];
      battery?: Express.Multer.File[];
    },
    @Request() req: any,
  ): Promise<UploadPhotosResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    // Convert FileFieldsInterceptor format to array
    const filesArray: Express.Multer.File[] = [];
    const requiredFields = ['front', 'rear', 'left', 'right', 'odo', 'battery'];

    for (const field of requiredFields) {
      if (!files[field] || files[field].length === 0) {
        throw new BadRequestException(`Missing required photo: ${field}`);
      }
      filesArray.push(files[field][0]);
    }

    return this.checkinSessionService.uploadInspectionPhotos(
      inspectionId,
      req.user.staffId,
      filesArray,
    );
  }

  @Put('checkin-session/:inspectionId/vehicle-data')
  @ApiOperation({ summary: 'Update vehicle inspection data' })
  @ApiParam({
    name: 'inspectionId',
    description: 'Inspection ID',
    example: 101,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description:
      'Vehicle inspection data updated and contract created (Step 3)',
    type: UpdateVehicleDataResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid step or missing fields',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only or mismatched staff ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed contract creation',
  })
  async updateVehicleData(
    @Param('inspectionId') inspectionId: number,
    @Body() updateDto: UpdateVehicleDataDto,
    @Request() req: any,
  ): Promise<UpdateVehicleDataResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return this.checkinSessionService.updateVehicleData(
      inspectionId,
      req.user.staffId,
      updateDto,
    );
  }

  @Put('checkin-session/:inspectionId/step2/reject')
  @ApiOperation({ summary: 'Reject Step 2 - Vehicle Inspection' })
  @ApiParam({
    name: 'inspectionId',
    description: 'Inspection ID',
    example: 101,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle inspection rejected.',
    type: Step2RejectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing reason or invalid step',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. Staff only or mismatched staff ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Update failed',
  })
  async rejectStep2(
    @Param('inspectionId') inspectionId: number,
    @Body() rejectDto: Step2RejectDto,
    @Request() req: any,
  ): Promise<Step2RejectResponseDto> {
    // Check if user is staff
    if (req.user.role !== 'Staff') {
      throw new ForbiddenException('Access denied. Staff only.');
    }

    return this.checkinSessionService.rejectStep2(
      inspectionId,
      req.user.staffId,
      rejectDto,
    );
  }
}
