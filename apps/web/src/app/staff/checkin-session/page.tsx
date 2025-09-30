"use client";

import { useState, useMemo } from "react";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/sidebar/page-header";
import { mockService } from "@/packages/services/mock-service";
import { VehicleInspection } from "@/packages/types/vehicleInspection";
import { VehicleInspectionType } from "@/packages/types/enum";
import { CheckInSessionCard } from "@/components/staff/check-in/CheckInSessionCard";
import { CheckInSessionFilters } from "@/components/staff/check-in/CheckInSessionFilters";
import { CheckInSessionPagination } from "@/components/staff/check-in/CheckInSessionPagination";
import { Booking } from "@/packages/types/booking";
import { Vehicle } from "@/packages/types/vehicle";
import { Renter } from "@/packages/types/renter";
import { Account } from "@/packages/types/account";

function SessionCard({ inspection }: { inspection: VehicleInspection }) {
  return <CheckInSessionCard inspection={inspection} />;
}

// Helper function to get related entities for search
function getRelatedEntities(inspection: VehicleInspection) {
  const booking: Booking | undefined = mockService.getBookingById(
    inspection.bookingId
  );
  const vehicle: Vehicle | undefined = booking
    ? mockService.getVehicleById(booking.vehicleId)
    : undefined;
  const renter: Renter | undefined = booking
    ? mockService.getRenterById(booking.renterId)
    : undefined;
  const account: Account | undefined = renter
    ? mockService.getAccountById(renter.accountId)
    : undefined;

  return { booking, vehicle, renter, account };
}

export default function StaffCheckInSessionsPage() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get all check-in sessions
  const allInspections: VehicleInspection[] =
    mockService.getAllVehicleInspections();
  const allCheckInSessions = allInspections.filter(
    (x) => x.inspectionType === VehicleInspectionType.CheckIn
  );

  // Filter and search logic
  const filteredSessions = useMemo(() => {
    let filtered = allCheckInSessions;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((session) => {
        const entities = getRelatedEntities(session);
        const { vehicle, renter, account } = entities;

        const searchableText = [
          vehicle?.licensePlate?.toLowerCase(),
          vehicle?.brand?.toLowerCase(),
          vehicle?.model?.toLowerCase(),
          account?.fullName?.toLowerCase(),
          account?.email?.toLowerCase(),
          renter?.identityNumber?.toLowerCase(),
          session.inspectionId.toLowerCase(),
        ]
          .filter(Boolean)
          .join(" ");

        return searchableText.includes(query);
      });
    }

    return filtered;
  }, [allCheckInSessions, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <PageHeader
          crumbs={[
            { label: "Trang chính Staff", href: "/staff" },
            { label: "Phiên Check-in" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Danh sách phiên Check-in
          </h1>

          {/* Filters */}
          <CheckInSessionFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {filteredSessions.length === allCheckInSessions.length
              ? `${filteredSessions.length} phiên check-in`
              : `${filteredSessions.length} trong ${allCheckInSessions.length} phiên check-in`}
          </div>

          {/* Sessions list */}
          {paginatedSessions.length > 0 ? (
            <div className="space-y-3">
              {paginatedSessions.map((s) => (
                <SessionCard key={s.inspectionId} inspection={s} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Không tìm thấy phiên check-in nào phù hợp với bộ lọc"
                  : "Chưa có phiên check-in nào"}
              </div>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Xóa bộ lọc để xem tất cả
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredSessions.length > 0 && (
            <CheckInSessionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSessions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
