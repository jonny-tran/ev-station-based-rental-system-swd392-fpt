"use client";

import { Card } from "@/components/ui/card";
import { Contract } from "@/packages/types/contract";
import { RenterContractStatusBadge } from "./RenterContractStatusBadge";
import { RenterContractActions } from "./RenterContractActions";
import { useEffect, useState } from "react";
import { mockService } from "@/packages/services/mock-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  contract: Contract;
  renterId: string;
  onChanged?: (updated?: Contract) => void;
}

export function RenterContractCard({ contract, renterId, onChanged }: Props) {
  const [displayName, setDisplayName] = useState<string>("Bạn");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Hiển thị tiêu đề là tên Renter hoặc "Bạn"
    const renter = mockService.getRenterById(renterId || "");
    const account = renter
      ? mockService.getAccountById(renter.accountId)
      : undefined;
    setDisplayName(account?.fullName || "Bạn");
    setAvatarUrl(account?.avatarUrl);
  }, [renterId]);

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
            <span className="truncate">Mã HĐ: {contract.contractId}</span>
            <span className="hidden md:inline">•</span>
            <span>
              Ký: Renter {contract.signedByRenter ? "đã ký" : "chưa"} · Staff{" "}
              {contract.signedByStaff ? "đã ký" : "chưa"}
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              Cập nhật:{" "}
              {new Date(
                contract.updatedAt || contract.createdAt
              ).toLocaleString("vi-VN")}
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
