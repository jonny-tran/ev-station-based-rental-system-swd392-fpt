"use client";

import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { ContractList } from "@/components/staff/contract/ContractList";

export default function StaffContractPage() {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Staff Home", href: "/staff" },
            { label: "Contracts" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Contracts (Electric Vehicle Rental Management)
          </h1>
          <ContractList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
