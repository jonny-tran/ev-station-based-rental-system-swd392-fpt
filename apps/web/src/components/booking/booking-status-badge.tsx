import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@packages";

interface BookingStatusBadgeProps {
  status: BookingStatus;
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

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <Badge className={`${getStatusColor(status)} font-medium`}>
      {getStatusText(status)}
    </Badge>
  );
}
