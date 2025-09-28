"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";

export default function StaffHistoryPage() {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Lịch sử giao - nhận" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Lịch sử giao - nhận (Log check-in/out đã hoàn tất)
          </h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
