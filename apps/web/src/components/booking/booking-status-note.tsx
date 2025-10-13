import { BookingStatus } from "@packages";

interface BookingStatusNoteProps {
  status: BookingStatus;
  booking?: {
    startTime: string;
    endTime: string;
  }; // Optional to check the active time
}

export function BookingStatusNote({ status, booking }: BookingStatusNoteProps) {
  // Note for Pending
  if (status === BookingStatus.Pending) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium">
          Remember to bring your ID card and driver&apos;s license when you pick
          up the vehicle
        </p>
      </div>
    );
  }

  // Note for Confirmed if it's active
  if (status === BookingStatus.Confirmed && booking) {
    const isActive =
      new Date(booking.startTime) <= new Date() &&
      new Date(booking.endTime) > new Date();

    if (isActive) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">
            You are within the rental period
          </p>
        </div>
      );
    }
  }
  return null;
}
