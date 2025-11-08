"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  CreditCard,
  Clock,
  FileText,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { mockService } from "@/packages/services/mock-service";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Lấy paymentId từ URL params hoặc search params
  const paymentIdParam = searchParams.get("paymentId");
  const status = searchParams.get("status");
  const method = searchParams.get("method") ?? "";
  const returnPath = searchParams.get("return") ?? "/staff";
  const transactionIdParam = searchParams.get("transactionId");
  const amountParam = searchParams.get("amount");

  const paymentRecord = useMemo(() => {
    if (paymentIdParam) {
      // Convert string to number if needed
      const paymentId = parseInt(paymentIdParam, 10);
      if (!isNaN(paymentId)) {
        return mockService.getPaymentById(paymentId);
      }
    }
    return null;
  }, [paymentIdParam]);

  // Xác định trạng thái thanh toán
  const isSuccess = useMemo(() => {
    if (status) {
      return status === "success";
    }
    if (paymentRecord) {
      return paymentRecord.status === "Paid";
    }
    return false;
  }, [status, paymentRecord]);

  const paymentMethod = paymentRecord?.paymentMethod || method || "VNPay";
  
  // Ưu tiên lấy amount từ URL params (từ VNPay callback), sau đó từ payment record
  const amount = useMemo(() => {
    if (amountParam) {
      const parsedAmount = parseFloat(amountParam);
      if (!isNaN(parsedAmount)) {
        return parsedAmount;
      }
    }
    return paymentRecord?.amount;
  }, [amountParam, paymentRecord]);
  
  // Ưu tiên lấy transactionId từ URL params (từ VNPay callback), sau đó từ payment record
  const transactionId = useMemo(() => {
    if (transactionIdParam) {
      return transactionIdParam;
    }
    if (paymentRecord?.transactionId) {
      return paymentRecord.transactionId;
    }
    if (paymentIdParam) {
      return paymentIdParam;
    }
    return "N/A";
  }, [transactionIdParam, paymentRecord, paymentIdParam]);
  
  const paymentDate = paymentRecord?.paymentDate || new Date().toISOString();

  // Lấy icon cho phương thức thanh toán
  const getPaymentMethodIcon = () => {
    return <CreditCard className="h-5 w-5" />;
  };

  // Format ngày giờ theo định dạng Việt Nam
  const formattedDate = useMemo(() => {
    try {
      const date = new Date(paymentDate);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return "N/A";
    }
  }, [paymentDate]);

  // Copy transaction ID
  const handleCopyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Kết quả thanh toán" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="mx-auto w-full max-w-2xl">
            {/* Main Result Card */}
            <Card
              className={`overflow-hidden transition-all duration-500 ${
                isSuccess
                  ? "border-green-200 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-background"
                  : "border-red-200 bg-gradient-to-br from-red-50/50 to-white dark:from-red-950/20 dark:to-background"
              }`}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon với animation */}
                  <div
                    className={`relative ${
                      isSuccess
                        ? "text-green-600 dark:text-green-500"
                        : "text-red-600 dark:text-red-500"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                        isSuccess ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div
                      className={`relative rounded-full p-4 ${
                        isSuccess
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle2
                          className="h-16 w-16 animate-in zoom-in duration-500"
                          strokeWidth={2}
                        />
                      ) : (
                        <XCircle
                          className="h-16 w-16 animate-in zoom-in duration-500"
                          strokeWidth={2}
                        />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h1
                      className={`text-3xl font-bold tracking-tight ${
                        isSuccess
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                      }`}
                    >
                      {isSuccess
                        ? "Thanh toán thành công!"
                        : "Thanh toán thất bại"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {isSuccess
                        ? "Giao dịch của bạn đã được xử lý thành công"
                        : "Có lỗi xảy ra trong quá trình thanh toán"}
                    </p>
                  </div>

                  {/* Payment Details Card */}
                  <Card className="w-full border-2 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold">
                        Chi tiết giao dịch
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Số tiền */}
                      {amount && (
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                          <span className="text-sm font-medium text-muted-foreground">
                            Số tiền thanh toán
                          </span>
                          <span className="text-2xl font-bold text-foreground">
                            {amount.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      )}

                      {/* Phương thức thanh toán */}
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Phương thức thanh toán
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full p-1.5 bg-blue-100 dark:bg-blue-900/30">
                            {getPaymentMethodIcon()}
                          </div>
                          <span className="font-semibold text-foreground">
                            {paymentMethod || "VNPay"}
                          </span>
                        </div>
                      </div>

                      {/* Mã giao dịch */}
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          Mã giao dịch
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-foreground">
                            {transactionId}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleCopyTransactionId}
                            title="Sao chép mã giao dịch"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Thời gian thanh toán */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Thời gian thanh toán
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formattedDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Link href={returnPath}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Về trang chủ Staff
                      </Link>
                    </Button>
                    {isSuccess && paymentRecord?.receiptUrl && (
                      <Button
                        asChild
                        variant="default"
                        className="w-full sm:w-auto"
                      >
                        <Link
                          href={paymentRecord.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Xem hóa đơn
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Thông báo bổ sung */}
                  {isSuccess && (
                    <div className="mt-2 rounded-lg bg-green-50 p-4 text-left dark:bg-green-950/20">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Lưu ý:</strong> Vui lòng lưu lại mã giao dịch
                        để tra cứu khi cần thiết. Hóa đơn điện tử đã được gửi
                        đến email của bạn (nếu có).
                      </p>
                    </div>
                  )}
                  {!isSuccess && (
                    <div className="mt-2 rounded-lg bg-red-50 p-4 text-left dark:bg-red-950/20">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Lưu ý:</strong> Nếu bạn đã thực hiện thanh toán
                        nhưng nhận được thông báo này, vui lòng liên hệ bộ phận
                        hỗ trợ với mã giao dịch trên để được hỗ trợ.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
