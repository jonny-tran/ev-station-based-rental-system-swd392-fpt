import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking, formatCurrency } from "@packages";

interface BookingPaymentInfoProps {
  booking: Booking;
}

export function BookingPaymentInfo({ booking }: BookingPaymentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tiền cần thanh toán</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(booking.depositAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Phí thuê xe</span>
            <span className="text-sm text-muted-foreground">
              Thanh toán tại địa điểm nhận và lấy xe
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
