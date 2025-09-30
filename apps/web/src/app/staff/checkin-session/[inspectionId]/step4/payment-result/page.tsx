"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentResultPage() {
  const params = useSearchParams();
  const status = params.get("status") ?? "success";
  const method = params.get("method") ?? "";

  const isSuccess = status === "success";

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
          <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-lg border p-8 text-center">
            {isSuccess ? (
              <CheckCircle2 className="text-green-600" size={48} />
            ) : (
              <XCircle className="text-red-600" size={48} />
            )}
            <h1 className="text-2xl font-semibold">
              {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
            </h1>
            <p className="text-muted-foreground">
              Phương thức: <span className="font-medium">{method}</span>
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Button asChild>
                <Link href={`/staff`}>Về trang chủ Staff</Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
