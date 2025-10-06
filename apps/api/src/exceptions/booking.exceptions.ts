import { HttpException, HttpStatus } from '@nestjs/common';

export class BookingNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Booking not found or does not belong to you',
        error: 'Booking Not Found',
        code: 'BOOKING_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AccessDeniedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Access denied. Only renters can access this resource.',
        error: 'Access Denied',
        code: 'ACCESS_DENIED',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or missing authentication token',
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'An unexpected error occurred') {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
