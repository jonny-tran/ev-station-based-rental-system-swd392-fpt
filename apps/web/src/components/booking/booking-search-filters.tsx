import { Calendar, Filter, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { BookingStatus } from "@packages";

interface BookingSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: BookingStatus | "all";
  onFilterChange: (status: BookingStatus | "all") => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function BookingSearchFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  selectedDate,
  onDateChange,
}: BookingSearchFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      {/* Search bar */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by booking ID, license plate, model, brand..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center lg:flex-shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Status:</span>
          <Select value={filterStatus} onValueChange={onFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={BookingStatus.Pending}>Pending</SelectItem>
              <SelectItem value={BookingStatus.Confirmed}>Confirmed</SelectItem>
              <SelectItem value={BookingStatus.Completed}>Completed</SelectItem>
              <SelectItem value={BookingStatus.Cancelled}>Cancelled</SelectItem>
              <SelectItem value={BookingStatus.Expired}>Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Date:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-start text-left font-normal"
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("vi-VN")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
              />
              {selectedDate && (
                <div className="p-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onDateChange(undefined)}
                  >
                    Clear date filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
