"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toLocal } from "@/packages/utils/datetime";
import { InspectionStatusBadge } from "@/components/staff/check-in/common/InspectionStatusBadge";
import { InfoRow } from "@/components/staff/check-in/detail/InfoRow";
import { useSessionsList } from "@/stores/checkin-session.store";
import { CheckInSessionListItem } from "@/packages/types/checkin";

export default function CheckinSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.inspectionId as string;

  const { sessionsList, fetchSessionsList, isSessionsListLoading } =
    useSessionsList();

  // Load sessions list to find the specific session
  useEffect(() => {
    fetchSessionsList({ page: 1, pageSize: 100 }); // Load more to find the session
  }, [fetchSessionsList]);

  // Find the specific session
  const session = useMemo(
    () => sessionsList.find((s) => s.inspectionId.toString() === inspectionId),
    [sessionsList, inspectionId]
  );

  const isRejected = session?.status === "Rejected";

  // Redirect to appropriate step page based on currentStep if status is Pending
  useEffect(() => {
    if (session && session.status === "Pending" && session.currentStep) {
      const step = session.currentStep;
      // Only redirect if step is between 1-5
      if (step >= 1 && step <= 5) {
        router.replace(`/staff/checkin-session/${inspectionId}/step${step}`);
      }
    }
  }, [session, inspectionId, router]);

  // Loading state
  if (isSessionsListLoading) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Trang chính Staff", href: "/staff" },
              { label: "Phiên Check-in", href: "/staff/checkin-session" },
              { label: "Xem chi tiết" },
            ]}
          />
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Đang tải thông tin phiên check-in...
              </span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Not found state
  if (!session) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Trang chính Staff", href: "/staff" },
              { label: "Phiên Check-in", href: "/staff/checkin-session" },
              { label: "Xem chi tiết" },
            ]}
          />
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Không tìm thấy phiên check-in với ID: {inspectionId}
              </div>
              <Button asChild variant="outline">
                <Link href="/staff/checkin-session">Quay lại danh sách</Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Phiên Check-in", href: "/staff/checkin-session" },
            { label: "Xem chi tiết" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link href="/staff/checkin-session">Quay lại</Link>
              </Button>
              <h1 className="text-2xl font-semibold">
                Tổng quan phiên Check-in
              </h1>
            </div>
            <InspectionStatusBadge status={session.status} />
          </div>

          {/* Thông tin lý do bị hủy */}
          {isRejected && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Lý do bị hủy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  Phiên check-in đã bị từ chối
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Thông tin khách thuê */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách thuê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Họ tên" value={session.renter.fullName} />
                <InfoRow label="CCCD" value={session.renter.identityNumber} />
              </CardContent>
            </Card>

            {/* Thông tin xe */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin xe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Biển số" value={session.vehicle.licensePlate} />
                <InfoRow
                  label="Mẫu xe"
                  value={`${session.vehicle.brand} ${session.vehicle.model}`}
                />
              </CardContent>
            </Card>

            {/* Thông tin booking */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Booking ID" value={session.booking.bookingId} />
                <InfoRow
                  label="Thời gian bắt đầu"
                  value={toLocal(session.booking.startTime)}
                />
                <InfoRow
                  label="Thời gian kết thúc"
                  value={toLocal(session.booking.endTime)}
                />
                <InfoRow label="Trạng thái" value={session.booking.status} />
                <InfoRow
                  label="Tiền cọc"
                  value={`${session.booking.depositAmount.toLocaleString("vi-VN")} VNĐ`}
                />
              </CardContent>
            </Card>

            {/* Thông tin phiên check-in */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin phiên check-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow
                  label="Inspection ID"
                  value={session.inspectionId.toString()}
                />
                <InfoRow
                  label="Bước hiện tại"
                  value={`Bước ${session.currentStep}`}
                />
                <InfoRow label="Trạng thái" value={session.status} />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
