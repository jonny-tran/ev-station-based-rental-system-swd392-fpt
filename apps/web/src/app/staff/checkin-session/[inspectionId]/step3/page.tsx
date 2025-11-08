"use client";

import { useParams } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StepIndicator } from "@/components/staff/check-in/common/StepIndicator";
import { ContractSigningStep } from "@/components/staff/check-in/process/step3/ContractSigningStep";

export default function InspectionStep3Page() {
  const { inspectionId } = useParams<{ inspectionId: string }>();

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Staff Home", href: "/staff" },
            { label: "Check-in Session", href: "/staff/checkin-session" },
            { label: "Step 3" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-2xl font-semibold">Step 3 – Contract Signing</h1>

          <StepIndicator current={3} />

          <ContractSigningStep inspectionId={inspectionId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
