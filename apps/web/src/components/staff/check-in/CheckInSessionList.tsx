"use client";

import { useEffect } from "react";
import { CheckInSessionCard } from "./CheckInSessionCard";
import { CheckInSessionFilters } from "./CheckInSessionFilters";
import { CheckInSessionPagination } from "./CheckInSessionPagination";
import { useSessionsList } from "@/stores/checkin-session.store";
import {
  CheckInSessionListItem,
  InspectionStatus,
} from "@/packages/types/checkin";
import { useState } from "react";

interface CheckInSessionListProps {
  className?: string;
}

export function CheckInSessionList({
  className = "",
}: CheckInSessionListProps) {
  // Use store for sessions list
  const {
    sessionsList,
    sessionsListTotal,
    sessionsListPage,
    sessionsListPageSize,
    isSessionsListLoading,
    sessionsListError,
    fetchSessionsList,
    refreshSessionsList,
  } = useSessionsList();

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load sessions on component mount
  useEffect(() => {
    fetchSessionsList({
      page: 1,
      pageSize: 10,
    });
  }, [fetchSessionsList]);

  // Handle filter changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handlePageChange = (page: number) => {
    fetchSessionsList({
      page,
      pageSize: sessionsListPageSize,
      search: searchQuery || undefined,
      status:
        statusFilter !== "all" ? (statusFilter as InspectionStatus) : undefined,
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    fetchSessionsList({
      page: 1,
      pageSize: newItemsPerPage,
      search: searchQuery || undefined,
      status:
        statusFilter !== "all" ? (statusFilter as InspectionStatus) : undefined,
    });
  };

  // Apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSessionsList({
        page: 1,
        pageSize: sessionsListPageSize,
        search: searchQuery || undefined,
        status:
          statusFilter !== "all"
            ? (statusFilter as InspectionStatus)
            : undefined,
      });
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, fetchSessionsList, sessionsListPageSize]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <CheckInSessionFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading state */}
      {isSessionsListLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
            Loading check-in sessions...
          </span>
        </div>
      )}

      {/* Error state */}
      {sessionsListError && !isSessionsListLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-destructive mb-4">{sessionsListError}</div>
          <button
            onClick={() => refreshSessionsList()}
            className="text-sm text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results count */}
      {!isSessionsListLoading && !sessionsListError && (
        <div className="text-sm text-muted-foreground">
          {sessionsListTotal > 0
            ? `${sessionsListTotal} check-in sessions`
            : "No check-in sessions yet"}
        </div>
      )}

      {/* Sessions list */}
      {!isSessionsListLoading &&
        !sessionsListError &&
        sessionsList.length > 0 && (
          <div className="space-y-3">
            {sessionsList.map((session: CheckInSessionListItem) => (
              <CheckInSessionCard
                key={session.inspectionId}
                session={session}
              />
            ))}
          </div>
        )}

      {/* Empty state */}
      {!isSessionsListLoading &&
        !sessionsListError &&
        sessionsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No check-in sessions match the current filters"
                : "No check-in sessions yet"}
            </div>
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={handleClearFilters}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Clear filters to view all
              </button>
            )}
          </div>
        )}

      {/* Pagination */}
      {!isSessionsListLoading &&
        !sessionsListError &&
        sessionsListTotal > 0 && (
          <CheckInSessionPagination
            currentPage={sessionsListPage}
            totalPages={Math.ceil(sessionsListTotal / sessionsListPageSize)}
            totalItems={sessionsListTotal}
            itemsPerPage={sessionsListPageSize}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
    </div>
  );
}
