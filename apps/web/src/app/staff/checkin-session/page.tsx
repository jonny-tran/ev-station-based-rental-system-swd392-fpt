"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";

export default function StaffCheckinSessionPage() {
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
            Phiên Check-in (Danh sách các check-in session đang mở hoặc vừa xử
            lý)
          </h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
