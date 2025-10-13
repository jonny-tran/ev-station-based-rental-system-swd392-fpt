"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useBookingOperations } from "@/stores/booking.store";
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

  const [activeTab, setActiveTab] = useState<"details" | "qr">("details");

  // Use booking store for API integration
  const { selectedBooking, isDetailsLoading, error, fetchBookingDetails } =
    useBookingOperations();

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId, fetchBookingDetails]);

  useEffect(() => {
    if (error) {
      // Handle error - redirect to booking list if booking not found
      if (error.includes("not found") || error.includes("Invalid booking ID")) {
        router.push("/dashboard/booking");
      }
    }
  }, [error, router]);

  if (isDetailsLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading booking details...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => fetchBookingDetails(bookingId)}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!selectedBooking) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-red-600">Booking not found</div>
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
            { label: "Home", href: "/dashboard" },
            { label: "Booking", href: "/dashboard/booking" },
            { label: "View details" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  View details booking
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <BookingStatusBadge status={selectedBooking.status} />
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
              Details
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
              {/* Special status information */}
              <BookingStatusNote
                status={selectedBooking.status}
                booking={selectedBooking}
              />

              {/* Time and vehicle information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BookingTimeInfo booking={selectedBooking} />
                <BookingVehicleInfo vehicle={selectedBooking.vehicle} />
              </div>

              {/* Location information */}
              <BookingLocationInfo
                rentalLocation={selectedBooking.rentalLocation}
              />

              {/* Payment information */}
              <BookingPaymentInfo booking={selectedBooking} />
            </div>
          )}

          {activeTab === "qr" && (
            <div className="flex justify-center">
              <BookingQRCode bookingId={selectedBooking.bookingId} />
            </div>
          )}

          {/* Footer Actions */}
          <BookingActions
            bookingStatus={selectedBooking.status}
            onBack={() => router.back()}
            onCancel={handleCancelBooking}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
