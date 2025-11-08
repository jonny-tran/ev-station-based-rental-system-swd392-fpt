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
        <CardTitle>Input Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label={
              <>
                Odometer (km)
                <span className="text-red-600"> *</span>
              </>
            }
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
            label={
              <>
                Battery Level (%)
                <span className="text-red-600"> *</span>
              </>
            }
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
          label="Vehicle Condition Notes"
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
          label="Damage Notes (if any)"
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
  label: React.ReactNode;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      {input}
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
