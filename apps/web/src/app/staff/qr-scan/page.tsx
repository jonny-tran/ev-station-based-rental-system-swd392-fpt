"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { QRScanner } from "@/components/qr-scanner";
import { Loader2 } from "lucide-react";

export default function StaffQrScanPage() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = useCallback(
    async (bookingId: string) => {
      if (isValidating) return;

      setIsValidating(true);
      setError(null);

      try {
        // Kiểm tra nếu bookingId có format hợp lệ (chỉ chứa chữ và số)
        if (!/^[a-zA-Z0-9-_]+$/.test(bookingId)) {
          throw new Error("Mã QR không hợp lệ");
        }

        // Đơn giản: chỉ cần quét được QR code là chuyển trang
        console.log("QR Code detected:", bookingId);

        // Chuyển đến trang checkin-session chính (không có ID)
        router.push("/staff/checkin-session");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Mã QR không hợp lệ";
        setError(errorMessage);
      } finally {
        setIsValidating(false);
      }
    },
    [isValidating, router]
  );

  const handleScanError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
  }, []);

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Quét mã QR" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {isValidating ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-blue-50 rounded-full p-6">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    Đang xử lý mã QR...
                  </p>
                  <p className="text-lg text-gray-600">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              </div>
            ) : (
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                onRetry={handleRetry}
                error={error}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
