"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RenterContractList } from "@/components/renter/contract/RenterContractList";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContractPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated or not a renter
    if (!user || user.role !== "Renter") {
      router.push("/login");
    }
  }, [user, router]);

  // Don't render if user is not a renter
  if (!user || user.role !== "Renter" || !user.renterId) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Home", href: "/dashboard" },
            { label: "Contracts" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
            <p className="text-muted-foreground">
              Manage your electric vehicle rental contracts
            </p>
          </div>

          <RenterContractList renterId={user.renterId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

