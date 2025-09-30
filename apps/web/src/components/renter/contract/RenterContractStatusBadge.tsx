"use client";

import { ContractStatus } from "@/packages/types/enum";
import { ContractStatusBadge } from "@/components/staff/contract/ContractStatusBadge";

interface Props {
  status: ContractStatus;
}

// Reuse Staff badge to keep style consistent
export function RenterContractStatusBadge({ status }: Props) {
  return <ContractStatusBadge status={status} />;
}
