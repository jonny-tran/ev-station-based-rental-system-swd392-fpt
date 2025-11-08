"use client";

import { useEffect, useState } from "react";
import { ContractListItem } from "@/packages/types/contract/contract-api";
import { useContractsList } from "@/stores/contract.store";
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
import { ContractStatus } from "@/packages/types/contract/contract-status";

const PAGE_SIZE = 10;

export function ContractList() {
  const {
    contractsList,
    contractsListTotal,
    contractsListPage,
    contractsListPageSize,
    contractsListTotalPages,
    isLoadingContractsList,
    contractsListError,
    fetchContractsList,
    refreshContractsList,
    setContractsListPage,
    setContractsListPageSize,
  } = useContractsList();

  const [filters, setFilters] = useState<ContractFilterState>({
    keyword: "",
    status: "All",
  });

  const load = async () => {
    await fetchContractsList({
      page: contractsListPage,
      pageSize: contractsListPageSize,
      status:
        filters.status !== "All"
          ? (filters.status as ContractStatus)
          : undefined,
      search: filters.keyword || undefined,
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractsListPage, filters.keyword, filters.status]);

  const handleChanged = () => {
    refreshContractsList();
  };

  if (isLoadingContractsList) {
    return (
      <div className="h-[400px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (contractsListError) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-200">
        <p className="text-red-600">{contractsListError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ContractFilters
        value={filters}
        onChange={(v) => {
          setContractsListPage(1);
          setFilters(v);
        }}
      />

      <div className="space-y-3">
        {contractsList.map((c) => (
          <ContractCard
            key={c.contractId}
            contract={c}
            onChanged={handleChanged}
          />
        ))}
        {contractsList.length === 0 && (
          <div className="text-sm text-muted-foreground p-8 text-center border rounded-md">
            No contracts found.
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
                  if (contractsListPage > 1) {
                    setContractsListPage(contractsListPage - 1);
                  }
                }}
                className={
                  contractsListPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: contractsListTotalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={contractsListPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setContractsListPage(i + 1);
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
                  if (contractsListPage < contractsListTotalPages) {
                    setContractsListPage(contractsListPage + 1);
                  }
                }}
                className={
                  contractsListPage >= contractsListTotalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}