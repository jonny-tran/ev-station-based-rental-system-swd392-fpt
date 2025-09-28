import { Booking, Vehicle, RentalLocation } from "@packages";
import { BookingCard } from "@/components/booking/booking-card";

interface BookingListProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  rentalLocations: RentalLocation[];
  onViewDetails: (bookingId: string) => void;
}

export function BookingList({
  bookings,
  vehicles,
  rentalLocations,
  onViewDetails,
}: BookingListProps) {
  const getVehicleById = (vehicleId: string) =>
    vehicles.find((v) => v.vehicleId === vehicleId);
  const getRentalLocationById = (locationId: string) =>
    rentalLocations.find((l) => l.locationId === locationId);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => {
        const vehicle = getVehicleById(booking.vehicleId);
        const rentalLocation = getRentalLocationById(booking.rentalLocationId);

        if (!vehicle || !rentalLocation) return null;

        return (
          <BookingCard
            key={booking.bookingId}
            booking={booking}
            vehicle={vehicle}
            rentalLocation={rentalLocation}
            onViewDetails={onViewDetails}
          />
        );
      })}
    </div>
  );
}
