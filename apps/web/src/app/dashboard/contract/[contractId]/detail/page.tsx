"use client";

import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ContractDataService } from "@/packages/contract/contract-data-service";
import { ContractData } from "@/packages/contract/contract-types";
import { ContractRenderer } from "@/packages/contract/ContractRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContractGenerator } from "@/packages/contract/contract-generator";
import { CONTRACT_TEMPLATE } from "@/packages/contract/contract-template";
import { ContractService } from "@/packages/services/contract.service";
import { ContractApiError } from "@/packages/types/contract/contract-api";
import { ContractStatus } from "@/packages/types/enum";
import { useAuthStore } from "@/stores/auth.store";

export default function RenterContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractStatus, setContractStatus] = useState<ContractStatus | null>(
    null
  );
  const [contractBookingId, setContractBookingId] = useState<string>("");
  const [contractStatusReason, setContractStatusReason] = useState<
    string | undefined
  >(undefined);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not a renter
    if (!user || user.role !== "Renter") {
      router.push("/login");
      return;
    }

    const loadContract = async () => {
      try {
        setLoading(true);
        setError("");

        if (!contractId || typeof contractId !== "string") {
          throw new Error("Invalid contract ID");
        }

        // Get contract details from API
        const contractResponse =
          await ContractService.getContractDetails(contractId);

        if (!contractResponse.data) {
          throw new ContractApiError("Contract not found", 404, undefined);
        }

        const contractDetails = contractResponse.data;
        setContractStatus(contractDetails.status);
        setContractBookingId(contractDetails.bookingId);
        setContractStatusReason(undefined); // statusReason not in details response

        // Get contract data for rendering
        let data =
          await ContractDataService.getContractDataByContractId(contractId);

        // Fallback: Fill in renter info from current user if missing
        if (user && (data.renterName === "—" || data.renterEmail === "—")) {
          data = {
            ...data,
            renterName: data.renterName === "—" ? user.fullName : data.renterName,
            renterEmail: data.renterEmail === "—" ? user.email : data.renterEmail,
            renterPhone:
              data.renterPhone === "—"
                ? user.phoneNumber || "—"
                : data.renterPhone,
            renterId: data.renterId === "—" ? user.renterId || "—" : data.renterId,
          };
        }

        setContractData(data);
      } catch (err) {
        const errorMessage =
          err instanceof ContractApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unable to load contract information";
        setError(errorMessage);
        console.error("Error loading contract:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContract();
  }, [contractId, user, router]);

  const handlePrint = async () => {
    if (!contractData) return;
    try {
      const generator = new ContractGenerator(CONTRACT_TEMPLATE);
      const htmlBody = generator.generateContract(contractData);
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Contract ${contractId}</title>
      </head><body>${htmlBody}</body></html>`;
      const win = window.open("", "_blank");
      if (!win) return;
      win.document.open();
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        try {
          win.focus();
          win.print();
        } catch {}
      }, 300);
    } catch (err) {
      console.error("Error printing contract:", err);
    }
  };

  // Don't render if user is not a renter
  if (!user || user.role !== "Renter") {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Home", href: "/dashboard" },
            { label: "Contracts", href: "/dashboard/contract" },
            { label: "Contract Details" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Contract Details</h1>
            <div className="flex gap-2">
              {contractStatus === ContractStatus.Completed &&
                contractData && (
                  <Button size="sm" onClick={handlePrint}>
                    Print/Download PDF
                  </Button>
                )}
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/contract">Back</Link>
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!error && loading && (
            <div className="border rounded-md p-8 text-center text-muted-foreground">
              Loading contract content...
            </div>
          )}

          {!error && !loading && contractData && (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Contract ID:{" "}
                <span className="font-medium text-foreground">
                  {contractData.contractId}
                </span>
                {contractBookingId && (
                  <>
                    {" "}
                    · Booking: {contractBookingId}
                  </>
                )}
              </div>
              {contractStatus === ContractStatus.Completed && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  Contract has been fully signed.
                </div>
              )}
              {(contractStatus === ContractStatus.Voided ||
                contractStatus === ContractStatus.Terminated) && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  Status:{" "}
                  {contractStatus === ContractStatus.Voided
                    ? "Voided"
                    : "Terminated"}
                  {contractStatusReason ? ` · Reason: ${contractStatusReason}` : ""}
                </div>
              )}
              <ContractRenderer contractData={contractData} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

