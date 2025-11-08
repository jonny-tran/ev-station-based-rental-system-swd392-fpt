"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckInSessionListItem,
  InspectionStatus,
} from "@/packages/types/checkin";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { InspectionStatusBadge } from "@/components/staff/check-in/common/InspectionStatusBadge";

const formatDateTime = (iso: string) =>
  format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: vi });

function StatusBadge({ status }: { status: InspectionStatus }) {
  return <InspectionStatusBadge status={status} />;
}

// Removed getRelatedEntities function as we now use data directly from API

function buildDisplayTexts(session: CheckInSessionListItem) {
  const vehicleText = session.vehicle
    ? `${session.vehicle.brand} ${session.vehicle.model} • ${session.vehicle.licensePlate}`
    : "Unknown Vehicle";

  const renterText = session.renter
    ? `Customer: ${session.renter.fullName}`
    : "Customer";

  const rentalTime = session.booking
    ? `${formatDateTime(session.booking.startTime)} - ${formatDateTime(session.booking.endTime)}`
    : "Unknown Time";

  return { vehicleText, renterText, rentalTime };
}

export function CheckInSessionCard({
  session,
}: {
  session: CheckInSessionListItem;
}) {
  const { vehicleText, renterText, rentalTime } = buildDisplayTexts(session);
  const isPending = session.status === "Pending";

  function InfoSection() {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="font-semibold truncate">{vehicleText}</div>
          <StatusBadge status={session.status} />
        </div>
        <div className="mt-1 text-sm text-muted-foreground truncate">
          {rentalTime}
        </div>
        <div className="mt-1 text-sm text-muted-foreground truncate">
          {renterText}
        </div>
      </div>
    );
  }

  function ActionSection() {
    // Determine the appropriate URL based on status and currentStep
    const getActionUrl = () => {
      if (isPending && session.currentStep) {
        // Link directly to the current step for pending sessions
        const step = session.currentStep;
        if (step >= 1 && step <= 5) {
          return `/staff/checkin-session/${session.inspectionId}/step${step}`;
        }
        // Fallback to step1 if step is invalid
        return `/staff/checkin-session/${session.inspectionId}/step1`;
      }
      // For non-pending sessions, go to detail page (which will handle redirect if needed)
      return `/staff/checkin-session/detail/${session.inspectionId}`;
    };

    const getActionLabel = () => {
      if (isPending) {
        if (session.currentStep && session.currentStep > 1) {
          return `Continue Step ${session.currentStep}`;
        }
        return "Continue Check-in";
      }
      return "View Details";
    };

    return (
      <div className="w-44 shrink-0 flex items-center">
        {isPending ? (
          <Button asChild className="w-full">
            <Link href={getActionUrl()}>{getActionLabel()}</Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href={getActionUrl()}>{getActionLabel()}</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full p-4 hover:shadow-sm transition bg-background border">
      <div className="flex items-start justify-between gap-4">
        <InfoSection />
        <ActionSection />
      </div>
    </Card>
  );
}
