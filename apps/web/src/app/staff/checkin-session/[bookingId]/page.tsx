"use client";

import { useParams } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";

export default function StaffCheckinSessionPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Phiên Check-in" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">Phiên Check-in</h1>
          {bookingId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Booking ID:</strong> {bookingId}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Đang xử lý check-in cho booking này
              </p>
            </div>
          )}
          <p className="text-gray-600">
            {bookingId
              ? "Xử lý check-in cho booking đã quét QR"
              : "Danh sách các check-in session đang mở hoặc vừa xử lý"}
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
