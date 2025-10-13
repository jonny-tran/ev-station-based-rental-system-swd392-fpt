"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BookingStatus } from "@packages";
import { BookingSearchFilters } from "@/components/booking/booking-search-filters";
import { BookingList } from "@/components/booking/booking-list";
import { BookingEmptyState } from "@/components/booking/booking-empty-state";
import { useRouter } from "next/navigation";
import { useBookingOperations } from "@/stores/booking.store";

export default function BookingPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Use booking store for API integration
  const { bookings, isLoading, error, fetchAllBookings } =
    useBookingOperations();

  useEffect(() => {
    // Fetch bookings from API on component mount
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleViewDetails = (bookingId: string) => {
    router.push(`/dashboard/booking/${bookingId}`);
  };

  // Priority order sorting
  const getStatusPriority = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return 1;
      case BookingStatus.Confirmed:
        return 2;
      case BookingStatus.Completed:
        return 3;
      case BookingStatus.Cancelled:
        return 4;
      case BookingStatus.Expired:
        return 5;
      default:
        return 6;
    }
  };

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      // Filter by status
      const statusMatch =
        filterStatus === "all" || booking.status === filterStatus;

      // Filter by search query - search in booking ID, vehicle name, and license plate
      const searchMatch =
        searchQuery === "" ||
        booking.bookingId
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        booking.vehicle.licensePlate
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()) ||
        booking.vehicle.name
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim());

      // Filter by date
      const dateMatch =
        !selectedDate ||
        (new Date(booking.startTime) <= selectedDate &&
          new Date(booking.endTime) >= selectedDate);

      return statusMatch && searchMatch && dateMatch;
    })
    .sort((a, b) => {
      // Sort by priority status
      const priorityA = getStatusPriority(a.status);
      const priorityB = getStatusPriority(b.status);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same status, sort by start time (newest first)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Booking" },
          ]}
        />

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Booking</h1>
            <p className="text-muted-foreground">
              Manage and track your electric vehicle bookings
            </p>
          </div>

          {/* Search and Filters */}
          <BookingSearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchAllBookings}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Booking list */}
          {!isLoading && !error && filteredAndSortedBookings.length > 0 && (
            <BookingList
              bookings={filteredAndSortedBookings}
              onViewDetails={handleViewDetails}
            />
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredAndSortedBookings.length === 0 && (
            <BookingEmptyState filterStatus={filterStatus} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
