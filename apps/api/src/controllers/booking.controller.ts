import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BookingService, JwtPayload } from '../services/booking.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('all')
  async getAllBookings(@Request() req: any) {
    const user: JwtPayload = req.user;
    return this.bookingService.findAll(user);
  }

  @Get('details/:bookingId')
  async getBookingDetails(
    @Param('bookingId') bookingId: string,
    @Request() req: any,
  ) {
    const user: JwtPayload = req.user;
    return this.bookingService.findById(bookingId, user);
  }
}
