"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RenterInfoCardProps {
  fullName: string;
  identityNumber: string;
  frontIdentityImageUrl?: string;
  backIdentityImageUrl?: string;
  address?: string;
  dateOfBirth?: string;
}

export function RenterInfoCard(props: RenterInfoCardProps) {
  const {
    fullName,
    identityNumber,
    frontIdentityImageUrl,
    backIdentityImageUrl,
    address,
    dateOfBirth,
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin Renter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Họ tên</div>
          <div className="font-medium">{fullName}</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">CCCD</div>
          <div className="font-medium">{identityNumber}</div>
        </div>

        {address && (
          <div>
            <div className="text-sm text-muted-foreground">Địa chỉ</div>
            <div className="font-medium">{address}</div>
          </div>
        )}

        {dateOfBirth && (
          <div>
            <div className="text-sm text-muted-foreground">Ngày sinh</div>
            <div className="font-medium">{dateOfBirth}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <ImageBox
            title="Mặt trước CCCD"
            src={frontIdentityImageUrl || "https://via.placeholder.com/200x120"}
          />
          <ImageBox
            title="Mặt sau CCCD"
            src={backIdentityImageUrl || "https://via.placeholder.com/200x120"}
          />
        </div>
      </CardContent>
    </Card>
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
