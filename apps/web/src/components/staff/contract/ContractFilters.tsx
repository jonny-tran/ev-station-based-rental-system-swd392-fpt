"use client";

import { ContractStatus } from "@/packages/types/enum";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ContractFilterState {
  keyword: string;
  status: ContractStatus | "All";
}

interface Props {
  value: ContractFilterState;
  onChange: (next: ContractFilterState) => void;
}

export function ContractFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Tìm theo mã HĐ hoặc Booking..."
          value={value.keyword}
          onChange={(e) => onChange({ ...value, keyword: e.target.value })}
        />
      </div>
      <div className="w-[220px]">
        <Select
          value={String(value.status)}
          onValueChange={(v) =>
            onChange({ ...value, status: v as ContractStatus | "All" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả</SelectItem>
            <SelectItem value={ContractStatus.Draft}>Nháp</SelectItem>
            <SelectItem value={ContractStatus.Active}>Hiệu lực</SelectItem>
            <SelectItem value={ContractStatus.Completed}>Hoàn tất</SelectItem>
            <SelectItem value={ContractStatus.Voided}>Voided</SelectItem>
            <SelectItem value={ContractStatus.Terminated}>Chấm dứt</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
