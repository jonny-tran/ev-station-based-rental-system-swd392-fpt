"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toLocal } from "@/packages/utils/datetime";

type VehicleInfo = {
  licensePlate: string;
  brand: string;
  model: string;
  year?: number;
  odometerKm?: number;
  batteryLevel?: number;
  batteryCapacity?: number;
  status?: string;
  lastServiceDate?: string;
  imageUrl?: string;
};

export function VehicleSummaryCard({ info }: { info: VehicleInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {info.imageUrl ? (
          <div className="relative h-28 w-full overflow-hidden rounded">
            <Image
              src={info.imageUrl}
              alt={`${info.brand} ${info.model}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <Row label="License Plate" value={info.licensePlate} />
        <Row label="Model" value={`${info.brand} ${info.model}`} />
        <Row label="Brand" value={info.brand} />
        <Row label="Year" value={info.year ? String(info.year) : "—"} />
        <Row
          label="Odometer (DB)"
          value={
            typeof info.odometerKm === "number" ? `${info.odometerKm} km` : "—"
          }
        />
        <Row
          label="Battery Level (DB)"
          value={
            typeof info.batteryLevel === "number"
              ? `${info.batteryLevel}%`
              : "—"
          }
        />
        <Row
          label="Battery Capacity"
          value={
            typeof info.batteryCapacity === "number"
              ? `${info.batteryCapacity} Wh`
              : "—"
          }
        />
        <Row label="Vehicle Status" value={info.status || "—"} />
        <Row
          label="Last Maintenance"
          value={info.lastServiceDate ? toLocal(info.lastServiceDate) : "—"}
        />
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium truncate">{value}</div>
    </div>
  );
}
