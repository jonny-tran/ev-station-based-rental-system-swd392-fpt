import { BookingStatus } from "@packages";
import { Empty } from "@/components/ui/empty";

interface BookingEmptyStateProps {
  filterStatus: BookingStatus | "all";
}

export function BookingEmptyState({ filterStatus }: BookingEmptyStateProps) {
  return (
    <div className="col-span-full">
      <Empty
        title="No booking found"
        content={
          filterStatus === "all"
            ? "You don't have any booking. Please book a vehicle now!"
            : "No booking found with the selected status."
        }
      />
    </div>
  );
}
