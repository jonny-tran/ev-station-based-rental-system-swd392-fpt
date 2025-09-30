"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { mockService } from "@/packages/services/mock-service";
import { ReturnSessionCard } from "@/components/staff/check-out/ReturnSessionCard";

export default function StaffReturnPage() {
  const inspections = mockService
    .getAllVehicleInspections()
    .filter((i) => i.inspectionType === "CheckOut")
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Trả xe" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý trả xe</h1>

          <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              {inspections.length} phiên trả xe
            </div>
            {inspections.map((insp) => (
              <ReturnSessionCard key={insp.inspectionId} inspection={insp} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
