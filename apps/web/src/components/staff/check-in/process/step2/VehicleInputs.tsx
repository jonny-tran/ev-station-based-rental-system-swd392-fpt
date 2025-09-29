"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export type VehicleInputValues = {
  odometerKm?: number;
  batteryLevel?: number;
  conditionNotes?: string;
  damageNotes?: string;
};

export function VehicleInputs({
  values,
  onChange,
  errors,
}: {
  values: VehicleInputValues;
  onChange: (next: VehicleInputValues) => void;
  errors?: Partial<Record<keyof VehicleInputValues, string>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập dữ liệu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Số km Odometer"
            error={errors?.odometerKm}
            input={
              <Input
                type="number"
                value={values.odometerKm ?? ""}
                onChange={(e) =>
                  onChange({ ...values, odometerKm: Number(e.target.value) })
                }
                min={0}
              />
            }
          />
          <Field
            label="Mức pin (%)"
            error={errors?.batteryLevel}
            input={
              <Input
                type="number"
                value={values.batteryLevel ?? ""}
                onChange={(e) =>
                  onChange({ ...values, batteryLevel: Number(e.target.value) })
                }
                min={0}
                max={100}
              />
            }
          />
        </div>

        <Field
          label="Ghi chú tình trạng xe"
          input={
            <Textarea
              value={values.conditionNotes ?? ""}
              onChange={(e) =>
                onChange({ ...values, conditionNotes: e.target.value })
              }
              rows={3}
            />
          }
        />
        <Field
          label="Ghi chú hư hỏng (nếu có)"
          input={
            <Textarea
              value={values.damageNotes ?? ""}
              onChange={(e) =>
                onChange({ ...values, damageNotes: e.target.value })
              }
              rows={3}
            />
          }
        />
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      {input}
      {error ? (
        <div className="text-xs text-red-600">{error}</div>
      ) : null}
    </div>
  );
}


