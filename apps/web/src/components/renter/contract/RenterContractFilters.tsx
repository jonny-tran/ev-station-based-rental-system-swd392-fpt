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

export interface RenterContractFilterState {
  keyword: string;
  status: ContractStatus | "All";
}

interface Props {
  value: RenterContractFilterState;
  onChange: (next: RenterContractFilterState) => void;
}

export function RenterContractFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Search by contract ID or booking ID..."
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
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value={ContractStatus.Active}>Active</SelectItem>
            <SelectItem value={ContractStatus.Completed}>Completed</SelectItem>
            <SelectItem value={ContractStatus.Voided}>Voided</SelectItem>
            <SelectItem value={ContractStatus.Terminated}>Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

