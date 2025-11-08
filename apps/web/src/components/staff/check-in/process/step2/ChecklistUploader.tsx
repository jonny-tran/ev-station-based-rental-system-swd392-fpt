"use client";

import { useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type ChecklistPhotos = {
  front?: File | string;
  rear?: File | string;
  left?: File | string;
  right?: File | string;
  odo?: File | string;
  battery?: File | string;
};

const items: {
  key: keyof ChecklistPhotos;
  label: string;
  required?: boolean;
}[] = [
  { key: "front", label: "Front Exterior Photo", required: true },
  { key: "rear", label: "Rear Exterior Photo", required: true },
  { key: "left", label: "Left Side Photo", required: true },
  { key: "right", label: "Right Side Photo", required: true },
  { key: "odo", label: "Odometer Photo", required: true },
  { key: "battery", label: "Battery/Fuel Photo", required: true },
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
    // Save File object directly
    onChange({ ...photos, [key]: file });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Photo Checklist</CardTitle>
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
                    {hasImage ? "Photo uploaded ✅" : "No photo"}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handlePick(it.key)}
                >
                  {hasImage ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
              {hasImage && (
                <div className="mt-3">
                  <Image
                    src={
                      typeof photos[it.key] === "string"
                        ? (photos[it.key] as string)
                        : URL.createObjectURL(photos[it.key] as File)
                    }
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
                aria-label={`Upload ${it.label}`}
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
