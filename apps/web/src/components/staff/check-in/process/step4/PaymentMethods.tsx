"use client";

import { useMemo, useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/packages/types/payment";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { CreditCard, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const options = useMemo(
    () => [
      {
        value: PaymentMethod.VNPay,
        label: "VNPay",
        description: "Pay via VNPay gateway",
        icon: <CreditCard size={18} />,
      },
      {
        value: PaymentMethod.Cash,
        label: "Cash",
        description: "Pay directly at the counter",
        icon: <Wallet size={18} />,
      },
    ],
    []
  );

  const onConfirm = () => {
    // UI-only: simulate success and redirect to result
    const params = new URLSearchParams();
    params.set("method", method);
    params.set("status", "success");
    params.set("return", "/staff/checkin-session");
    router.push(`/staff/payment-result?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={method}
        onValueChange={setMethod}
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
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
        <Button onClick={onConfirm}>Confirm Payment</Button>
      </div>
    </div>
  );
}
