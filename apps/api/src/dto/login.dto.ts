/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
