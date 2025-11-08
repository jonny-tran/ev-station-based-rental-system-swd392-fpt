"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Contract } from "@/packages/types/contract";
import { ContractStatus } from "@/packages/types/enum";
import { ContractService } from "@/packages/services/contract.service";
import { useTransition, useState } from "react";
import { ContractApiError } from "@/packages/types/contract/contract-api";
import { toast } from "@/lib/toast";

interface Props {
  contract: Contract;
  onChanged?: (updated?: Contract) => void;
}

export function RenterContractActions({ contract, onChanged }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleRenterSign = () => {
    startTransition(async () => {
      try {
        setError("");
        const response = await ContractService.renterSignContract(
          contract.contractId
        );

        if (response.data) {
          // Update contract with new status
          const updatedContract: Contract = {
            ...contract,
            signedByRenter: response.data.signedByRenter,
            signedByStaff: response.data.signedByStaff,
            status: response.data.status,
            signedAt: response.data.signedAt,
            updatedAt: response.data.updatedAt,
          };

          toast.success("Contract signed successfully");
          onChanged?.(updatedContract);
        }
      } catch (err) {
        const errorMessage =
          err instanceof ContractApiError
            ? err.message
            : "Failed to sign contract. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error signing contract:", err);
      }
    });
  };

  switch (contract.status) {
    case ContractStatus.Active: {
      if (!contract.signedByRenter) {
        return (
          <Button size="sm" onClick={handleRenterSign} disabled={isPending}>
            {isPending ? "Signing..." : "Sign"}
          </Button>
        );
      }
      if (contract.signedByRenter && !contract.signedByStaff) {
        return (
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
              View Details
            </Link>
          </Button>
        );
      }
      if (contract.signedByRenter && contract.signedByStaff) {
        return (
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
              View Details
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
            View Details
          </Link>
        </Button>
      );

    default:
      // Draft contracts are not shown in renter list per spec, but fallback if needed
      return (
        <Button asChild size="sm" variant="secondary">
          <Link href={`/dashboard/contract/${contract.contractId}/detail`}>
            View Details
          </Link>
        </Button>
      );
  }
}

