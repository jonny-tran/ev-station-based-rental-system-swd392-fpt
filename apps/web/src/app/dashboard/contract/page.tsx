"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FileText } from "lucide-react";

export default function ContractPage() {
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
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Hợp đồng</h1>
            <p className="text-muted-foreground">
              Quản lý các hợp đồng thuê xe điện
            </p>
          </div>

          {/* Coming Soon Content */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Trang hợp đồng đang được phát triển
            </h2>
            <p className="text-muted-foreground max-w-md">
              Tính năng quản lý hợp đồng sẽ sớm được ra mắt. Hãy quay lại sau!
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
