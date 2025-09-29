"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StepIndicator } from "@/components/staff/check-in/process/StepIndicator";

export default function InspectionStep3Page() {
  const { inspectionId } = useParams<{ inspectionId: string }>();

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Phiên Check-in", href: "/staff/checkin-session" },
            { label: "Bước 3" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-2xl font-semibold">Bước 3 – Ký hợp đồng</h1>
          <StepIndicator current={3} />
          <div className="flex items-center justify-end gap-3">
            <Button asChild variant="outline">
              <Link href={`/staff/checkin-session/${inspectionId}/step2`}>
                Quay lại bước 2
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/staff/checkin-session/${inspectionId}/step4`}>
                Tiếp tục bước 4
              </Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
