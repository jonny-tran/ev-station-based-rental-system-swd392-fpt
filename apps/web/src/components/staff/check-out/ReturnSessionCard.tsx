"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockService } from "@/packages/services/mock-service";
import { VehicleInspection } from "@/packages/types/vehicleInspection";
import { Booking } from "@/packages/types/booking";
import { Vehicle } from "@/packages/types/vehicle";
import { Renter } from "@/packages/types/renter";
import { Account } from "@/packages/types/account";
import { VehicleInspectionStatus } from "@/packages/types/enum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { InspectionStatusBadge } from "@/components/staff/check-in/common/InspectionStatusBadge";

const formatDateTime = (iso: string) =>
  format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: vi });

function StatusBadge({ status }: { status: VehicleInspectionStatus }) {
  return <InspectionStatusBadge status={status} />;
}

function getRelatedEntities(inspection: VehicleInspection) {
  const booking: Booking | undefined = mockService.getBookingById(
    inspection.bookingId
  );
  const vehicle: Vehicle | undefined = booking
    ? mockService.getVehicleById(booking.vehicleId)
    : undefined;
  const renter: Renter | undefined = booking
    ? mockService.getRenterById(booking.renterId)
    : undefined;
  const account: Account | undefined = renter
    ? mockService.getAccountById(renter.accountId)
    : undefined;

  return { booking, vehicle, renter, account };
}

function buildDisplayTexts(
  inspection: VehicleInspection,
  deps: {
    booking?: Booking;
    vehicle?: Vehicle;
    renter?: Renter;
    account?: Account;
  }
) {
  const { booking, vehicle, renter, account } = deps;

  const vehicleText = vehicle
    ? `${vehicle.brand} ${vehicle.model} • ${vehicle.licensePlate}`
    : "Xe không xác định";

  const renterText = account
    ? `Khách: ${account.fullName}`
    : renter
      ? `Khách: ${renter.identityNumber}`
      : "Khách hàng";

  const rentalTime = booking
    ? `${formatDateTime(booking.startTime)} - ${formatDateTime(booking.endTime)}`
    : formatDateTime(inspection.inspectionAt);

  return { vehicleText, renterText, rentalTime };
}

export function ReturnSessionCard({
  inspection,
}: {
  inspection: VehicleInspection;
}) {
  const deps = getRelatedEntities(inspection);
  const { vehicleText, renterText, rentalTime } = buildDisplayTexts(
    inspection,
    deps
  );
  const isPending = inspection.status === VehicleInspectionStatus.Pending;

  function InfoSection() {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="font-semibold truncate">{vehicleText}</div>
          <StatusBadge status={inspection.status} />
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
    return (
      <div className="w-44 shrink-0 flex items-center">
        {isPending ? (
          <Button asChild className="w-full">
            <Link href={`/staff/return/${inspection.inspectionId}`}>
              Tiếp tục trả xe
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/staff/return/${inspection.inspectionId}`}>
              Xem chi tiết
            </Link>
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
