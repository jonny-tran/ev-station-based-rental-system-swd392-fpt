"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { mockService } from "@/packages/services/mock-service";
import { useMemo } from "react";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();

  // Lấy paymentId từ URL params hoặc search params
  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");
  const method = searchParams.get("method") ?? "";
  const returnPath = searchParams.get("return") ?? "/staff";

  const paymentRecord = useMemo(() => {
    if (paymentId) {
      return mockService.getPaymentById(paymentId);
    }
    return null;
  }, [paymentId]);

  // Xác định trạng thái thanh toán
  const isSuccess = useMemo(() => {
    if (status) {
      return status === "success";
    }
    if (paymentRecord) {
      return paymentRecord.status === "Paid";
    }
    return false;
  }, [status, paymentRecord]);

  const paymentMethod = paymentRecord?.paymentMethod || method;
  const amount = paymentRecord?.amount;

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Kết quả thanh toán" },
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

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Phương thức:{" "}
                <span className="font-medium text-foreground">
                  {paymentMethod}
                </span>
              </p>
              {amount && (
                <p>
                  Số tiền:{" "}
                  <span className="font-medium text-foreground">
                    {amount.toLocaleString("vi-VN")}đ
                  </span>
                </p>
              )}
              {paymentId && (
                <p>
                  Mã giao dịch:{" "}
                  <span className="font-medium text-foreground">
                    {paymentId}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button asChild>
                <Link href={returnPath}>Về trang chủ Staff</Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
