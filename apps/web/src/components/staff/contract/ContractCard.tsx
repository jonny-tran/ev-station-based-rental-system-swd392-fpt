"use client";

import { Card } from "@/components/ui/card";
import { ContractListItem } from "@/packages/types/contract/contract-api";
import { ContractStatusBadge } from "./ContractStatusBadge";
import { ContractActions } from "./ContractActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  contract: ContractListItem;
  onChanged?: () => void;
}

export function ContractCard({ contract, onChanged }: Props) {
  const renterName = contract.renterName || "Customer";
  const renterInitials = renterName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="px-4 py-3 group hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{renterInitials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="truncate font-semibold text-base">{renterName}</div>
            <ContractStatusBadge status={contract.status} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="truncate">Contract ID: {contract.contractId}</span>
            <span className="hidden md:inline">•</span>
            <span>
              Signed: Renter {contract.signedByRenter ? "yes" : "no"} · Staff{" "}
              {contract.signedByStaff ? "yes" : "no"}
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              Updated:{" "}
              {new Date(contract.updatedAt || contract.createdAt).toLocaleString(
                "en-US"
              )}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <ContractActions contract={contract} onChanged={onChanged} />
        </div>
      </div>
    </Card>
  );
}