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
  const inspection = mockService.getVehicleInspectionById(inspectionId);
  const contractId = inspection?.contractId;

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Phiên Check-in", href: "/staff/checkin-session" },
            { label: "Bước 4" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-2xl font-semibold">Bước 4 – Thanh toán</h1>
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
