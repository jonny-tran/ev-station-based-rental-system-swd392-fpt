import {
  BookingWithComputedFields,
  BookingVehicleInfo,
  BookingRentalLocationInfo,
  BookingStatus,
  formatCurrency,
  toLocal,
} from "@packages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Eye } from "lucide-react";
import { BookingStatusBadge } from "@/components/booking/booking-status-badge";
import { BookingStatusNote } from "@/components/booking/booking-status-note";

interface BookingCardProps {
  booking: BookingWithComputedFields;
  vehicle: BookingVehicleInfo;
  rentalLocation: BookingRentalLocationInfo;
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
    booking.status === BookingStatus.Pending ||
    booking.status === BookingStatus.Confirmed;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {vehicle.name}
          </CardTitle>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          License plate: {vehicle.licensePlate}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Time information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Rental time:</span>
          </div>
          <div className="pl-6 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3 text-green-600" />
              <span>Start: {toLocal(booking.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3 text-red-600" />
              <span>End: {toLocal(booking.endTime)}</span>
            </div>
          </div>
        </div>

        {/* Location information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Location:</span>
          </div>
          <p className="pl-6 text-sm text-muted-foreground">
            {rentalLocation.name}
          </p>
          <p className="pl-6 text-xs text-muted-foreground">
            {rentalLocation.address}
          </p>
        </div>

        {/* Amount to pay */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total amount:</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(booking.totalAmount)}
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
            View details
          </Button>
        </div>

        {/* Special note */}
        <BookingStatusNote status={booking.status} booking={booking} />
      </CardContent>
    </Card>
  );
}
