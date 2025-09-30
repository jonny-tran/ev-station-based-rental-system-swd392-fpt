"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { mockService } from "@/packages/services/mock-service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

export default function ReturnCheckoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.inspectionId as string;

  const inspection = useMemo(() => {
    return mockService.getVehicleInspectionById(inspectionId);
  }, [inspectionId]);

  const booking = useMemo(() => {
    if (!inspection) return undefined;
    return mockService.getBookingById(inspection.bookingId);
  }, [inspection]);

  const [odoEnd, setOdoEnd] = useState<number | undefined>(
    inspection?.odometerKm
  );
  const [batteryEnd, setBatteryEnd] = useState<number | undefined>(
    inspection?.batteryLevel
  );
  const [damageNotes, setDamageNotes] = useState<string>(
    inspection?.damageNotes || ""
  );
  const [vehicleNotes, setVehicleNotes] = useState<string>(
    inspection?.vehicleConditionNotes || ""
  );

  // State cho việc chụp ảnh
  const [photos, setPhotos] = useState<string[]>(inspection?.photoUrls || []);

  const vehicle = useMemo(() => {
    if (!booking) return undefined;
    return mockService.getVehicleById(booking.vehicleId);
  }, [booking]);

  const renter = useMemo(() => {
    if (!booking) return undefined;
    return mockService.getRenterById(booking.renterId);
  }, [booking]);

  const account = useMemo(() => {
    if (!renter) return undefined;
    return mockService.getAccountById(renter.accountId);
  }, [renter]);

  const contract = useMemo(() => {
    if (!inspection?.contractId) return undefined;
    return mockService.getContractById(inspection.contractId);
  }, [inspection]);

  // Lấy thông tin check-in để so sánh
  const checkInInspection = useMemo(() => {
    if (!inspection?.contractId) return undefined;
    return mockService.getCheckInSessionByBookingOrContract({
      contractId: inspection.contractId,
    });
  }, [inspection]);

  if (!inspection || !booking) {
    return (
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <PageHeader
            crumbs={[
              { label: "Trang chính Staff", href: "/staff" },
              { label: "Trả xe", href: "/staff/return" },
              { label: "Xem chi tiết" },
            ]}
          />
          <div className="p-6">Không tìm thấy phiên trả xe.</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const handleSave = () => {
    mockService.updateCheckoutInspection(inspection.inspectionId, {
      odometerKm: odoEnd,
      batteryLevel: batteryEnd,
      vehicleConditionNotes: vehicleNotes,
      damageNotes,
      photoUrls: photos,
    });
  };

  const addPhoto = () => {
    // Mock thêm ảnh mới
    const newPhoto = `https://mock.cloudinary.com/return-${Date.now()}.jpg`;
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const goCompleteDirectly = () => {
    handleSave();
    mockService.finalizeReturn(inspection.inspectionId);
    router.push("/staff/return");
  };

  const goToSettlement = () => {
    handleSave();
    router.push(`/staff/return/${inspection.inspectionId}/settlement`);
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Trả xe", href: "/staff/return" },
            { label: "Xem chi tiết" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link href="/staff/return">Quay lại</Link>
              </Button>
              <h1 className="text-2xl font-semibold">
                {inspection.status === "Approved"
                  ? "Chi tiết trả xe"
                  : "Thực hiện trả xe"}
              </h1>
            </div>
            <Badge
              variant={
                inspection.status === "Approved" ? "default" : "secondary"
              }
            >
              {inspection.status === "Approved"
                ? "Đã hoàn thành"
                : "Đang thực hiện"}
            </Badge>
          </div>

          {/* Bảng so sánh thông số */}
          <div className="rounded-md border p-4 bg-gray-50">
            <h3 className="font-semibold mb-4">So sánh thông số xe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700">Khi nhận xe</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">ODO:</span>{" "}
                    {checkInInspection?.odometerKm || "N/A"} km
                  </div>
                  <div>
                    <span className="font-medium">Pin:</span>{" "}
                    {checkInInspection?.batteryLevel || "N/A"}%
                  </div>
                  <div>
                    <span className="font-medium">Thời gian:</span>{" "}
                    {checkInInspection
                      ? format(
                          new Date(checkInInspection.inspectionAt),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-700">Khi trả xe</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">ODO:</span>{" "}
                    {odoEnd || "Chưa nhập"} km
                  </div>
                  <div>
                    <span className="font-medium">Pin:</span>{" "}
                    {batteryEnd || "Chưa nhập"}%
                  </div>
                  <div>
                    <span className="font-medium">Thời gian:</span>{" "}
                    {format(
                      new Date(inspection.inspectionAt),
                      "dd/MM/yyyy HH:mm",
                      { locale: vi }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Cột 1: Thông tin trả xe */}
            <div className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-4">Thông tin trả xe</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">ODO cuối (km)</label>
                    <Input
                      type="number"
                      value={odoEnd ?? ""}
                      onChange={(e) => setOdoEnd(Number(e.target.value))}
                      placeholder="Nhập ODO khi trả"
                      disabled={inspection.status === "Approved"}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Mức pin cuối (%)
                    </label>
                    <Input
                      type="number"
                      value={batteryEnd ?? ""}
                      onChange={(e) => setBatteryEnd(Number(e.target.value))}
                      placeholder="Nhập % pin khi trả"
                      disabled={inspection.status === "Approved"}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Ghi chú tình trạng xe
                    </label>
                    <Textarea
                      value={vehicleNotes}
                      onChange={(e) => setVehicleNotes(e.target.value)}
                      rows={3}
                      disabled={inspection.status === "Approved"}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Ghi chú hư hại
                    </label>
                    <Textarea
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      rows={3}
                      disabled={inspection.status === "Approved"}
                    />
                  </div>
                </div>
              </div>

              {/* Phần chụp ảnh */}
              {inspection.status !== "Approved" && (
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      Chụp ảnh kiểm tra (≥6 ảnh)
                    </h3>
                    <Button onClick={addPhoto} size="sm">
                      + Thêm ảnh
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-md border flex items-center justify-center">
                          <Image
                            src={photo}
                            alt={`Ảnh ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    {photos.length < 6 && (
                      <div className="aspect-square bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-sm">Chưa đủ 6 ảnh</div>
                          <div className="text-xs">{photos.length}/6</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hiển thị ảnh nếu đã hoàn thành */}
              {inspection.status === "Approved" && photos.length > 0 && (
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold mb-4">
                    Ảnh kiểm tra ({photos.length} ảnh)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-md border"
                      >
                        <Image
                          src={photo}
                          alt={`Ảnh ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cột 2: Thông tin khách hàng */}
            <div className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-4">Thông tin khách hàng</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Họ tên:</span>{" "}
                    {account?.fullName || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {account?.email || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">SĐT:</span>{" "}
                    {account?.phoneNumber || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">CCCD:</span>{" "}
                    {renter?.identityNumber || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {renter?.address || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Ngày sinh:</span>{" "}
                    {renter?.dateOfBirth || "N/A"}
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-4">Thông tin xe</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Biển số:</span>{" "}
                    {vehicle?.licensePlate || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Hãng:</span>{" "}
                    {vehicle?.brand || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Model:</span>{" "}
                    {vehicle?.model || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Năm:</span>{" "}
                    {vehicle?.year || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Dung lượng pin:</span>{" "}
                    {vehicle?.batteryCapacity
                      ? `${vehicle.batteryCapacity}Wh`
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Số chu kỳ sạc:</span>{" "}
                    {vehicle?.chargingCycles || "N/A"}
                  </div>
                </div>
              </div>

              {/* Thông tin xe khi nhận (check-in) */}
              {checkInInspection && (
                <div className="rounded-md border p-4 bg-blue-50/50">
                  <h3 className="font-semibold mb-4 text-blue-700">
                    Thông tin khi nhận xe
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ODO đầu (km):</span>{" "}
                      {checkInInspection.odometerKm || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Mức pin đầu (%):</span>{" "}
                      {checkInInspection.batteryLevel || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Ghi chú nhận xe:</span>{" "}
                      {checkInInspection.vehicleConditionNotes || "Không có"}
                    </div>
                    <div>
                      <span className="font-medium">Thời gian nhận:</span>{" "}
                      {format(
                        new Date(checkInInspection.inspectionAt),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cột 3: Thông tin booking & hợp đồng */}
            <div className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-4">Thông tin booking</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Mã booking:</span>{" "}
                    {booking.bookingId}
                  </div>
                  <div>
                    <span className="font-medium">Thời gian thuê:</span>
                  </div>
                  <div className="ml-2 text-muted-foreground">
                    {format(new Date(booking.startTime), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </div>
                  <div className="ml-2 text-muted-foreground">
                    {format(new Date(booking.endTime), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </div>
                  <div>
                    <span className="font-medium">Tiền cọc:</span>{" "}
                    {booking.depositAmount?.toLocaleString("vi-VN")}đ
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {booking.bookingStatus}
                  </div>
                </div>
              </div>

              {contract && (
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold mb-4">Thông tin hợp đồng</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Mã hợp đồng:</span>{" "}
                      {contract.contractId}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>{" "}
                      {contract.status}
                    </div>
                    <div>
                      <span className="font-medium">Ngày bắt đầu:</span>{" "}
                      {format(new Date(contract.startDate), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Ngày kết thúc:</span>{" "}
                      {format(new Date(contract.endDate), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Khách ký:</span>{" "}
                      {contract.signedByRenter ? "✓" : "✗"}
                    </div>
                    <div>
                      <span className="font-medium">Staff ký:</span>{" "}
                      {contract.signedByStaff ? "✓" : "✗"}
                    </div>
                    <div className="pt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/staff/contract/${contract.contractId}/detail`}
                        >
                          Xem chi tiết hợp đồng
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chỉ hiển thị button khi chưa hoàn thành */}
          {inspection.status !== "Approved" && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={goCompleteDirectly}>
                Hoàn thành trả xe
              </Button>
              <Button onClick={goToSettlement}>Tính phí phát sinh</Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
