"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { Car } from "lucide-react";
import { RenterOnly } from "@/components/protected-route";

export default function DashboardPage() {
  return (
    <RenterOnly>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <PageHeader crumbs={[{ label: "Trang chủ" }]} />

          <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Chào mừng đến với EV Rental System
              </h1>
              <p className="text-muted-foreground">
                Hệ thống thuê xe điện thông minh và tiện lợi
              </p>
            </div>

            {/* Welcome Content */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Car className="h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Chào mừng bạn đến với EV Rental System!
              </h2>
              <p className="text-muted-foreground max-w-md">
                Hệ thống thuê xe điện hiện đại, giúp bạn dễ dàng đặt xe, theo
                dõi booking và quản lý hợp đồng thuê xe một cách tiện lợi.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RenterOnly>
  );
}
