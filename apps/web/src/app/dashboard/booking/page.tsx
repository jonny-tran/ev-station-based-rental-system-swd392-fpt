"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Booking,
  Vehicle,
  RentalLocation,
  BookingStatus,
  mockService,
} from "@packages";
import { BookingSearchFilters } from "@/components/booking/booking-search-filters";
import { BookingList } from "@/components/booking/booking-list";
import { BookingEmptyState } from "@/components/booking/booking-empty-state";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rentalLocations, setRentalLocations] = useState<RentalLocation[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Mock renter ID - trong thực tế sẽ lấy từ authentication
  const renterId = "r-1";

  useEffect(() => {
    // Lấy dữ liệu bookings và vehicles
    const renterBookings = mockService.getRenterBookings(renterId);
    const allVehicles = renterBookings
      .map((booking) => mockService.getVehicleById(booking.vehicleId))
      .filter(Boolean) as Vehicle[];
    const allRentalLocations = mockService.getAllRentalLocations();

    setBookings(renterBookings);
    setVehicles(allVehicles);
    setRentalLocations(allRentalLocations);
  }, [renterId]);

  const handleViewDetails = (bookingId: string) => {
    router.push(`/dashboard/booking/${bookingId}`);
  };

  // Thứ tự ưu tiên sắp xếp
  const getStatusPriority = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return 1;
      case BookingStatus.Pending:
        return 2;
      case BookingStatus.Completed:
        return 3;
      case BookingStatus.Expired:
        return 4;
      case BookingStatus.Cancelled:
        return 5;
      default:
        return 6;
    }
  };

  // Filter và sort bookings
  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      // Filter theo trạng thái
      const statusMatch =
        filterStatus === "all" || booking.bookingStatus === filterStatus;

      // Filter theo search query
      const searchMatch =
        searchQuery === "" ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicles
          .find((v) => v.vehicleId === booking.vehicleId)
          ?.licensePlate.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vehicles
          .find((v) => v.vehicleId === booking.vehicleId)
          ?.model.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vehicles
          .find((v) => v.vehicleId === booking.vehicleId)
          ?.brand.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Filter theo ngày
      const dateMatch =
        !selectedDate ||
        (new Date(booking.startTime) <= selectedDate &&
          new Date(booking.endTime) >= selectedDate);

      return statusMatch && searchMatch && dateMatch;
    })
    .sort((a, b) => {
      // Sắp xếp theo thứ tự ưu tiên trạng thái
      const priorityA = getStatusPriority(a.bookingStatus);
      const priorityB = getStatusPriority(b.bookingStatus);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Nếu cùng trạng thái, sắp xếp theo thời gian bắt đầu (mới nhất trước)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chủ", href: "/dashboard" },
            { label: "Lịch sử đặt xe" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Lịch sử đặt xe
            </h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi các booking xe điện của bạn
            </p>
          </div>

          {/* Search và Filters */}
          <BookingSearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Danh sách bookings */}
          {filteredAndSortedBookings.length > 0 ? (
            <BookingList
              bookings={filteredAndSortedBookings}
              vehicles={vehicles}
              rentalLocations={rentalLocations}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <BookingEmptyState filterStatus={filterStatus} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
