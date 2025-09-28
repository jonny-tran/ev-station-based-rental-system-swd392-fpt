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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Car, Eye } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  vehicle: Vehicle;
  rentalLocation: RentalLocation;
  onViewDetails: (bookingId: string) => void;
}

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.Pending:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case BookingStatus.Confirmed:
      return "bg-green-100 text-green-800 border-green-200";
    case BookingStatus.Completed:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case BookingStatus.Cancelled:
      return "bg-red-100 text-red-800 border-red-200";
    case BookingStatus.Expired:
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.Pending:
      return "Chờ xác nhận";
    case BookingStatus.Confirmed:
      return "Đã xác nhận";
    case BookingStatus.Completed:
      return "Hoàn thành";
    case BookingStatus.Cancelled:
      return "Đã hủy";
    case BookingStatus.Expired:
      return "Hết hạn";
    default:
      return status;
  }
};

export function BookingCard({
  booking,
  vehicle,
  rentalLocation,
  onViewDetails,
}: BookingCardProps) {
  // Logic cho button style và notes
  const shouldHighlightButton =
    booking.bookingStatus === BookingStatus.Pending ||
    booking.bookingStatus === BookingStatus.Confirmed;

  const shouldShowPendingNote = booking.bookingStatus === BookingStatus.Pending;
  const shouldShowActiveNote =
    booking.bookingStatus === BookingStatus.Confirmed;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {vehicle.brand} {vehicle.model}
          </CardTitle>
          <Badge
            className={`${getStatusColor(booking.bookingStatus)} font-medium`}
          >
            {getStatusText(booking.bookingStatus)}
          </Badge>
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
        {shouldShowPendingNote && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">
              📍 Nhớ mang theo CMND/CCCD và bằng lái xe khi đến lấy xe
            </p>
          </div>
        )}

        {shouldShowActiveNote && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              ✅ Đang trong thời gian thuê xe
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
