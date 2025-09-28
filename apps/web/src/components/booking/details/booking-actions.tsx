import { Button } from "@/components/ui/button";
import { BookingStatus } from "@packages";

interface BookingActionsProps {
  bookingStatus: BookingStatus;
  onBack: () => void;
  onCancel?: () => void;
}

export function BookingActions({
  bookingStatus,
  onBack,
  onCancel,
}: BookingActionsProps) {
  const shouldShowCancelButton =
    bookingStatus === BookingStatus.Pending ||
    bookingStatus === BookingStatus.Confirmed;

  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button variant="outline" onClick={onBack}>
        Quay lại Dashboard
      </Button>
      {shouldShowCancelButton && (
        <Button variant="destructive" onClick={onCancel}>
          Hủy booking
        </Button>
      )}
    </div>
  );
}
