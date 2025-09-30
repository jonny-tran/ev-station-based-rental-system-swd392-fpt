/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { mockService } from "@/packages/services/mock-service";
import { useEffect, useState } from "react";
import { Contract } from "@/packages/types/contract";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ContractDataService } from "@/packages/contract/contract-data-service";
import { ContractData } from "@/packages/contract/contract-types";
import { ContractRenderer } from "@/packages/contract/ContractRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContractGenerator } from "@/packages/contract/contract-generator";
import { CONTRACT_TEMPLATE } from "@/packages/contract/contract-template";

export default function RenterContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const [contract, setContract] = useState<Contract | undefined>();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const c = mockService.getContractById(contractId);
      setContract(c);
      if (c) {
        (async () => {
          const data = await ContractDataService.getContractData("insp-ci-5");

          let renterSignature: string | undefined;
          let staffSignature: string | undefined;
          let signDateRenter: string | undefined;
          let signDateStaff: string | undefined;

          if (c.status === "Completed") {
            renterSignature = "signed";
            staffSignature = "signed";
            signDateRenter = c.signedAt;
            signDateStaff = c.signedAt;
          } else if (c.status === "Active") {
            if (c.signedByRenter) {
              renterSignature = "signed";
              signDateRenter = c.signedAt;
            }
          }

          setContractData({
            ...data,
            contractId: c.contractId,
            contractCreatedDate: c.createdAt,
            signDateRenter,
            signDateStaff,
            renterSignature,
            staffSignature,
          });
        })();
      }
    } catch (err) {
      setError("Không thể tải thông tin hợp đồng");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Renter", href: "/dashboard" },
            { label: "Hợp đồng", href: "/dashboard/contract" },
            { label: "Xem chi tiết hợp đồng" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Chi tiết hợp đồng</h1>
            <div className="flex gap-2">
              {contract?.status === "Completed" && (
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!contractData) return;
                    const generator = new ContractGenerator(CONTRACT_TEMPLATE);
                    const htmlBody = generator.generateContract(contractData);
                    const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>${contractId}</title>
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
                  }}
                >
                  In/Tải tài liệu PDF
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/contract">Quay lại</Link>
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
              Đang tải nội dung hợp đồng...
            </div>
          )}

          {!error && contract && contractData && (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Mã HĐ:{" "}
                <span className="font-medium text-foreground">
                  {contract.contractId}
                </span>{" "}
                · Booking: {contract.bookingId}
              </div>
              {contract.status === "Completed" && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  Hợp đồng đã được ký hoàn tất.
                </div>
              )}
              {(contract.status === "Voided" ||
                contract.status === "Terminated") && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  Trạng thái:{" "}
                  {contract.status === "Voided" ? "Hủy" : "Chấm dứt"}
                  {contract.statusReason
                    ? ` · Lý do: ${contract.statusReason}`
                    : ""}
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
