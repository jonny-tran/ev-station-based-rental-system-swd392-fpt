import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { BookingStatus } from "@packages";

interface BookingStatusNoteProps {
  status: BookingStatus;
}

export function BookingStatusNote({ status }: BookingStatusNoteProps) {
  // Chỉ hiển thị note cho trạng thái Pending
  if (status !== BookingStatus.Pending) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Chuyến đi sắp tới</h3>
        </div>
        <p className="text-sm text-blue-800 mt-1">
          Nhớ mang theo CMND/CCCD và bằng lái xe khi đến lấy xe
        </p>
      </CardContent>
    </Card>
  );
}
