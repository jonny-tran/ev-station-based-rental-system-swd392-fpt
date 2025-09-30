"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Contract } from "@/packages/types/contract";
import { ContractStatus } from "@/packages/types/enum";
import { mockService } from "@/packages/services/mock-service";
import { useTransition } from "react";
import { useMemo } from "react";

interface Props {
  contract: Contract;
  onChanged?: (updated?: Contract) => void;
}

export function ContractActions({ contract, onChanged }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleStaffSign = () => {
    startTransition(() => {
      const updated = mockService.signContractByStaff(contract.contractId);
      onChanged?.(updated);
    });
  };

  const checkInLink = useMemo(() => {
    if (contract.status !== ContractStatus.Draft) return undefined;
    // Tìm phiên Check-in liên quan để tiếp tục soạn HĐ (step 3)
    const insp = mockService.getCheckInSessionByBookingOrContract({
      bookingId: contract.bookingId,
      contractId: contract.contractId,
    });
    if (!insp) return undefined;
    return `/staff/checkin-session/${insp.inspectionId}/step3`;
  }, [contract]);

  // Refactor: dùng switch để dễ đọc và maintain
  switch (contract.status) {
    case ContractStatus.Draft:
      return checkInLink ? (
        <Button asChild size="sm">
          <Link href={checkInLink}>Tiếp tục soạn</Link>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline">
          <Link href={`/staff/contract/${contract.contractId}/detail`}>
            Xem chi tiết
          </Link>
        </Button>
      );

    case ContractStatus.Active:
      if (!contract.signedByRenter) {
        return (
          <Button size="sm" disabled>
            Đang đợi khách hàng ký
          </Button>
        );
      }
      if (contract.signedByRenter && !contract.signedByStaff) {
        return (
          <Button size="sm" onClick={handleStaffSign} disabled={isPending}>
            Ký kết
          </Button>
        );
      }
      if (contract.signedByRenter && contract.signedByStaff) {
        return (
          <Button size="sm" disabled>
            Đã ký đủ
          </Button>
        );
      }
      return null;

    case ContractStatus.Completed:
    case ContractStatus.Terminated:
    case ContractStatus.Voided:
      return (
        <Button asChild size="sm" variant="outline">
          <Link href={`/staff/contract/${contract.contractId}/detail`}>
            Xem chi tiết
          </Link>
        </Button>
      );

    default:
      return (
        <Button asChild size="sm" variant="secondary">
          <Link href={`/staff/contract/${contract.contractId}/detail`}>
            Xem chi tiết
          </Link>
        </Button>
      );
  }
}
