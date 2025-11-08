"use client";

import { useParams } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StepIndicator } from "@/components/staff/check-in/common/StepIndicator";
import { PaymentMethods } from "@/components/staff/check-in/process/step4/PaymentMethods";
import { PaymentSummary } from "@/components/staff/check-in/process/step4/PaymentSummary";
import { mockService } from "@/packages/services/mock-service";

export default function InspectionStep4Page() {
  const { inspectionId } = useParams<{ inspectionId: string }>();
  // Convert string to number since mockService expects number
  const inspectionIdNum = parseInt(inspectionId, 10);
  const inspection = isNaN(inspectionIdNum)
    ? undefined
    : mockService.getVehicleInspectionById(inspectionIdNum);
  const contractId = inspection?.contractId;

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Staff Home", href: "/staff" },
            { label: "Check-in Session", href: "/staff/checkin-session" },
            { label: "Step 4" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-2xl font-semibold">Step 4 – Payment</h1>
          <StepIndicator current={4} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PaymentMethods
                inspectionId={inspectionId}
                contractId={contractId}
              />
            </div>
            <div>
              <PaymentSummary contractId={contractId} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
