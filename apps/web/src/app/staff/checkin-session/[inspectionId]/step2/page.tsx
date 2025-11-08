"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StepIndicator } from "@/components/staff/check-in/common/StepIndicator";
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
import { RejectNote } from "@/components/staff/check-in/common/RejectNote";
import { useCheckInSessionOperations } from "@/stores/checkin-session.store";
import { toast } from "@/lib/toast";

export default function InspectionStep2Page() {
  const params = useParams();
  const inspectionId = params.inspectionId as string;
  const router = useRouter();

  const {
    sessionDetails,
    isLoadingSessionDetails,
    sessionDetailsError,
    loadSessionDetails,
    setCurrentStep,
    approveStep2,
    rejectStep2,
    isStepTransitioning,
  } = useCheckInSessionOperations();

  // Load session details if not already loaded
  useEffect(() => {
    if (!inspectionId) return;

    const id = parseInt(inspectionId);
    // Only load if we don't have details or inspectionId changed
    if (
      !sessionDetails ||
      sessionDetails.inspection?.inspectionId !== id.toString()
    ) {
      loadSessionDetails(id);
    }
  }, [inspectionId, loadSessionDetails, sessionDetails]);

  // Set current step
  useEffect(() => {
    if (sessionDetails) {
      setCurrentStep(2);
    }
  }, [sessionDetails, setCurrentStep]);

  // Extract data from sessionDetails
  const inspection = sessionDetails?.inspection;
  const booking = sessionDetails?.booking;
  const vehicle = sessionDetails?.vehicle;

  const [photos, setPhotos] = useState<ChecklistPhotos>({});
  const [inputs, setInputs] = useState<VehicleInputValues>({
    odometerKm: inspection?.odometerReading ?? vehicle?.mileage,
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
    // Check all photos are File objects
    const hasAllPhotos = requiredPhotos.every(
      (k) => photos[k] && photos[k] instanceof File
    );
    const odoOk =
      typeof inputs.odometerKm === "number" && inputs.odometerKm >= 0;
    const pinOk =
      typeof inputs.batteryLevel === "number" &&
      inputs.batteryLevel >= 0 &&
      inputs.batteryLevel <= 100;
    return hasAllPhotos && odoOk && pinOk && !isStepTransitioning;
  }, [photos, inputs, isStepTransitioning]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof VehicleInputValues, string>> = {};
    if (
      !(typeof inputs.odometerKm === "number") ||
      (inputs.odometerKm as number) < 0
    ) {
      next.odometerKm = "Please enter a valid odometer reading";
    }
    if (
      !(typeof inputs.batteryLevel === "number") ||
      (inputs.batteryLevel as number) < 0 ||
      (inputs.batteryLevel as number) > 100
    ) {
      next.batteryLevel = "Battery level must be between 0 and 100";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    if (!inspection) return;

    try {
      await rejectStep2(parseInt(inspection.inspectionId), rejectReason.trim());
      router.push(`/staff/checkin-session/detail/${inspectionId}`);
    } catch (error) {
      console.error("Failed to reject step 2:", error);
      // Error is already handled in the store
    }
  };

  const handleContinue = async () => {
    const ok = validate();
    if (!ok) return;
    if (!canContinue) return;
    if (!inspection) return;

    // Check all photos are File objects
    const requiredPhotos: (keyof ChecklistPhotos)[] = [
      "front",
      "rear",
      "left",
      "right",
      "odo",
      "battery",
    ];

    const photoFiles: {
      front: File;
      rear: File;
      left: File;
      right: File;
      odo: File;
      battery: File;
    } = {} as any;

    for (const key of requiredPhotos) {
      const photo = photos[key];
      if (!photo || !(photo instanceof File)) {
        toast.error(`Please upload ${key} photo`);
        return;
      }
      photoFiles[key] = photo;
    }

    // Validate input data
    if (
      typeof inputs.odometerKm !== "number" ||
      typeof inputs.batteryLevel !== "number"
    ) {
      toast.error("Please enter odometer reading and battery level");
      return;
    }

    try {
      await approveStep2(parseInt(inspection.inspectionId), photoFiles, {
        odometerKm: inputs.odometerKm,
        batteryLevel: inputs.batteryLevel,
        vehicleConditionNotes: inputs.conditionNotes,
        damageNotes: inputs.damageNotes,
      });
      // Navigate to step 3 after successful approval
      router.push(`/staff/checkin-session/${inspectionId}/step3`);
    } catch (error) {
      console.error("Failed to approve step 2:", error);
      // Error is already handled in the store
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
              { label: "Staff Home", href: "/staff" },
              { label: "Check-in Session", href: "/staff/checkin-session" },
              { label: "Step 2" },
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

  // Error state
  if (sessionDetailsError) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Staff Home", href: "/staff" },
              { label: "Check-in Session", href: "/staff/checkin-session" },
              { label: "Step 2" },
            ]}
          />
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Error
                </div>
                <div className="text-muted-foreground mb-4">
                  {sessionDetailsError}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Not found state
  if (!inspection || !booking || !vehicle) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Staff Home", href: "/staff" },
              { label: "Check-in Session", href: "/staff/checkin-session" },
              { label: "Step 2" },
            ]}
          />
          <div className="p-6">Data not found.</div>
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
            { label: "Staff Home", href: "/staff" },
            { label: "Check-in Session", href: "/staff/checkin-session" },
            { label: "Step 2" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">
              Step 2 – Vehicle Handover & Inspection
            </h1>
          </div>

          <StepIndicator current={2} />

          {/* Top row: 2 columns - Vehicle Information and Input Data */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <VehicleSummaryCard
              info={{
                licensePlate: vehicle.licensePlate,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                odometerKm: inspection.odometerReading ?? vehicle.mileage,
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

          {/* Bottom: Photo checklist full width */}
          <ChecklistUploader photos={photos} onChange={setPhotos} />

          {/* Rejection reason note */}
          <RejectNote value={rejectReason} onChange={setRejectReason} />

          {/* Actions bar below checklist */}
          <ActionsBar
            canContinue={canContinue && !isStepTransitioning}
            onContinue={handleContinue}
            onReject={handleReject}
            canReject={Boolean(rejectReason.trim()) && !isStepTransitioning}
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
