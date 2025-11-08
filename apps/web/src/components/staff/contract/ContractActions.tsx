"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContractListItem } from "@/packages/types/contract/contract-api";
import { ContractStatus } from "@/packages/types/contract/contract-status";
import { useContractActions } from "@/stores/contract.store";
import { useTransition } from "react";
import { useMemo } from "react";

interface Props {
  contract: ContractListItem;
  onChanged?: () => void;
}

export function ContractActions({ contract, onChanged }: Props) {
  const [isPending, startTransition] = useTransition();
  const { staffSignContract } = useContractActions();

  const handleStaffSign = () => {
    startTransition(async () => {
      try {
        await staffSignContract(contract.contractId);
        onChanged?.();
      } catch (error) {
        console.error("Error signing contract:", error);
      }
    });
  };

  const checkInLink = useMemo(() => {
    if (contract.status !== ContractStatus.Draft) return undefined;
    // Link to step 3 of check-in session
    // Note: We need to find the inspection ID from booking ID
    // For now, return a placeholder link
    // TODO: Get inspection ID from booking ID
    return `/staff/checkin-session/${contract.bookingId}/step3`;
  }, [contract]);

  // Refactor: use switch for better readability and maintainability
  switch (contract.status) {
    case ContractStatus.Draft:
      return checkInLink ? (
        <Button asChild size="sm">
          <Link href={checkInLink}>Continue Editing</Link>
        </Button>
      ) : (
        <Button size="sm" variant="outline" disabled>
          Draft
        </Button>
      );

    case ContractStatus.Active:
      if (!contract.signedByRenter) {
        return (
          <Button size="sm" disabled>
            Waiting for Renter
          </Button>
        );
      }
      if (contract.signedByRenter && !contract.signedByStaff) {
        return (
          <Button size="sm" onClick={handleStaffSign} disabled={isPending}>
            Sign Contract
          </Button>
        );
      }
      if (contract.signedByRenter && contract.signedByStaff) {
        return (
          <Button size="sm" disabled>
            Fully Signed
          </Button>
        );
      }
      return null;

    case ContractStatus.Completed:
      return (
        <Button size="sm" variant="outline" disabled>
          Completed
        </Button>
      );

    case ContractStatus.Terminated:
    case ContractStatus.Voided:
      return (
        <Button size="sm" variant="outline" disabled>
          {contract.status === ContractStatus.Terminated
            ? "Terminated"
            : "Voided"}
        </Button>
      );

    default:
      return (
        <Button size="sm" variant="secondary" disabled>
          {contract.status}
        </Button>
      );
  }
}
