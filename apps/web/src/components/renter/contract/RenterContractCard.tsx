"use client";

import { Card } from "@/components/ui/card";
import { Contract } from "@/packages/types/contract";
import { RenterContractStatusBadge } from "./RenterContractStatusBadge";
import { RenterContractActions } from "./RenterContractActions";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  contract: Contract;
  renterId: string;
  onChanged?: (updated?: Contract) => void;
}

export function RenterContractCard({ contract, renterId, onChanged }: Props) {
  const { user } = useAuthStore();
  const displayName = user?.fullName || "You";
  const avatarUrl = undefined; // TODO: Add avatar URL to user object if needed

  return (
    <Card className="px-4 py-3 group hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>
            {displayName
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="truncate font-semibold text-base">
              {displayName}
            </div>
            <RenterContractStatusBadge status={contract.status} />
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
              {new Date(
                contract.updatedAt || contract.createdAt
              ).toLocaleString("en-US")}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <RenterContractActions contract={contract} onChanged={onChanged} />
        </div>
      </div>
    </Card>
  );
}

