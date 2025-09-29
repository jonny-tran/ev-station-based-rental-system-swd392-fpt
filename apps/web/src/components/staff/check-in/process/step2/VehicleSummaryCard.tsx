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
        <CardTitle>Thông tin xe</CardTitle>
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
        <Row label="Biển số" value={info.licensePlate} />
        <Row label="Model" value={`${info.brand} ${info.model}`} />
        <Row label="Thương hiệu" value={info.brand} />
        <Row label="Năm" value={info.year ? String(info.year) : "—"} />
        <Row
          label="Số km (DB)"
          value={
            typeof info.odometerKm === "number" ? `${info.odometerKm} km` : "—"
          }
        />
        <Row
          label="Mức pin (DB)"
          value={
            typeof info.batteryLevel === "number"
              ? `${info.batteryLevel}%`
              : "—"
          }
        />
        <Row
          label="Dung lượng pin"
          value={
            typeof info.batteryCapacity === "number"
              ? `${info.batteryCapacity} Wh`
              : "—"
          }
        />
        <Row label="Trạng thái xe" value={info.status || "—"} />
        <Row
          label="Bảo dưỡng gần nhất"
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
