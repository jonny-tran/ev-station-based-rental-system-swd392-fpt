"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ConfirmRejectButton } from "@/components/staff/check-in/common/ConfirmRejectButton";
import Link from "next/link";
import { StepIndicator } from "@/components/staff/check-in/common/StepIndicator";
import { RenterInfoCard } from "@/components/staff/check-in/process/step1/RenterInfoCard";
import { DriverLicenseCard } from "@/components/staff/check-in/process/step1/DriverLicenseCard";
import { RejectNote } from "@/components/staff/check-in/common/RejectNote";
import { useCheckInSessionOperations } from "@/stores/checkin-session.store";

type VerifiedStatus = "Verified" | "Pending" | "Rejected";

export default function InspectionStep1Page() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.inspectionId as string;
  const [rejectReason, setRejectReason] = useState<string>("");

  const {
    approveStep1,
    rejectStep1,
    isStepTransitioning,
    setCurrentStep,
    sessionDetails,
    isLoadingSessionDetails,
    sessionDetailsError,
    loadSessionDetails,
  } = useCheckInSessionOperations();

  // Load session details by ID
  useEffect(() => {
    if (!inspectionId) return;

    // Only load if we don't have details or inspectionId changed
    const id = parseInt(inspectionId);
    if (
      !sessionDetails ||
      sessionDetails.inspection?.inspectionId !== id.toString()
    ) {
      loadSessionDetails(id);
    }
  }, [inspectionId, loadSessionDetails]);

  // Use sessionDetails from store
  const session = sessionDetails;

  // Set current step when session is found
  useEffect(() => {
    if (session) {
      setCurrentStep(1);
    }
  }, [session, setCurrentStep]);

  const handleReject = async () => {
    if (!session || !rejectReason.trim()) return;

    try {
      await rejectStep1(
        parseInt(session.inspection.inspectionId),
        rejectReason.trim()
      );
      router.push(`/staff/checkin-session/detail/${inspectionId}`);
    } catch (error) {
      console.error("Failed to reject session:", error);
    }
  };

  const handleApproveAndContinue = async () => {
    if (!session) return;

    try {
      await approveStep1(parseInt(session.inspection.inspectionId));
      router.push(`/staff/checkin-session/${inspectionId}/step2`);
    } catch (error) {
      console.error("Failed to approve and continue:", error);
    }
  };

  // Loading state
  if (isLoadingSessionDetails) {
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

  // Error state
  if (sessionDetailsError) {
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
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Lỗi
                </div>
                <div className="text-muted-foreground mb-4">
                  {sessionDetailsError}
                </div>
                <Button asChild>
                  <Link href="/staff/checkin-session">Quay lại danh sách</Link>
                </Button>
              </div>
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
              { label: "Bước 1" },
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
              fullName={
                session.account?.fullName || session.renter?.fullName || "N/A"
              }
              identityNumber={session.renter?.identityNumber || "N/A"}
              frontIdentityImageUrl={session.renter?.frontIdentityImageUrl}
              backIdentityImageUrl={session.renter?.backIdentityImageUrl}
              address={session.renter?.address}
              dateOfBirth={session.renter?.dateOfBirth}
            />

            <DriverLicenseCard
              data={{
                licenseNumber: session.driverLicense?.licenseNumber,
                issueDate: session.driverLicense?.issuedDate,
                expiryDate: session.driverLicense?.expiryDate,
                issuedBy: session.driverLicense?.issuedBy,
                licenseImageUrl: session.driverLicense?.licenseImageUrl,
                verifiedStatus:
                  (session.driverLicense?.verifiedStatus as VerifiedStatus) ||
                  "Pending",
              }}
            />
          </div>

          <RejectNote value={rejectReason} onChange={setRejectReason} />

          <div className="flex items-center justify-end gap-3">
            <ConfirmRejectButton
              canReject={Boolean(rejectReason.trim())}
              onConfirm={handleReject}
            />
            <Button
              onClick={handleApproveAndContinue}
              disabled={isStepTransitioning}
            >
              {isStepTransitioning ? "Đang xử lý..." : "Phê duyệt & Tiếp tục"}
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
