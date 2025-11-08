"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

/**
 * VNPay Callback Handler
 * 
 * Route này nhận callback từ VNPay sau khi thanh toán
 * VNPay sẽ redirect về route này với các query parameters:
 * - vnp_Amount: Số tiền thanh toán (đã nhân 100)
 * - vnp_BankCode: Mã ngân hàng
 * - vnp_BankTranNo: Mã giao dịch tại ngân hàng
 * - vnp_CardType: Loại thẻ
 * - vnp_OrderInfo: Thông tin đơn hàng
 * - vnp_PayDate: Ngày thanh toán
 * - vnp_ResponseCode: Mã phản hồi (00 = thành công)
 * - vnp_TmnCode: Mã terminal
 * - vnp_TransactionNo: Mã giao dịch tại VNPay
 * - vnp_TransactionStatus: Trạng thái giao dịch (00 = thành công)
 * - vnp_TxnRef: Mã tham chiếu đơn hàng (Payment ID)
 * - vnp_SecureHash: Mã bảo mật
 */
function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Lấy các params từ VNPay callback
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus");
    const vnpTxnRef = searchParams.get("vnp_TxnRef"); // Payment ID
    const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
    const vnpAmount = searchParams.get("vnp_Amount");
    const vnpOrderInfo = searchParams.get("vnp_OrderInfo");
    const vnpPayDate = searchParams.get("vnp_PayDate");

    // Xác định trạng thái thanh toán
    // vnp_ResponseCode = "00" và vnp_TransactionStatus = "00" => thành công
    const isSuccess =
      vnpResponseCode === "00" && vnpTransactionStatus === "00";

    // Chuyển đổi amount từ VNPay format (đã nhân 100) về VND
    const amount = vnpAmount ? parseInt(vnpAmount) / 100 : null;

    // Build URL để redirect đến payment result page
    const params = new URLSearchParams();
    
    if (vnpTxnRef) {
      params.set("paymentId", vnpTxnRef);
    }
    
    if (isSuccess) {
      params.set("status", "success");
    } else {
      params.set("status", "failed");
    }
    
    params.set("method", "VNPay");
    params.set("return", "/staff/checkin-session");
    
    // Thêm các thông tin bổ sung nếu có
    if (vnpTransactionNo) {
      params.set("transactionId", vnpTransactionNo);
    }
    
    if (amount) {
      params.set("amount", amount.toString());
    }

    // Redirect đến payment result page
    router.replace(`/staff/payment-result?${params.toString()}`);
  }, [searchParams, router]);

  // Hiển thị loading trong khi xử lý callback
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-lg font-medium">Đang xử lý kết quả thanh toán...</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-lg font-medium">Đang tải...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}

