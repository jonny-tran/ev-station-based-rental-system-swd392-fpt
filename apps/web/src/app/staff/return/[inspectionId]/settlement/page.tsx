"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { mockService } from "@/packages/services/mock-service";
import { SettlementConfig, SettlementInput } from "@/packages/types/settlement";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const defaultConfig: SettlementConfig = {
  allowanceKm: 120,
  unitPricePerKm: 5000,
  timeUnitMinutes: 60,
  unitPricePerTimeUnit: 30000,
  unitPricePerBatteryPercent: 3000,
  cleaningFlatFee: 50000,
  wrongLocationFlatFee: 150000,
  accessoriesPriceMap: { Helmet: 100000, Charger: 300000 },
};

export default function ReturnSettlementPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.inspectionId as string;

  const inspection = useMemo(
    () => mockService.getVehicleInspectionById(inspectionId),
    [inspectionId]
  );
  const contract = useMemo(
    () =>
      inspection?.contractId
        ? mockService.getContractById(inspection.contractId)
        : undefined,
    [inspection]
  );

  const [isDirty] = useState<boolean>(false);
  const [wrongLocation] = useState<boolean>(false);
  const [missingAccessories] = useState<string[]>([]);

  if (!inspection || !contract) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Trang chính Staff", href: "/staff" },
              { label: "Trả xe", href: "/staff/return" },
              { label: "Chi phí phát sinh" },
            ]}
          />
          <div className="p-6">Thiếu dữ liệu để tính toán.</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const input: SettlementInput = {
    odoStart: undefined, // có thể lấy từ check-in nếu lưu; demo để undefined
    odoEnd: inspection.odometerKm,
    batteryStart: undefined,
    batteryEnd: inspection.batteryLevel,
    contractEndTime: contract.endDate,
    actualReturnTime: inspection.inspectionAt,
    isDirty,
    damageNotes: inspection.damageNotes,
    wrongLocation,
    missingAccessories,
  };

  const settlement = mockService.computeSettlementForReturn(
    input,
    defaultConfig
  );

  const total = settlement.subtotal;

  const createPaymentVNPay = () => {
    const payment = mockService.createExtraChargePayment({
      contractId: contract.contractId,
      amount: total,
      method: "VNPay",
    });
    router.push(
      `/staff/payment-result?paymentId=${payment.paymentId}&return=/staff/return`
    );
  };

  const createPaymentCash = () => {
    const payment = mockService.createExtraChargePayment({
      contractId: contract.contractId,
      amount: total,
      method: "Cash",
    });
    router.push(
      `/staff/payment-result?paymentId=${payment.paymentId}&return=/staff/return`
    );
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Trả xe", href: "/staff/return" },
            { label: "Chi phí phát sinh" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href={`/staff/return/${inspection.inspectionId}`}>
                Quay lại
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Settlement Summary</h1>
          </div>

          <div className="overflow-hidden rounded-md border">
            <div className="grid grid-cols-5 gap-2 px-4 py-2 text-sm font-medium">
              <div>Loại phí</div>
              <div>Chi tiết</div>
              <div className="text-right">Số lượng</div>
              <div className="text-right">Đơn giá</div>
              <div className="text-right">Thành tiền</div>
            </div>
            <div className="divide-y">
              {settlement.items.map((it) => (
                <div
                  key={it.id}
                  className="grid grid-cols-5 items-center gap-2 px-4 py-2 text-sm"
                >
                  <div className="font-medium">{it.label}</div>
                  <div className="text-muted-foreground">{it.detail}</div>
                  <div className="text-right">{it.quantity}</div>
                  <div className="text-right">
                    {it.unitPrice.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-right font-medium">
                    {it.amount.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-5 items-center gap-2 px-4 py-3 text-sm">
                <div className="col-span-4 text-right font-medium">
                  Tổng cộng
                </div>
                <div className="text-right text-base font-semibold">
                  {total.toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          </div>

          {total === 0 ? (
            <div className="flex justify-center">
              <Button onClick={() => router.push("/staff/return")} size="lg">
                Đóng phiên trả xe
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Chọn phương thức thanh toán
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Cash Payment Card */}
                <div
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  onClick={createPaymentCash}
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Thanh toán tiền mặt
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Thanh toán trực tiếp tại quầy
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {total.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>

                {/* VNPay Payment Card */}
                <div
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  onClick={createPaymentVNPay}
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Thanh toán VNPay
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Thanh toán online qua VNPay
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {total.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
