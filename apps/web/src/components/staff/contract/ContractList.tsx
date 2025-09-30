"use client";

import { useEffect, useMemo, useState } from "react";
import { Contract } from "@/packages/types/contract";
import { mockService } from "@/packages/services/mock-service";
import { ContractCard } from "./ContractCard";
import { ContractFilters, ContractFilterState } from "./ContractFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export function ContractList() {
  const [items, setItems] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ContractFilterState>({
    keyword: "",
    status: "All",
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const load = () => {
    const { items, total } = mockService.getContracts({
      page,
      pageSize: PAGE_SIZE,
      status: filters.status,
      keyword: filters.keyword,
    });
    setItems(items);
    setTotal(total);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.keyword, filters.status]);

  const handleChanged = () => {
    load();
  };

  return (
    <div className="space-y-4">
      <ContractFilters
        value={filters}
        onChange={(v) => {
          setPage(1);
          setFilters(v);
        }}
      />

      <div className="space-y-3">
        {items.map((c) => (
          <ContractCard
            key={c.contractId}
            contract={c}
            onChanged={handleChanged}
          />
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground p-8 text-center border rounded-md">
            Không có hợp đồng nào phù hợp.
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
