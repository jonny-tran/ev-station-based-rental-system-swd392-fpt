import { BookingStatus, Booking } from "@packages";

interface BookingStatusNoteProps {
  status: BookingStatus;
  booking?: Booking; // Optional để check thời gian active
}

export function BookingStatusNote({ status, booking }: BookingStatusNoteProps) {
  // Note cho Pending
  if (status === BookingStatus.Pending) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium">
          📍 Nhớ mang theo CMND/CCCD và bằng lái xe khi đến lấy xe
        </p>
      </div>
    );
  }

  // Note cho Confirmed nếu đang active
  if (status === BookingStatus.Confirmed && booking) {
    const isActive =
      new Date(booking.startTime) <= new Date() &&
      new Date(booking.endTime) > new Date();

    if (isActive) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">
            ✅ Đang trong thời gian thuê xe
          </p>
        </div>
      );
    }
  }

  // Không hiển thị note cho các trạng thái khác
  return null;
}
