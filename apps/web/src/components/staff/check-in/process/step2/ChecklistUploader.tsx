"use client";

import { useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type ChecklistPhotos = {
  front?: string;
  rear?: string;
  left?: string;
  right?: string;
  odo?: string;
  battery?: string;
};

const items: {
  key: keyof ChecklistPhotos;
  label: string;
  required?: boolean;
}[] = [
  { key: "front", label: "Ảnh ngoại thất trước", required: true },
  { key: "rear", label: "Ảnh ngoại thất sau", required: true },
  { key: "left", label: "Ảnh bên trái", required: true },
  { key: "right", label: "Ảnh bên phải", required: true },
  { key: "odo", label: "Ảnh đồng hồ ODO", required: true },
  { key: "battery", label: "Ảnh pin/nhiên liệu", required: true },
];

export function ChecklistUploader({
  photos,
  onChange,
}: {
  photos: ChecklistPhotos;
  onChange: (next: ChecklistPhotos) => void;
}) {
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePick = (key: keyof ChecklistPhotos) => {
    fileInputs.current[key]?.click();
  };

  const handleFile = (key: keyof ChecklistPhotos, file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...photos, [key]: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist ảnh bắt buộc</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((it) => {
          const hasImage = Boolean(photos[it.key]);
          return (
            <div key={it.key} className="rounded border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {it.label}
                    {it.required ? (
                      <span className="text-red-600"> *</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {hasImage ? "Đã tải ảnh ✅" : "Chưa có ảnh"}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handlePick(it.key)}
                >
                  {hasImage ? "Đổi ảnh" : "Tải ảnh"}
                </Button>
              </div>
              {hasImage && (
                <div className="mt-3">
                  <Image
                    src={photos[it.key] as string}
                    alt={it.label}
                    width={800}
                    height={450}
                    className="w-full rounded object-cover h-48 md:h-56"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                aria-label={`Tải ${it.label}`}
                ref={(el) => {
                  fileInputs.current[it.key] = el;
                }}
                onChange={(e) => handleFile(it.key, e.target.files?.[0])}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
