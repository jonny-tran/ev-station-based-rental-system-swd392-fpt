"use client";

import {
  Booking,
  Vehicle,
  RentalLocation,
  BookingStatus,
  formatCurrency,
  toLocal,
} from "@packages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Car, Eye } from "lucide-react";
import { BookingStatusBadge } from "@/components/booking/booking-status-badge";
import { BookingStatusNote } from "@/components/booking/booking-status-note";

interface BookingCardProps {
  booking: Booking;
  vehicle: Vehicle;
  rentalLocation: RentalLocation;
  onViewDetails: (bookingId: string) => void;
}

export function BookingCard({
  booking,
  vehicle,
  rentalLocation,
  onViewDetails,
}: BookingCardProps) {
  // Logic cho button style
  const shouldHighlightButton =
    booking.bookingStatus === BookingStatus.Pending ||
    booking.bookingStatus === BookingStatus.Confirmed;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {vehicle.brand} {vehicle.model}
          </CardTitle>
          <BookingStatusBadge status={booking.bookingStatus} />
        </div>
        <p className="text-sm text-muted-foreground">
          Biển số: {vehicle.licensePlate}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Thông tin thời gian */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Thời gian thuê:</span>
          </div>
          <div className="pl-6 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3 text-green-600" />
              <span>Bắt đầu: {toLocal(booking.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3 text-red-600" />
              <span>Kết thúc: {toLocal(booking.endTime)}</span>
            </div>
          </div>
        </div>

        {/* Thông tin địa điểm */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Địa điểm:</span>
          </div>
          <p className="pl-6 text-sm text-muted-foreground">
            {rentalLocation.name}
          </p>
          <p className="pl-6 text-xs text-muted-foreground">
            {rentalLocation.address}, {rentalLocation.city}
          </p>
        </div>

        {/* Thông tin xe */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Thông tin xe:</span>
          </div>
          <div className="pl-6 space-y-1 text-sm text-muted-foreground">
            <p>Năm sản xuất: {vehicle.year}</p>
            <p>
              Pin: {vehicle.batteryLevel}% ({vehicle.batteryCapacity}Wh)
            </p>
            <p>Km đã đi: {vehicle.odometerKm.toLocaleString()} km</p>
          </div>
        </div>

        {/* Thông tin tiền cần thanh toán */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tiền cần thanh toán:</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(booking.depositAmount)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-2">
          <Button
            onClick={() => onViewDetails(booking.bookingId)}
            className="w-full"
            variant={shouldHighlightButton ? "default" : "outline"}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>

        {/* Thông báo đặc biệt */}
        <BookingStatusNote status={booking.bookingStatus} booking={booking} />
      </CardContent>
    </Card>
  );
}
