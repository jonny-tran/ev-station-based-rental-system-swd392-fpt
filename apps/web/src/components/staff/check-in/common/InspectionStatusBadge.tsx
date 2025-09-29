"use client";

import { Badge } from "@/components/ui/badge";
import { VehicleInspectionStatus } from "@/packages/types/enum";

export function InspectionStatusBadge({
  status,
}: {
  status: VehicleInspectionStatus;
}) {
  switch (status) {
    case VehicleInspectionStatus.Approved:
      return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
    case VehicleInspectionStatus.Rejected:
      return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
    case VehicleInspectionStatus.Pending:
    default:
      return <Badge className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>;
  }
}
