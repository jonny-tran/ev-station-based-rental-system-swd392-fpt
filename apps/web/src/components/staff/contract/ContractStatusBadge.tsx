"use client";

import { Badge } from "@/components/ui/badge";
import { ContractStatus } from "@/packages/types/enum";

interface Props {
  status: ContractStatus;
}

export function ContractStatusBadge({ status }: Props) {
  const map: Record<
    ContractStatus,
    {
      label: string;
      variant?: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    [ContractStatus.Draft]: { label: "Nháp", variant: "outline" },
    [ContractStatus.Active]: { label: "Đang kích hoạt", variant: "default" },
    [ContractStatus.Completed]: { label: "Hoàn tất", variant: "secondary" },
    [ContractStatus.Terminated]: { label: "Chấm dứt", variant: "destructive" },
    [ContractStatus.Voided]: { label: "Hủy", variant: "destructive" },
  };

  const meta = map[status] || { label: String(status), variant: "secondary" };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
