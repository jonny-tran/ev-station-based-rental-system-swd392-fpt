import { ApiProperty } from '@nestjs/swagger';

export class AuthInfoResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: {
    accountId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: string;
    staffId?: string;
    rentalLocationId?: string;
    rentalLocation?: {
      rentalLocationId: string;
      name: string;
      address: string;
      city: string;
      country: string;
    };
    renterId?: string;
    address?: string;
    dateOfBirth?: Date;
    identityNumber?: string;
  };
}
