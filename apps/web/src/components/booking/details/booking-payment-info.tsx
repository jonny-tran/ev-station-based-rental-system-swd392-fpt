import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@packages";
import { BookingDetailsResponse } from "@/packages/types/booking";

interface BookingPaymentInfoProps {
  booking: BookingDetailsResponse;
}

export function BookingPaymentInfo({ booking }: BookingPaymentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Amount to pay</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(booking.depositAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Rental fee</span>
            <span className="text-sm text-muted-foreground">
              Payment at the rental location
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
