/**
 * Contract Store using Zustand
 * Global state management for contract operations
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContractService } from "@/packages/services";
import {
  ContractApiError,
  ContractErrorCode,
} from "@/packages/types/contract/contract-api";
import {
  ContractDetailsResponse,
  ContractListResponse,
  ContractListItem,
  ContractListQuery,
} from "@/packages/types/contract/contract-api";
import { ContractStatus } from "@/packages/types/contract/contract-status";
import { toast } from "@/lib/toast";
import { useLoadingStore } from "./loading.store";

// Interface for contract state
interface ContractState {
  // Contract Details State
  contractDetails: ContractDetailsResponse | null;
  isLoadingContractDetails: boolean;
  contractDetailsError: string | null;

  // Contract List State
  contractsList: ContractListItem[];
  contractsListTotal: number;
  contractsListPage: number;
  contractsListPageSize: number;
  contractsListTotalPages: number;
  isLoadingContractsList: boolean;
  contractsListError: string | null;

  // Current Contract State
  currentContractId: string | null;

  // Actions for Contract Details
  loadContractDetails: (contractId: string) => Promise<void>;
  loadContractByInspectionId: (inspectionId: number) => Promise<void>;
  clearContractDetails: () => void;

  // Actions for Contract List
  fetchContractsList: (query?: ContractListQuery) => Promise<void>;
  refreshContractsList: () => Promise<void>;
  clearContractsList: () => void;
  setContractsListPage: (page: number) => void;
  setContractsListPageSize: (pageSize: number) => void;

  // Actions for Contract Operations
  submitContract: (
    contractId: string,
    renterInfo: {
      fullName: string;
      email: string;
      phoneNumber: string;
    }
  ) => Promise<void>;
  staffSignContract: (contractId: string, signatureData?: string) => Promise<void>;
  rejectContract: (contractId: string, reason: string) => Promise<void>;
  approveStep3: (inspectionId: number) => Promise<void>;

  // Computed states
  getContractStatus: () => ContractStatus | null;
  isContractSignedByRenter: () => boolean;
  isContractSignedByStaff: () => boolean;
  canStaffSign: () => boolean;
  canSubmitContract: () => boolean;
}

export const useContractStore = create<ContractState>()(
  persist(
    (set, get) => ({
      // Initial state
      contractDetails: null,
      isLoadingContractDetails: false,
      contractDetailsError: null,

      contractsList: [],
      contractsListTotal: 0,
      contractsListPage: 1,
      contractsListPageSize: 10,
      contractsListTotalPages: 0,
      isLoadingContractsList: false,
      contractsListError: null,

      currentContractId: null,

      // Load contract details by contract ID
      loadContractDetails: async (contractId: string) => {
        set({
          isLoadingContractDetails: true,
          contractDetailsError: null,
          currentContractId: contractId,
        });

        try {
          if (process.env.NODE_ENV === "development") {
            console.log("[ContractStore] Loading contract details:", contractId);
          }

          const response = await ContractService.getContractDetails(contractId);

          if (response.data) {
            if (process.env.NODE_ENV === "development") {
              console.log("[ContractStore] Contract details loaded:", response.data);
            }
            set({
              contractDetails: response.data,
              isLoadingContractDetails: false,
              contractDetailsError: null,
            });
          } else {
            throw new ContractApiError(
              "Contract details not found",
              404,
              ContractErrorCode.CONTRACT_NOT_FOUND
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to load contract details";

          console.error("[ContractStore] Error loading contract details:", {
            contractId,
            error,
            errorMessage,
          });

          set({
            contractDetails: null,
            isLoadingContractDetails: false,
            contractDetailsError: errorMessage,
          });

          // Only show toast in non-debug mode to avoid spam
          if (typeof window === "undefined" || 
              !(window as any).__DISABLE_API_AUTO_REDIRECT) {
            toast.error(errorMessage);
          }
          throw error;
        }
      },

      // Load contract by inspection ID
      loadContractByInspectionId: async (inspectionId: number) => {
        set({
          isLoadingContractDetails: true,
          contractDetailsError: null,
        });

        try {
          const response =
            await ContractService.getContractByInspectionId(inspectionId);

          if (response.data) {
            set({
              contractDetails: response.data,
              currentContractId: response.data.contractId,
              isLoadingContractDetails: false,
              contractDetailsError: null,
            });
          } else {
            throw new ContractApiError(
              "Contract not found for this inspection",
              404,
              ContractErrorCode.CONTRACT_NOT_FOUND
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to load contract";

          set({
            contractDetails: null,
            isLoadingContractDetails: false,
            contractDetailsError: errorMessage,
          });

          toast.error(errorMessage);
          throw error;
        }
      },

      // Clear contract details
      clearContractDetails: () => {
        set({
          contractDetails: null,
          contractDetailsError: null,
          currentContractId: null,
        });
      },

      // Fetch contracts list
      fetchContractsList: async (query: ContractListQuery = {}) => {
        const state = get();
        const page = query.page || state.contractsListPage;
        const pageSize = query.pageSize || state.contractsListPageSize;

        set({
          isLoadingContractsList: true,
          contractsListError: null,
        });

        try {
          const response = await ContractService.getContracts({
            ...query,
            page,
            pageSize,
          });

          if (response.data) {
            set({
              contractsList: response.data.contracts || [],
              contractsListTotal: response.data.total || 0,
              contractsListPage: response.data.page || page,
              contractsListPageSize: response.data.pageSize || pageSize,
              contractsListTotalPages: response.data.totalPages || 0,
              isLoadingContractsList: false,
              contractsListError: null,
            });
          } else {
            throw new ContractApiError(
              "Failed to load contracts list",
              500,
              ContractErrorCode.SERVER_ERROR
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to load contracts list";

          set({
            contractsList: [],
            isLoadingContractsList: false,
            contractsListError: errorMessage,
          });

          toast.error(errorMessage);
          throw error;
        }
      },

      // Refresh contracts list
      refreshContractsList: async () => {
        const state = get();
        await get().fetchContractsList({
          page: state.contractsListPage,
          pageSize: state.contractsListPageSize,
        });
      },

      // Clear contracts list
      clearContractsList: () => {
        set({
          contractsList: [],
          contractsListTotal: 0,
          contractsListPage: 1,
          contractsListTotalPages: 0,
          contractsListError: null,
        });
      },

      // Set contracts list page
      setContractsListPage: (page: number) => {
        set({ contractsListPage: page });
      },

      // Set contracts list page size
      setContractsListPageSize: (pageSize: number) => {
        set({ contractsListPageSize: pageSize, contractsListPage: 1 });
      },

      // Submit contract for renter signing
      submitContract: async (
        contractId: string,
        renterInfo: {
          fullName: string;
          email: string;
          phoneNumber: string;
        }
      ) => {
        const { setApiLoading } = useLoadingStore.getState();
        setApiLoading(true, "Submitting contract...");

        try {
          const response = await ContractService.submitContract(
            contractId,
            renterInfo
          );

          if (response.data) {
            // Update contract details if it's the current contract
            const state = get();
            if (state.currentContractId === contractId) {
              await get().loadContractDetails(contractId);
            }

            toast.success("Contract submitted for renter signing");
          } else {
            throw new ContractApiError(
              "Failed to submit contract",
              500,
              ContractErrorCode.SERVER_ERROR
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to submit contract";

          toast.error(errorMessage);
          throw error;
        } finally {
          setApiLoading(false);
        }
      },

      // Staff sign contract
      staffSignContract: async (
        contractId: string,
        signatureData?: string
      ) => {
        const { setApiLoading } = useLoadingStore.getState();
        setApiLoading(true, "Signing contract...");

        try {
          const response = await ContractService.staffSignContract(
            contractId,
            signatureData
          );

          if (response.data) {
            // Update contract details if it's the current contract
            const state = get();
            if (state.currentContractId === contractId) {
              await get().loadContractDetails(contractId);
            }

            toast.success("Contract signed successfully");
          } else {
            throw new ContractApiError(
              "Failed to sign contract",
              500,
              ContractErrorCode.SERVER_ERROR
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to sign contract";

          toast.error(errorMessage);
          throw error;
        } finally {
          setApiLoading(false);
        }
      },

      // Reject contract
      rejectContract: async (contractId: string, reason: string) => {
        const { setApiLoading } = useLoadingStore.getState();
        setApiLoading(true, "Rejecting contract...");

        try {
          const response = await ContractService.rejectContract(
            contractId,
            reason
          );

          if (response.data) {
            // Update contract details if it's the current contract
            const state = get();
            if (state.currentContractId === contractId) {
              await get().loadContractDetails(contractId);
            }

            toast.success("Contract rejected successfully");
          } else {
            throw new ContractApiError(
              "Failed to reject contract",
              500,
              ContractErrorCode.SERVER_ERROR
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to reject contract";

          toast.error(errorMessage);
          throw error;
        } finally {
          setApiLoading(false);
        }
      },

      // Approve Step 3 (move to Step 4)
      approveStep3: async (inspectionId: number) => {
        const { setApiLoading } = useLoadingStore.getState();
        setApiLoading(true, "Completing contract signing...");

        try {
          await ContractService.approveStep3(inspectionId);
          toast.success("Contract signing completed. Moving to payment step.");
        } catch (error) {
          const errorMessage =
            error instanceof ContractApiError
              ? error.message
              : "Failed to complete contract signing";

          toast.error(errorMessage);
          throw error;
        } finally {
          setApiLoading(false);
        }
      },

      // Computed: Get contract status
      getContractStatus: () => {
        const state = get();
        return state.contractDetails?.status || null;
      },

      // Computed: Check if renter has signed
      isContractSignedByRenter: () => {
        const state = get();
        return state.contractDetails?.signedByRenter || false;
      },

      // Computed: Check if staff has signed
      isContractSignedByStaff: () => {
        const state = get();
        return state.contractDetails?.signedByStaff || false;
      },

      // Computed: Check if staff can sign
      canStaffSign: () => {
        const state = get();
        return (
          state.contractDetails?.status === ContractStatus.Active &&
          state.contractDetails?.signedByRenter === true &&
          state.contractDetails?.signedByStaff === false
        );
      },

      // Computed: Check if contract can be submitted
      canSubmitContract: () => {
        const state = get();
        return state.contractDetails?.status === ContractStatus.Draft;
      },
    }),
    {
      name: "contract-storage",
      partialize: (state) => ({
        // Only persist essential state, not loading states or errors
        currentContractId: state.currentContractId,
        contractsListPage: state.contractsListPage,
        contractsListPageSize: state.contractsListPageSize,
      }),
    }
  )
);

// Helper hooks for easier usage
export const useContractDetails = () => {
  const {
    contractDetails,
    isLoadingContractDetails,
    contractDetailsError,
    loadContractDetails,
    loadContractByInspectionId,
    clearContractDetails,
  } = useContractStore();

  return {
    contractDetails,
    isLoadingContractDetails,
    contractDetailsError,
    loadContractDetails,
    loadContractByInspectionId,
    clearContractDetails,
  };
};

export const useContractsList = () => {
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
    clearContractsList,
    setContractsListPage,
    setContractsListPageSize,
  } = useContractStore();

  return {
    contractsList,
    contractsListTotal,
    contractsListPage,
    contractsListPageSize,
    contractsListTotalPages,
    isLoadingContractsList,
    contractsListError,
    fetchContractsList,
    refreshContractsList,
    clearContractsList,
    setContractsListPage,
    setContractsListPageSize,
  };
};

export const useContractActions = () => {
  const store = useContractStore();

  return {
    submitContract: store.submitContract,
    staffSignContract: store.staffSignContract,
    rejectContract: store.rejectContract,
    approveStep3: store.approveStep3,
    getContractStatus: store.getContractStatus,
    isContractSignedByRenter: store.isContractSignedByRenter,
    isContractSignedByStaff: store.isContractSignedByStaff,
    canStaffSign: store.canStaffSign,
    canSubmitContract: store.canSubmitContract,
  };
};
