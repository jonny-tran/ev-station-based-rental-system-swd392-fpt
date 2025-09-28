"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Booking,
  Vehicle,
  RentalLocation,
  Account,
  mockService,
} from "@packages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode } from "lucide-react";
import { BookingQRCode } from "@/components/booking/details/booking-qr-code";
import { BookingStatusBadge } from "@/components/booking/booking-status-badge";
import { BookingStatusNote } from "@/components/booking/booking-status-note";
import { BookingTimeInfo } from "@/components/booking/details/booking-time-info";
import { BookingVehicleInfo } from "@/components/booking/details/booking-vehicle-info";
import { BookingLocationInfo } from "@/components/booking/details/booking-location-info";
import { BookingPaymentInfo } from "@/components/booking/details/booking-payment-info";
import { BookingActions } from "@/components/booking/details/booking-actions";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [rentalLocation, setRentalLocation] = useState<RentalLocation | null>(
    null
  );
  const [, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "qr">("details");

  useEffect(() => {
    const loadBookingData = () => {
      const bookingData = mockService.getBookingById(bookingId);
      if (!bookingData) {
        router.push("/dashboard");
        return;
      }

      const vehicleData = mockService.getVehicleById(bookingData.vehicleId);
      const locationData = mockService.getRentalLocationById(
        bookingData.rentalLocationId
      );
      const renterData = mockService.getRenterById(bookingData.renterId);
      const accountData = renterData
        ? mockService.getAccountById(renterData.accountId)
        : null;

      setBooking(bookingData);
      setVehicle(vehicleData || null);
      setRentalLocation(locationData || null);
      setAccount(accountData || null);
      setLoading(false);
    };

    loadBookingData();
  }, [bookingId, router]);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Đang tải...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!booking || !vehicle || !rentalLocation) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-red-600">Không tìm thấy booking</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const handleCancelBooking = () => {
    // TODO: Implement cancel booking logic
    console.log("Cancel booking:", bookingId);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chủ", href: "/dashboard" },
            { label: "Lịch sử đặt xe", href: "/dashboard/booking" },
            { label: "Xem chi tiết" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Xem chi tiết booking #{bookingId}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <BookingStatusBadge status={booking.bookingStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chi tiết
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "qr"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <QrCode className="h-4 w-4 mr-2 inline" />
              QR Code
            </button>
          </div>

          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Thông tin trạng thái đặc biệt */}
              <BookingStatusNote status={booking.bookingStatus} />

              {/* Thông tin thời gian và xe */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BookingTimeInfo booking={booking} />
                <BookingVehicleInfo vehicle={vehicle} />
              </div>

              {/* Thông tin địa điểm */}
              <BookingLocationInfo rentalLocation={rentalLocation} />

              {/* Thông tin thanh toán */}
              <BookingPaymentInfo booking={booking} />
            </div>
          )}

          {activeTab === "qr" && (
            <div className="flex justify-center">
              <BookingQRCode
                bookingId={booking.bookingId}
                vehicleInfo={`${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}`}
                rentalLocation={rentalLocation.name}
                startTime={booking.startTime}
                endTime={booking.endTime}
              />
            </div>
          )}

          {/* Footer Actions */}
          <BookingActions
            bookingStatus={booking.bookingStatus}
            onBack={() => router.back()}
            onCancel={handleCancelBooking}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
