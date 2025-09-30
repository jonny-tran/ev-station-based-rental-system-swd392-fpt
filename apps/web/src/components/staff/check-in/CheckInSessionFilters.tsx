"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { VehicleInspectionStatus } from "@/packages/types/enum";

interface CheckInSessionFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
}

export function CheckInSessionFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: CheckInSessionFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Tìm kiếm theo tên khách hàng, biển số xe..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value={VehicleInspectionStatus.Pending}>
            Đang chờ
          </SelectItem>
          <SelectItem value={VehicleInspectionStatus.Approved}>
            Đã duyệt
          </SelectItem>
          <SelectItem value={VehicleInspectionStatus.Rejected}>
            Đã từ chối
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
