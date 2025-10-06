/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthInfoResponseDto } from '../dto/auth-info-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        message: 'Đăng nhập thành công',
        data: result,
      };
    } catch (error) {
      // Nếu là HttpException (custom exceptions), trả về như cũ
      if (error instanceof HttpException) {
        throw error;
      }

      // Nếu là lỗi khác, trả về lỗi generic
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Có lỗi xảy ra trong quá trình đăng nhập',
          error: 'Internal Server Error',
          code: 'LOGIN_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user information after login' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: AuthInfoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async getProfile(@Request() req) {
    try {
      const userInfo = await this.authService.getUserInfo(req.user.accountId);
      return {
        success: true,
        message: 'Lấy thông tin người dùng thành công',
        data: userInfo,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Có lỗi xảy ra khi lấy thông tin người dùng',
          error: 'Internal Server Error',
          code: 'GET_USER_INFO_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
