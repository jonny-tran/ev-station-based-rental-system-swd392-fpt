/**
 * Contract Signature Types
 */

import { BaseEntityAutoId } from "../common/base";

/**
 * Contract Signature Entity
 */
export interface ContractSignature extends BaseEntityAutoId {
  contractId: string; // ContractDatTTID
  signedBy: string;
  signatureUrl?: string;
  signedAt: string;
  signatureType?: string;
}

/**
 * Create Contract Signature Request
 */
export interface CreateContractSignatureRequest {
  contractId: string;
  signedBy: string;
  signatureUrl?: string;
  signatureType?: string;
}
