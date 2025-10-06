import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Email không tồn tại trong hệ thống',
        error: 'Email Not Found',
        code: 'EMAIL_NOT_FOUND',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class PhoneNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Số điện thoại không tồn tại trong hệ thống',
        error: 'Phone Not Found',
        code: 'PHONE_NOT_FOUND',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidPasswordException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Mật khẩu không chính xác',
        error: 'Invalid Password',
        code: 'INVALID_PASSWORD',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AccountInactiveException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Tài khoản đã bị vô hiệu hóa',
        error: 'Account Inactive',
        code: 'ACCOUNT_INACTIVE',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AccountLockedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Tài khoản đã bị khóa',
        error: 'Account Locked',
        code: 'ACCOUNT_LOCKED',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
