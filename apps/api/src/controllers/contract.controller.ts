/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ContractService } from '../services/contract.service';
import { ContractDetailsResponseDto } from '../dto/contract-details-response.dto';
import { SubmitContractDto } from '../dto/submit-contract.dto';
import { SignContractDto } from '../dto/sign-contract.dto';
import { RejectContractDto } from '../dto/reject-contract.dto';
import { ContractResponseDto } from '../dto/contract-response.dto';
import { ContractListQueryDto } from '../dto/contract-list.dto';
import { ContractListResponseDto } from '../dto/contract-list-response.dto';

@ApiTags('Contract')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get(':contractId')
  @ApiOperation({ summary: 'Get contract details for step 3' })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract details retrieved successfully',
    type: ContractDetailsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async getContractDetails(
    @Param('contractId') contractId: string,
    @Request() req: any,
  ) {
    try {
      // Determine user ID based on role
      const userId: string =
        req.user.role === 'Staff'
          ? (req.user.staffId as string)
          : (req.user.sub as string);

      const result = await this.contractService.getContractDetails(
        contractId,
        userId,
        req.user.role,
      );

      return {
        message: 'Contract details retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve contract details',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':contractId/submit')
  @ApiOperation({ summary: 'Submit contract for renter signing' })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract submitted for renter signing',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status or missing contract',
  })
  @ApiResponse({ status: 403, description: 'Not staff' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async submitContract(
    @Param('contractId') contractId: string,
    @Body() submitDto: SubmitContractDto,
    @Request() req: any,
  ) {
    try {
      const result = await this.contractService.submitContractForSigning(
        contractId,
        req.user.staffId,
        req.user.role,
        submitDto,
      );

      return {
        message: 'Contract submitted for renter signing',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to submit contract',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':contractId/staff-sign')
  @ApiOperation({ summary: 'Staff sign the contract' })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Staff signed the contract successfully',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Renter not signed yet' })
  @ApiResponse({ status: 403, description: 'Unauthorized staff' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async staffSignContract(
    @Param('contractId') contractId: string,
    @Body() signDto: SignContractDto,
    @Request() req: any,
  ) {
    try {
      const result = await this.contractService.staffSignContract(
        contractId,
        req.user.staffId,
        req.user.role,
        signDto,
      );

      return {
        message: 'Staff signed the contract successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to sign contract',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':contractId/renter-sign')
  @ApiOperation({ summary: 'Renter sign the contract' })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Renter signed the contract successfully',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized renter' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async renterSignContract(
    @Param('contractId') contractId: string,
    @Body() signDto: SignContractDto,
    @Request() req: any,
  ) {
    try {
      const result = await this.contractService.renterSignContract(
        contractId,
        req.user.sub,
        req.user.role,
        signDto,
      );

      return {
        message: 'Renter signed the contract successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to sign contract',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':contractId/reject')
  @ApiOperation({ summary: 'Staff reject the contract' })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract has been rejected and voided',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 403, description: 'Unauthorized staff' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async rejectContract(
    @Param('contractId') contractId: string,
    @Body() rejectDto: RejectContractDto,
    @Request() req: any,
  ) {
    try {
      const result = await this.contractService.rejectContract(
        contractId,
        req.user.staffId,
        req.user.role,
        rejectDto,
      );

      return {
        message: 'Contract has been rejected and voided',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to reject contract',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('staff/list')
  @ApiOperation({ summary: 'Get all contracts by staff ID' })
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
    description: 'Filter by contract status',
    enum: ['Draft', 'Active', 'Completed', 'Terminated', 'Voided'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by booking ID, vehicle license plate, or renter name',
    example: '51A-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Staff contracts retrieved successfully',
    type: ContractListResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied. Staff only.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getContractsByStaffId(
    @Query() queryDto: ContractListQueryDto,
    @Request() req: any,
  ) {
    try {
      const result = await this.contractService.getContractsByStaffId(
        req.user.staffId,
        req.user.role,
        queryDto,
      );

      return {
        message: 'Staff contracts retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve staff contracts',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('renter/list')
  @ApiOperation({ summary: 'Get all contracts by renter ID' })
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
    description: 'Filter by contract status',
    enum: ['Draft', 'Active', 'Completed', 'Terminated', 'Voided'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by booking ID, vehicle license plate, or renter name',
    example: '51A-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Renter contracts retrieved successfully',
    type: ContractListResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied. Renter only.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getContractsByRenterId(
    @Query() queryDto: ContractListQueryDto,
    @Request() req: any,
  ) {
    try {
      const result = await this.contractService.getContractsByRenterId(
        req.user.sub,
        req.user.role,
        queryDto,
      );

      return {
        message: 'Renter contracts retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve renter contracts',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
