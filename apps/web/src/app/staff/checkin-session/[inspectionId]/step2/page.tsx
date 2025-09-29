"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StepIndicator } from "@/components/staff/check-in/process/StepIndicator";
import { mockService } from "@/packages/services/mock-service";
import { VehicleSummaryCard } from "@/components/staff/check-in/process/step2/VehicleSummaryCard";
import {
  ChecklistUploader,
  ChecklistPhotos,
} from "@/components/staff/check-in/process/step2/ChecklistUploader";
import {
  VehicleInputs,
  VehicleInputValues,
} from "@/components/staff/check-in/process/step2/VehicleInputs";
import { ActionsBar } from "@/components/staff/check-in/process/step2/ActionsBar";
import { RejectNote } from "@/components/staff/check-in/process/RejectNote";

export default function InspectionStep2Page() {
  const params = useParams();
  const inspectionId = params.inspectionId as string;
  const router = useRouter();

  const inspection = useMemo(
    () => mockService.getVehicleInspectionById(inspectionId),
    [inspectionId]
  );
  const booking = useMemo(
    () =>
      inspection ? mockService.getBookingById(inspection.bookingId) : undefined,
    [inspection]
  );
  const vehicle = useMemo(
    () => (booking ? mockService.getVehicleById(booking.vehicleId) : undefined),
    [booking]
  );
  // rentalLocation không còn hiển thị ở Step 2 summary

  const [photos, setPhotos] = useState<ChecklistPhotos>({});
  const [inputs, setInputs] = useState<VehicleInputValues>({
    odometerKm: inspection?.odometerKm ?? vehicle?.odometerKm,
    batteryLevel: inspection?.batteryLevel ?? vehicle?.batteryLevel,
    conditionNotes: inspection?.vehicleConditionNotes,
    damageNotes: inspection?.damageNotes,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof VehicleInputValues, string>>
  >({});
  const [rejectReason, setRejectReason] = useState<string>("");

  const canContinue = useMemo(() => {
    const requiredPhotos: (keyof ChecklistPhotos)[] = [
      "front",
      "rear",
      "left",
      "right",
      "odo",
      "battery",
    ];
    const hasAllPhotos = requiredPhotos.every((k) => Boolean(photos[k]));
    const odoOk =
      typeof inputs.odometerKm === "number" && inputs.odometerKm >= 0;
    const pinOk =
      typeof inputs.batteryLevel === "number" &&
      inputs.batteryLevel >= 0 &&
      inputs.batteryLevel <= 100;
    return hasAllPhotos && odoOk && pinOk;
  }, [photos, inputs]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof VehicleInputValues, string>> = {};
    if (
      !(typeof inputs.odometerKm === "number") ||
      (inputs.odometerKm as number) < 0
    ) {
      next.odometerKm = "Vui lòng nhập số km hợp lệ";
    }
    if (
      !(typeof inputs.batteryLevel === "number") ||
      (inputs.batteryLevel as number) < 0 ||
      (inputs.batteryLevel as number) > 100
    ) {
      next.batteryLevel = "Mức pin phải từ 0 đến 100";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleReject = (reasonFromModal: string) => {
    const reason = rejectReason || reasonFromModal;
    console.log("Reject inspection at step 2:", { inspectionId, reason });
    router.push(`/staff/checkin-session/detail/${inspectionId}`);
  };

  const handleContinue = () => {
    const ok = validate();
    if (!ok) return;
    if (!canContinue) return;
    console.log("Approve step 2 & continue:", { inspectionId, inputs, photos });
    router.push(`/staff/checkin-session/${inspectionId}/step3`);
  };

  if (!inspection || !booking || !vehicle) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Trang chính Staff", href: "/staff" },
              { label: "Phiên Check-in", href: "/staff/checkin-session" },
              { label: "Bước 2" },
            ]}
          />
          <div className="p-6">Không tìm thấy dữ liệu.</div>
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
            { label: "Bước 2" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">
              Bước 2 – Bàn giao & kiểm tra xe
            </h1>
          </div>

          <StepIndicator current={2} />

          {/* Hàng trên: 2 cột - Thông tin xe và Nhập dữ liệu */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <VehicleSummaryCard
              info={{
                licensePlate: vehicle.licensePlate,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                odometerKm: inspection.odometerKm ?? vehicle.odometerKm,
                batteryLevel: inspection.batteryLevel ?? vehicle.batteryLevel,
                batteryCapacity: vehicle.batteryCapacity,
                status: vehicle.status,
                lastServiceDate: vehicle.lastServiceDate,
                imageUrl: vehicle.imageUrl,
              }}
            />

            <VehicleInputs
              values={inputs}
              onChange={setInputs}
              errors={errors}
            />
          </div>

          {/* Dưới: Checklist ảnh full width */}
          <ChecklistUploader photos={photos} onChange={setPhotos} />

          {/* Ghi chú lý do từ chối */}
          <RejectNote value={rejectReason} onChange={setRejectReason} />

          {/* Hành động nằm dưới checklist */}
          <ActionsBar
            canContinue={canContinue}
            onContinue={handleContinue}
            onReject={handleReject}
            canReject={Boolean(rejectReason.trim())}
            onSaveDraft={() => {
              console.log("Save draft step 2:", {
                inspectionId,
                inputs,
                photos,
              });
            }}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
