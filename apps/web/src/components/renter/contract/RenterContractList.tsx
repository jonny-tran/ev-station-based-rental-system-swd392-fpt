"use client";

import { useEffect, useMemo, useState } from "react";
import { Contract } from "@/packages/types/contract";
import { ContractService } from "@/packages/services/contract.service";
import { ContractListItem } from "@/packages/types/contract/contract-api";
import { RenterContractCard } from "./RenterContractCard";
import {
  RenterContractFilters,
  RenterContractFilterState,
} from "./RenterContractFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ContractApiError } from "@/packages/types/contract/contract-api";

const PAGE_SIZE = 10;

interface Props {
  renterId: string;
}

// Map API response to Contract type
function mapApiContractToContract(apiContract: ContractListItem): Contract {
  return {
    contractId: apiContract.contractId,
    bookingId: apiContract.bookingId,
    createdByStaffId: "", // Not available in list response
    startDate: apiContract.startDate,
    endDate: apiContract.endDate,
    signedAt: apiContract.signedAt,
    signedByRenter: apiContract.signedByRenter,
    signedByStaff: apiContract.signedByStaff,
    status: apiContract.status,
    statusReason: undefined, // Not available in list response
    createdAt: apiContract.createdAt,
    updatedAt: apiContract.updatedAt,
    deletedAt: undefined,
  };
}

export function RenterContractList({ renterId }: Props) {
  const [items, setItems] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<RenterContractFilterState>({
    keyword: "",
    status: "All",
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await ContractService.getRenterContracts({
        page,
        pageSize: PAGE_SIZE,
        status: filters.status !== "All" ? filters.status : undefined,
        search: filters.keyword || undefined,
      });

      if (response.data) {
        const contracts = response.data.contracts.map(mapApiContractToContract);
        setItems(contracts);
        setTotal(response.data.total);
      }
    } catch (err) {
      const errorMessage =
        err instanceof ContractApiError
          ? err.message
          : "Failed to load contracts. Please try again.";
      setError(errorMessage);
      console.error("Error loading contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.keyword, filters.status, renterId]);

  const handleChanged = () => {
    load();
  };

  return (
    <div className="space-y-4">
      <RenterContractFilters
        value={filters}
        onChange={(v) => {
          setPage(1);
          setFilters(v);
        }}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="text-sm text-muted-foreground p-8 text-center border rounded-md">
          Loading contracts...
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-3">
            {items.map((c) => (
              <RenterContractCard
                key={c.contractId}
                contract={c}
                renterId={renterId}
                onChanged={handleChanged}
              />
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground p-8 text-center border rounded-md">
                No contracts found.
              </div>
            )}
          </div>

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
}

