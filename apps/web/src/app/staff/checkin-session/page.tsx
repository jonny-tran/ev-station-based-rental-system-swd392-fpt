"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { mockService } from "@/packages/services/mock-service";
import { VehicleInspection } from "@/packages/types/vehicleInspection";
import { VehicleInspectionType } from "@/packages/types/enum";
import { CheckInSessionCard } from "@/components/staff/check-in/CheckInSessionCard";

function SessionCard({ inspection }: { inspection: VehicleInspection }) {
  return <CheckInSessionCard inspection={inspection} />;
}

export default function StaffCheckInSessionsPage() {
  const allInspections: VehicleInspection[] =
    mockService.getAllVehicleInspections();
  const checkInSessions = allInspections.filter(
    (x) => x.inspectionType === VehicleInspectionType.CheckIn
  );

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Phiên Check-in" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Danh sách phiên Check-in
          </h1>

          <div className="space-y-3">
            {checkInSessions.map((s) => (
              <SessionCard key={s.inspectionId} inspection={s} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
