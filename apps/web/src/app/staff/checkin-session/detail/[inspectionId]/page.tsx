"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockService, formatCurrency } from "@/packages/services/mock-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VehicleInspectionStatus } from "@/packages/types/enum";
import { toLocal } from "@/packages/utils/datetime";
import { InspectionStatusBadge } from "@/components/staff/check-in/common/InspectionStatusBadge";
import { InfoRow } from "@/components/staff/check-in/detail/InfoRow";

export default function CheckinSessionDetailPage() {
  const params = useParams();
  const inspectionId = params.inspectionId as string;

  const inspection = useMemo(
    () => mockService.getVehicleInspectionById(inspectionId),
    [inspectionId]
  );
  const booking = useMemo(
    () =>
      inspection ? mockService.getBookingById(inspection.bookingId) : undefined,
    [inspection]
  );
  const renter = useMemo(
    () => (booking ? mockService.getRenterById(booking.renterId) : undefined),
    [booking]
  );
  const account = useMemo(
    () => (renter ? mockService.getAccountById(renter.accountId) : undefined),
    [renter]
  );
  const vehicle = useMemo(
    () => (booking ? mockService.getVehicleById(booking.vehicleId) : undefined),
    [booking]
  );
  const contract = useMemo(
    () =>
      inspection?.contractId
        ? mockService.getContractById?.(inspection.contractId)
        : undefined,
    [inspection]
  );
  const payments = useMemo(
    () =>
      inspection?.contractId
        ? mockService.getPaymentsByContractId?.(inspection.contractId) || []
        : [],
    [inspection]
  );

  const isRejected = inspection?.status === VehicleInspectionStatus.Rejected;

  if (!inspection || !booking || !renter || !account || !vehicle) {
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
          <div className="p-6">Không tìm thấy phiên kiểm tra.</div>
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
            <InspectionStatusBadge status={inspection.status} />
          </div>

          {/* Thông tin lý do bị hủy */}
          {isRejected && inspection.rejectedReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Lý do bị hủy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  {inspection.rejectedReason}
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
                <InfoRow label="Họ tên" value={account.fullName} />
                <InfoRow label="CCCD" value={renter.identityNumber} />
              </CardContent>
            </Card>

            {/* Thông tin xe */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin xe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Biển số" value={vehicle.licensePlate} />
                <InfoRow
                  label="Mẫu xe"
                  value={`${vehicle.brand} ${vehicle.model}`}
                />
              </CardContent>
            </Card>

            {/* Thông tin booking */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Booking ID" value={booking.bookingId} />
                <InfoRow
                  label="Thời gian bắt đầu"
                  value={toLocal(booking.startTime)}
                />
                <InfoRow
                  label="Thời gian kết thúc"
                  value={toLocal(booking.endTime)}
                />
                <InfoRow label="Trạng thái" value={booking.bookingStatus} />
              </CardContent>
            </Card>

            {/* Thông tin hợp đồng */}
            <Card>
              <CardHeader>
                <CardTitle>Hợp đồng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow
                  label="Contract ID"
                  value={inspection.contractId || "—"}
                />
                <InfoRow
                  label="Contract status"
                  value={contract?.status || "—"}
                />
              </CardContent>
            </Card>

            {/* Thông tin thanh toán */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Chưa có thanh toán
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div
                        key={p.paymentId}
                        className="flex flex-wrap items-center justify-between gap-2 rounded border p-3"
                      >
                        <div className="min-w-0">
                          <div className="font-medium">
                            {formatCurrency(p.amount)} • {p.currency}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {p.paymentType} • {p.paymentMethod}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {p.transactionId ? `Mã GD: ${p.transactionId}` : ""}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{p.status}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.paidAt ? toLocal(p.paidAt) : "—"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
