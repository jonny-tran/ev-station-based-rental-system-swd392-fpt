"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";

interface PaymentMethodCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
}

export function PaymentMethodCard({
  value,
  label,
  description,
  icon,
  selected,
}: PaymentMethodCardProps) {
  return (
    <label htmlFor={`pm-${value}`} className="cursor-pointer">
      <Card
        className={cn(
          "relative flex items-center gap-4 p-4 transition-shadow",
          selected ? "ring-2 ring-primary shadow-sm" : "hover:shadow"
        )}
      >
        <RadioGroupItem id={`pm-${value}`} value={value} />
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-medium leading-none">{label}</div>
          {description ? (
            <div className="text-sm text-muted-foreground">{description}</div>
          ) : null}
        </div>
        {selected ? (
          <Check className="text-primary" size={18} aria-hidden="true" />
        ) : null}
      </Card>
    </label>
  );
}


