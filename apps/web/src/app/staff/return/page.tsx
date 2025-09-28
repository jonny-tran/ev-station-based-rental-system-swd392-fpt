"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";

export default function StaffReturnPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">
            Trả xe (Danh sách xe sắp trả trong ngày)
          </h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
