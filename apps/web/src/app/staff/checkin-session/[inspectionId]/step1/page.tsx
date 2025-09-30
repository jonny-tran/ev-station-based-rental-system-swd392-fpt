"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ConfirmRejectButton } from "@/components/staff/check-in/common/ConfirmRejectButton";
import { mockService } from "@/packages/services/mock-service";
import Link from "next/link";
import { StepIndicator } from "@/components/staff/check-in/common/StepIndicator";
import { RenterInfoCard } from "@/components/staff/check-in/process/step1/RenterInfoCard";
import { DriverLicenseCard } from "@/components/staff/check-in/process/step1/DriverLicenseCard";
import { RejectNote } from "@/components/staff/check-in/common/RejectNote";

type VerifiedStatus = "Verified" | "Pending" | "Rejected";

export default function InspectionStep1Page() {
  const params = useParams();
  const inspectionId = params.inspectionId as string;
  const [rejectReason, setRejectReason] = useState<string>("");

  const inspection = useMemo(() => {
    return mockService.getVehicleInspectionById(inspectionId);
  }, [inspectionId]);

  const booking = useMemo(() => {
    if (!inspection) return undefined;
    return mockService.getBookingById(inspection.bookingId);
  }, [inspection]);

  const renter = useMemo(() => {
    if (!booking) return undefined;
    return mockService.getRenterById(booking.renterId);
  }, [booking]);

  const account = useMemo(() => {
    if (!renter) return undefined;
    return mockService.getAccountById(renter.accountId);
  }, [renter]);

  const driverLicense = useMemo(() => {
    if (!booking) return undefined;
    return mockService.getDriverLicenseByRenterId(booking.renterId);
  }, [booking]);

  const handleReject = () => {
    console.log("Rejected inspection:", { inspectionId, reason: rejectReason });
  };

  const handleApproveAndContinue = () => {
    console.log("Go to Step 2 - Handover Checklist for:", inspectionId);
  };

  if (!inspection || !booking || !renter || !account) {
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
            { label: "Bước 1" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/staff/checkin-session">Quay lại</Link>
            </Button>
            <h1 className="text-2xl font-semibold">
              Bước 1 – Kiểm tra giấy tờ
            </h1>
          </div>

          <StepIndicator current={1} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RenterInfoCard
              fullName={account.fullName}
              identityNumber={renter.identityNumber}
              frontIdentityImageUrl={renter.frontIdentityImageUrl}
              backIdentityImageUrl={renter.backIdentityImageUrl}
              address={renter.address}
              dateOfBirth={renter.dateOfBirth}
            />

            <DriverLicenseCard
              data={{
                licenseNumber: driverLicense?.licenseNumber,
                issueDate: driverLicense?.issueDate,
                expiryDate: driverLicense?.expiryDate,
                issuedBy: driverLicense?.issuedBy,
                licenseImageUrl: driverLicense?.licenseImageUrl,
                verifiedStatus: driverLicense?.verifiedStatus as VerifiedStatus,
              }}
            />
          </div>

          <RejectNote value={rejectReason} onChange={setRejectReason} />

          <div className="flex items-center justify-end gap-3">
            <ConfirmRejectButton
              canReject={Boolean(rejectReason.trim())}
              onConfirm={handleReject}
            />
            <Button asChild onClick={handleApproveAndContinue}>
              <Link href={`/staff/checkin-session/${inspectionId}/step2`}>
                Phê duyệt & Tiếp tục
              </Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
