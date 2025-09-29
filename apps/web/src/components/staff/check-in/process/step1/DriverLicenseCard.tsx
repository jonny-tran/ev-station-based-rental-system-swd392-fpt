"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VerifiedStatus = "Verified" | "Pending" | "Rejected";

export interface DriverLicenseData {
  licenseNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuedBy?: string;
  licenseImageUrl?: string;
  verifiedStatus?: VerifiedStatus;
  licenseType?: string;
}

export function DriverLicenseCard({ data }: { data?: DriverLicenseData }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Giấy phép lái xe</CardTitle>
        {data?.verifiedStatus && <VerifiedBadge status={data.verifiedStatus} />}
      </CardHeader>
      <CardContent className="space-y-3">
        <Row label="Số GPLX" value={data?.licenseNumber ?? "—"} />

        <div className="grid grid-cols-2 gap-3">
          <Row label="Ngày cấp" value={data?.issueDate ?? "—"} />
          <Row label="Ngày hết hạn" value={data?.expiryDate ?? "—"} />
        </div>

        <Row label="Nơi cấp" value={data?.issuedBy ?? "—"} />

        {data?.licenseType && (
          <Row label="Loại bằng" value={data.licenseType} />
        )}

        <div className="grid grid-cols-2 gap-3">
          <ImageBox
            title="Ảnh GPLX"
            src={data?.licenseImageUrl || "https://via.placeholder.com/200x120"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium break-words">{value}</div>
    </div>
  );
}

function ImageBox({ title, src }: { title: string; src: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="aspect-[5/3] w-full overflow-hidden rounded border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

function VerifiedBadge({ status }: { status: VerifiedStatus }) {
  const color =
    status === "Verified"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-700";
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
