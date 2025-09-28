import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, FileText } from "lucide-react";
import { Booking, toLocal } from "@packages";

interface BookingTimeInfoProps {
  booking: Booking;
}

export function BookingTimeInfo({ booking }: BookingTimeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Thời gian thuê
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium">Bắt đầu</p>
            <p className="text-sm text-muted-foreground">
              {toLocal(booking.startTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-red-600" />
          <div>
            <p className="text-sm font-medium">Kết thúc</p>
            <p className="text-sm text-muted-foreground">
              {toLocal(booking.endTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Ngày đặt</p>
            <p className="text-sm text-muted-foreground">
              {toLocal(booking.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
