"use client";

import { useMemo, useState, useTransition } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/packages/types/payment";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaymentService } from "@/packages/services/payment.service";
import { toast } from "@/lib/toast";

interface PaymentMethodsProps {
  inspectionId: string;
  contractId?: string;
}

export function PaymentMethods({
  inspectionId,
  contractId,
}: PaymentMethodsProps) {
  const router = useRouter();
  const [method, setMethod] = useState<string>(PaymentMethod.VNPay);
  const [isPending, startTransition] = useTransition();

  const options = useMemo(
    () => [
      {
        value: PaymentMethod.VNPay,
        label: "VNPay",
        description: "Pay via VNPay gateway",
        icon: <CreditCard size={18} />,
      },
    ],
    []
  );

  const onConfirm = () => {
    startTransition(async () => {
      try {
        // Gọi API để tạo payment URL
        const response = await PaymentService.createPaymentUrl(
          inspectionId,
          method as PaymentMethod
        );

        if (response.paymentUrl) {
          // Redirect đến VNPay payment URL
          window.location.href = response.paymentUrl;
        } else {
          toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại.");
        }
      } catch (error: any) {
        console.error("Error creating payment URL:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Không thể tạo URL thanh toán. Vui lòng thử lại.";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={method}
        onValueChange={setMethod}
        className="grid grid-cols-1 gap-3"
      >
        {options.map((opt) => (
          <PaymentMethodCard
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            selected={method === opt.value}
          />
        ))}
      </RadioGroup>

      <div className="flex items-center justify-end gap-3">
        <Button onClick={onConfirm} disabled={isPending}>
          {isPending ? "Đang tạo URL thanh toán..." : "Xác nhận thanh toán"}
        </Button>
      </div>
    </div>
  );
}
