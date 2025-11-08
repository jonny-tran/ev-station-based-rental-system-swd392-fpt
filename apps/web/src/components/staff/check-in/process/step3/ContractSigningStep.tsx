"use client";

import { useCallback, useEffect } from "react";
import { ContractRenderer } from "../../../../../../../../packages/contract/ContractRenderer";
import { RenterInfoPanel } from "./RenterInfoPanel";
import { ActionButtons } from "./ActionButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ContractStatus } from "@/packages/types/contract/contract-status";
import { ContractData } from "../../../../../../../../packages/contract/contract-types";
import { ContractDataService } from "../../../../../../../../packages/contract/contract-data-service";
import {
  useContractDetails,
  useContractActions,
} from "@/stores/contract.store";
import { useState } from "react";

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
  // Contract store hooks
  const {
    contractDetails,
    isLoadingContractDetails,
    contractDetailsError,
    loadContractByInspectionId,
  } = useContractDetails();

  const {
    submitContract,
    staffSignContract,
    rejectContract,
    approveStep3,
    getContractStatus,
    isContractSignedByRenter,
    isContractSignedByStaff,
    canStaffSign,
    canSubmitContract,
  } = useContractActions();

  // Local state for contract data (for template rendering)
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Renter info state (extracted from contract data)
  const [renterInfo, setRenterInfo] = useState<RenterInfo>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  // Load contract data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load contract details from store
        await loadContractByInspectionId(parseInt(inspectionId, 10));

        // Load contract data for template rendering
        const data = await ContractDataService.getContractData(inspectionId);
        setContractData(data);

        // Helper function to clean value (remove "—" and trim)
        const cleanValue = (value: string | undefined | null): string => {
          if (!value || value.trim() === "" || value.trim() === "—") {
            return "";
          }
          return value.trim();
        };

        // Update renter info from contract data (prioritize contractData)
        const renterName = cleanValue(data.renterName);
        const renterEmail = cleanValue(data.renterEmail);
        const renterPhone = cleanValue(data.renterPhone);

        // If contractData doesn't have renter info, try from contractDetails
        if (!renterName && contractDetails?.renter?.fullName) {
          setRenterInfo({
            fullName: cleanValue(contractDetails.renter.fullName) || "",
            email: cleanValue(contractDetails.renter.email) || "",
            phoneNumber: cleanValue(contractDetails.renter.phoneNumber) || "",
          });
        } else {
          setRenterInfo({
            fullName: renterName,
            email: renterEmail,
            phoneNumber: renterPhone,
          });
        }
      } catch (err) {
        console.error("Error loading contract data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load contract data. Please try again."
        );
      }
    };

    loadData();
  }, [inspectionId, loadContractByInspectionId]);

  // Update contract data when contract details change
  useEffect(() => {
    const updateContractData = async () => {
      if (contractDetails) {
        try {
          const data = await ContractDataService.getContractData(inspectionId);
          setContractData(data);

          // Helper function to clean value (remove "—" and trim)
          const cleanValue = (value: string | undefined | null): string => {
            if (!value || value.trim() === "" || value.trim() === "—") {
              return "";
            }
            return value.trim();
          };

          // Update renter info from contract data (prioritize contractData)
          const renterName = cleanValue(data.renterName);
          const renterEmail = cleanValue(data.renterEmail);
          const renterPhone = cleanValue(data.renterPhone);

          // If contractData has valid renter info, use it; otherwise use contractDetails
          if (renterName || renterEmail || renterPhone) {
            setRenterInfo({
              fullName: renterName,
              email: renterEmail,
              phoneNumber: renterPhone,
            });
          } else if (contractDetails.renter) {
            setRenterInfo({
              fullName: cleanValue(contractDetails.renter.fullName) || "",
              email: cleanValue(contractDetails.renter.email) || "",
              phoneNumber: cleanValue(contractDetails.renter.phoneNumber) || "",
            });
          }
        } catch (err) {
          console.error("Error updating contract data:", err);
        }
      }
    };

    updateContractData();
  }, [contractDetails, inspectionId]);

  // Handle contract refresh
  const handleContractRefresh = useCallback(async () => {
    try {
      await loadContractByInspectionId(parseInt(inspectionId, 10));
      const data = await ContractDataService.getContractData(inspectionId);
      setContractData(data);
    } catch (err) {
      console.error("Error refreshing contract:", err);
    }
  }, [inspectionId, loadContractByInspectionId]);

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

  // Handle primary action (Submit or Sign)
  const handlePrimary = useCallback(async () => {
    if (!contractDetails) return;

    setIsSubmitting(true);
    setError("");

    try {
      const status = getContractStatus();
      const renterSigned = isContractSignedByRenter();
      const staffSigned = isContractSignedByStaff();

      if (status === ContractStatus.Draft && canSubmitContract()) {
        // Submit contract for renter signing
        await submitContract(contractDetails.contractId, {
          fullName: renterInfo.fullName,
          email: renterInfo.email,
          phoneNumber: renterInfo.phoneNumber,
        });

        // Refresh contract details
        await loadContractByInspectionId(parseInt(inspectionId, 10));
      } else if (
        status === ContractStatus.Active &&
        renterSigned &&
        !staffSigned &&
        canStaffSign()
      ) {
        // Staff signs contract
        await staffSignContract(contractDetails.contractId);

        // Refresh contract details
        await loadContractByInspectionId(parseInt(inspectionId, 10));

        // Approve Step 3 (move to Step 4)
        await approveStep3(parseInt(inspectionId, 10));
      }
    } catch (err) {
      console.error("Error processing action:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    contractDetails,
    inspectionId,
    renterInfo,
    getContractStatus,
    isContractSignedByRenter,
    isContractSignedByStaff,
    canSubmitContract,
    canStaffSign,
    submitContract,
    staffSignContract,
    approveStep3,
    loadContractByInspectionId,
  ]);

  // Handle reject
  const handleReject = useCallback(async () => {
    if (!contractDetails) return;

    const reason = prompt(
      "Please enter the reason for rejecting the contract:"
    );
    if (!reason || reason.trim() === "") return;

    setIsSubmitting(true);
    setError("");

    try {
      await rejectContract(contractDetails.contractId, reason.trim());

      // Refresh contract details
      await loadContractByInspectionId(parseInt(inspectionId, 10));
    } catch (err) {
      console.error("Error rejecting contract:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject contract. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    contractDetails,
    inspectionId,
    loadContractByInspectionId,
    rejectContract,
  ]);

  // Derive primary button label/disabled
  const status = getContractStatus();
  const renterSigned = isContractSignedByRenter();
  const staffSigned = isContractSignedByStaff();

  const primaryLabel =
    status === ContractStatus.Draft
      ? "Send for Signing"
      : status === ContractStatus.Active
        ? renterSigned && !staffSigned
          ? "Sign as Staff"
          : "Waiting for Renter"
        : status === ContractStatus.Completed
          ? "Completed"
          : "Unknown Status";

  const primaryDisabled =
    status === ContractStatus.Draft
      ? isSubmitting
      : status === ContractStatus.Active
        ? !renterSigned || staffSigned || isSubmitting
        : true;

  // Loading state
  if (isLoadingContractDetails) {
    return (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading contract data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (contractDetailsError || error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {contractDetailsError || error || "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  // No contract data
  if (!contractDetails || !contractData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Contract data not found. Please try again.
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
            Contract has been automatically created
          </p>
          <p className="text-sm text-green-600">
            Contract ID: {contractDetails.contractId} | Created at:{" "}
            {new Date(contractDetails.createdAt).toLocaleString("en-US")}
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
