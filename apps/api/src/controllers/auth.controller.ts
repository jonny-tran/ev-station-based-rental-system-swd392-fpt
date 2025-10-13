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
import { JwtPayload } from '../strategies/jwt.strategy';
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
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        message: 'Login successfully!',
        data: result,
      };
    } catch (error) {
      // If it's a HttpException (custom exceptions), return as usual
      if (error instanceof HttpException) {
        throw error;
      }

      // Nếu là lỗi khác, trả về lỗi generic
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during login',
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
  async getProfile(@Request() req: { user: JwtPayload }) {
    try {
      const userInfo = await this.authService.getUserInfo(req.user.accountId);
      return {
        success: true,
        message: 'Get user information successfully',
        data: userInfo,
      };
    } catch (error) {
      // If it's a HttpException (custom exceptions), return as usual
      if (error instanceof HttpException) {
        throw error;
      }

      // Nếu là lỗi khác, trả về lỗi generic
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred when getting user information',
          error: 'Internal Server Error',
          code: 'GET_USER_INFO_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
