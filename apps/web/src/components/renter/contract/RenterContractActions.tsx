"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Contract } from "@/packages/types/contract";
import { ContractStatus } from "@/packages/types/enum";
import { mockService } from "@/packages/services/mock-service";
import { useTransition } from "react";

interface Props {
  contract: Contract;
  onChanged?: (updated?: Contract) => void;
}

export function RenterContractActions({ contract, onChanged }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleRenterSign = () => {
    startTransition(() => {
      const updated = mockService.signContractByRenter(contract.contractId);
      onChanged?.(updated);
    });
  };

  switch (contract.status) {
    case ContractStatus.Active: {
      if (!contract.signedByRenter) {
        return (
          <Button size="sm" onClick={handleRenterSign} disabled={isPending}>
            Ký kết
          </Button>
        );
      }
      if (contract.signedByRenter && !contract.signedByStaff) {
        return (
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
              Xem chi tiết
            </Link>
          </Button>
        );
      }
      if (contract.signedByRenter && contract.signedByStaff) {
        return (
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
              Xem chi tiết
            </Link>
          </Button>
        );
      }
      return null;
    }

    case ContractStatus.Completed:
    case ContractStatus.Terminated:
    case ContractStatus.Voided:
      return (
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
            Xem chi tiết
          </Link>
        </Button>
      );

    default:
      // Draft không hiển thị ở danh sách renter theo spec, nhưng fallback nếu có
      return (
        <Button asChild size="sm" variant="secondary">
          <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
            Xem chi tiết
          </Link>
        </Button>
      );
  }
}
