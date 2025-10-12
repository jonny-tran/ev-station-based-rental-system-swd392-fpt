/**
 * Contract Status Enums and Types
 */

export enum ContractStatus {
  Draft = "Draft",
  Active = "Active",
  Completed = "Completed",
  Terminated = "Terminated",
  Voided = "Voided",
}

export type ContractStatusType = keyof typeof ContractStatus;
