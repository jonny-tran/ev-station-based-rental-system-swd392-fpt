import { BookingWithComputedFields } from "@packages";
import { BookingCard } from "@/components/booking/booking-card";

interface BookingListProps {
  bookings: BookingWithComputedFields[];
  onViewDetails: (bookingId: string) => void;
}

export function BookingList({ bookings, onViewDetails }: BookingListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.bookingId}
          booking={booking}
          vehicle={booking.vehicle}
          rentalLocation={booking.rentalLocation}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
