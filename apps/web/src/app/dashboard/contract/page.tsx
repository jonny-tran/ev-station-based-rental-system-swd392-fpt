"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RenterContractList } from "@/components/renter/contract/RenterContractList";

export default function ContractPage() {
  // Demo: giả sử renter đang đăng nhập có id r-1
  const renterId = "r-1";
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chủ", href: "/dashboard" },
            { label: "Hợp đồng" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Hợp đồng</h1>
            <p className="text-muted-foreground">
              Quản lý các hợp đồng thuê xe điện
            </p>
          </div>

          <RenterContractList renterId={renterId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
