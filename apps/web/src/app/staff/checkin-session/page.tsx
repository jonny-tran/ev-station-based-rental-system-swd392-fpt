"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { CheckInSessionList } from "@/components/staff/check-in/CheckInSessionList";

export default function StaffCheckInSessionsPage() {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Staff Dashboard", href: "/staff" },
            { label: "Check-in Sessions" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Check-in Sessions List
          </h1>

          <CheckInSessionList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
