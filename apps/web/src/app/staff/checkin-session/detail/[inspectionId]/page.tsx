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
              { label: "Staff Home", href: "/staff" },
              { label: "Check-in Session", href: "/staff/checkin-session" },
              { label: "View Details" },
            ]}
          />
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Loading check-in session information...
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
              { label: "Staff Home", href: "/staff" },
              { label: "Check-in Session", href: "/staff/checkin-session" },
              { label: "View Details" },
            ]}
          />
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Check-in session not found with ID: {inspectionId}
              </div>
              <Button asChild variant="outline">
                <Link href="/staff/checkin-session">Back to List</Link>
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
                <Link href="/staff/checkin-session">Back</Link>
              </Button>
              <h1 className="text-2xl font-semibold">
                Check-in Session Overview
              </h1>
            </div>
            <InspectionStatusBadge status={session.status} />
          </div>

          {/* Rejection Reason */}
          {isRejected && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Rejection Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  Check-in session has been rejected
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Renter Information */}
            <Card>
              <CardHeader>
                <CardTitle>Renter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Full Name" value={session.renter.fullName} />
                <InfoRow label="ID Number" value={session.renter.identityNumber} />
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="License Plate" value={session.vehicle.licensePlate} />
                <InfoRow
                  label="Vehicle Model"
                  value={`${session.vehicle.brand} ${session.vehicle.model}`}
                />
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Booking ID" value={session.booking.bookingId} />
                <InfoRow
                  label="Start Time"
                  value={toLocal(session.booking.startTime)}
                />
                <InfoRow
                  label="End Time"
                  value={toLocal(session.booking.endTime)}
                />
                <InfoRow label="Status" value={session.booking.status} />
                <InfoRow
                  label="Deposit Amount"
                  value={`${session.booking.depositAmount.toLocaleString("vi-VN")} VNĐ`}
                />
              </CardContent>
            </Card>

            {/* Check-in Session Information */}
            <Card>
              <CardHeader>
                <CardTitle>Check-in Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow
                  label="Inspection ID"
                  value={session.inspectionId.toString()}
                />
                <InfoRow
                  label="Current Step"
                  value={`Step ${session.currentStep}`}
                />
                <InfoRow label="Status" value={session.status} />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
