"use client";

import { useState, useCallback, useEffect } from "react";
import { ContractRenderer } from "../../../../../../../../packages/contract/ContractRenderer";
import { RenterInfoPanel } from "./RenterInfoPanel";
import { ActionButtons } from "./ActionButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ContractStatus } from "@/packages/types/enum";
import { ContractData } from "../../../../../../../../packages/contract/contract-types";
import { ContractDataService } from "../../../../../../../../packages/contract/contract-data-service";

interface RenterInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface ContractSigningStepProps {
  inspectionId: string;
}

export function ContractSigningStep({
  inspectionId,
}: ContractSigningStepProps) {
  // State management
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Renter info state (extracted from contract data)
  const [renterInfo, setRenterInfo] = useState<RenterInfo>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  // Signature states for display
  const [status, setStatus] = useState<ContractStatus>(ContractStatus.Draft);
  const [renterSigned, setRenterSigned] = useState<boolean>(false);
  const [staffSigned, setStaffSigned] = useState<boolean>(false);

  const loadContractData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await ContractDataService.getContractData(inspectionId);
      setContractData(data);
      // Mock fetch status from service (here we derive simple state): default Draft
      setStatus(ContractStatus.Draft);
      setRenterSigned(Boolean(data.signDateRenter));
      setStaffSigned(Boolean(data.signDateStaff));

      // Update renter info from contract data
      setRenterInfo({
        fullName: data.renterName,
        email: data.renterEmail,
        phoneNumber: data.renterPhone,
      });

      // No local signature simulation/state here
    } catch (err) {
      setError("Không thể tải dữ liệu hợp đồng. Vui lòng thử lại.");
      console.error("Error loading contract data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [inspectionId]);

  // Load contract data on component mount
  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  // Handle contract refresh
  const handleContractRefresh = useCallback(() => {
    loadContractData();
  }, [loadContractData]);

  // Handle renter info change
  const handleRenterInfoChange = useCallback(
    (info: RenterInfo) => {
      setRenterInfo(info);
      // Update contract data with new renter info
      if (contractData) {
        setContractData({
          ...contractData,
          renterName: info.fullName,
          renterEmail: info.email,
          renterPhone: info.phoneNumber,
        });
      }
    },
    [contractData]
  );

  // Signature actions removed on this screen

  // Button primary actions based on state
  const handlePrimary = useCallback(async () => {
    if (!contractData) return;
    setIsSubmitting(true);
    try {
      if (status === ContractStatus.Draft) {
        await ContractDataService.submitContract(contractData.contractId);
        setStatus(ContractStatus.Active);
        console.log("Sent to renter for signing");
      } else if (
        status === ContractStatus.Active &&
        renterSigned &&
        !staffSigned
      ) {
        // staff signs now
        setStaffSigned(true);
        setStatus(ContractStatus.Completed);
        console.log("Staff signed, contract completed");
      }
    } catch (error) {
      console.error("Error processing action:", error);
      setError("Không thể xử lý. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }, [contractData, status, renterSigned, staffSigned]);

  // Handle reject
  const handleReject = useCallback(() => {
    // In real implementation: update contract status to rejected
    console.log("Contract rejected");
  }, []);

  // Derive primary button label/disabled
  const primaryLabel =
    status === ContractStatus.Draft
      ? "Gửi ký kết"
      : status === ContractStatus.Active
        ? "Ký kết"
        : "Đã hoàn tất";
  const primaryDisabled =
    status === ContractStatus.Draft
      ? false
      : status === ContractStatus.Active
        ? !renterSigned || isSubmitting
        : true;

  if (isLoading) {
    return (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu hợp đồng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!contractData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Không tìm thấy dữ liệu hợp đồng. Vui lòng thử lại.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Status */}
      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <div>
          <p className="font-medium text-green-800">
            Hợp đồng đã được tạo tự động
          </p>
          <p className="text-sm text-green-600">
            Mã hợp đồng: {contractData.contractId} | Tạo lúc:{" "}
            {new Date(contractData.contractCreatedDate).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Contract full width */}
        <ContractRenderer
          contractData={contractData}
          onRefresh={handleContractRefresh}
        />

        {/* Renter info below */}
        <RenterInfoPanel
          renterInfo={renterInfo}
          onInfoChange={handleRenterInfoChange}
        />
      </div>

      {/* Signature simulation removed */}

      {/* Action Buttons */}
      <ActionButtons
        primaryLabel={primaryLabel}
        primaryDisabled={primaryDisabled}
        onPrimary={handlePrimary}
        onReject={handleReject}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
