"use client";

import { Badge } from "@/components/ui/badge";
import {
  InspectionStatus,
  INSPECTION_STATUS_OPTIONS,
} from "@/packages/types/checkin";

export function InspectionStatusBadge({
  status,
}: {
  status: InspectionStatus;
}) {
  const statusOption = INSPECTION_STATUS_OPTIONS.find(
    (option) => option.value === status
  );
  const label = statusOption?.label || "Undefined";

  switch (status) {
    case "Approved":
      return <Badge className="bg-green-100 text-green-800">{label}</Badge>;
    case "Completed":
      return <Badge className="bg-emerald-100 text-emerald-800">{label}</Badge>;
    case "Rejected":
      return <Badge className="bg-red-100 text-red-800">{label}</Badge>;
    case "Pending":
    default:
      return <Badge className="bg-yellow-100 text-yellow-800">{label}</Badge>;
  }
}
