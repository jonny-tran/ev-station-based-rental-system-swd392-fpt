import { Calendar } from "lucide-react";
import { BookingStatus } from "@packages";

interface BookingEmptyStateProps {
  filterStatus: BookingStatus | "all";
}

export function BookingEmptyState({ filterStatus }: BookingEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">Không có booking nào</h3>
      <p className="text-muted-foreground">
        {filterStatus === "all"
          ? "Bạn chưa có booking nào. Hãy đặt xe ngay!"
          : "Không có booking nào với trạng thái đã chọn."}
      </p>
    </div>
  );
}
