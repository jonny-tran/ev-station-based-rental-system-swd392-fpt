"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { StaffOnly } from "@/components/protected-route";

export default function StaffPage() {
  return (
    <StaffOnly>
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader crumbs={[{ label: "Trang chính Staff" }]} />

          <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
            <h1 className="text-3xl font-bold tracking-tight">
              Chào mừng đến với Staff Dashboard
            </h1>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </StaffOnly>
  );
}
