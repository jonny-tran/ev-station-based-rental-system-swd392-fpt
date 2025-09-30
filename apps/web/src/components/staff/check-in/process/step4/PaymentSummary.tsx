"use client";

import { formatCurrency, mockService } from "@/packages/services/mock-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentSummaryProps {
  contractId?: string;
}

export function PaymentSummary({ contractId }: PaymentSummaryProps) {
  const payments = contractId
    ? mockService.getPaymentsByContractId(contractId)
    : [];

  const total = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tóm tắt thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.map((p) => (
          <div key={p.paymentId} className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {p.paymentType} · {p.paymentMethod}
            </div>
            <div className="font-medium">{formatCurrency(p.amount)}</div>
          </div>
        ))}

        <Separator />
        <div className="flex items-center justify-between">
          <div className="font-medium">Tổng cần thanh toán</div>
          <div className="font-semibold">{formatCurrency(total)}</div>
        </div>
      </CardContent>
    </Card>
  );
}


