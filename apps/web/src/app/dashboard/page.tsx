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
          <PageHeader crumbs={[{ label: "Dashboard" }]} />

          <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to EV Rental System
              </h1>
              <p className="text-muted-foreground">
                Smart and convenient electric vehicle rental system
              </p>
            </div>

            {/* Welcome Content */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Car className="h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to EV Rental System!
              </h2>
              <p className="text-muted-foreground max-w-md">
                Modern electric vehicle rental system that helps you easily book
                vehicles, track bookings, and manage rental contracts
                conveniently.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RenterOnly>
  );
}
