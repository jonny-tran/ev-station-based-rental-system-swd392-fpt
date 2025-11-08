# Contract API Integration Guide

## Overview

This document provides a comprehensive guide for integrating the Contract API into the frontend application. It covers the current architecture, required API endpoints, data flow, and implementation steps.

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [File Structure](#file-structure)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
5. [Integration Points](#integration-points)
6. [Data Mapping](#data-mapping)
7. [Implementation Steps](#implementation-steps)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

---

## Current Architecture

### Contract System Flow

```
Check-in Session Step 2 (Vehicle Inspection)
    ↓
Step 3: Contract Signing
    ├── Get Contract Data (from Inspection)
    ├── Render Contract Template
    ├── Submit Contract (Draft → Active)
    ├── Renter Sign (Mobile App)
    └── Staff Sign (Web App)
    ↓
Step 4: Payment
```

### Current Implementation Status

- ✅ **UI Components**: Fully implemented and translated to English
- ✅ **Contract Template**: HTML template with placeholders
- ✅ **Contract Generator**: Template engine for generating contracts
- ✅ **Contract Renderer**: React component for displaying contracts
- ⚠️ **API Integration**: Currently using mock service
- ⚠️ **Contract Service**: Needs real API integration

---

## File Structure

### Core Contract Packages

```
packages/contract/
├── contract-types.ts          # TypeScript interfaces for contract data
├── contract-template.ts       # HTML template with placeholders
├── contract-generator.ts      # Template engine for generating contracts
├── contract-data-service.ts   # Service layer (currently mock, needs API integration)
└── ContractRenderer.tsx       # React component for rendering contracts
```

### Frontend Components

```
apps/web/src/
├── app/staff/contract/
│   └── page.tsx                              # Contract list page
├── app/staff/checkin-session/[inspectionId]/step3/
│   └── page.tsx                              # Step 3: Contract signing page
└── components/staff/check-in/process/step3/
    ├── ContractSigningStep.tsx               # Main contract signing component
    ├── RenterInfoPanel.tsx                   # Renter information editor
    └── ActionButtons.tsx                     # Action buttons (Submit, Sign, Cancel)
```

### Contract List Components

```
apps/web/src/components/staff/contract/
├── ContractList.tsx          # Contract list with pagination
├── ContractCard.tsx          # Contract card component
├── ContractActions.tsx       # Contract action buttons
├── ContractFilters.tsx       # Filter component
└── ContractStatusBadge.tsx   # Status badge component
```

---

## Data Models

### ContractData Interface

```typescript
// packages/contract/contract-types.ts
export interface ContractData {
  // Renter information
  renterName: string;
  renterId: string;
  renterPhone: string;
  renterEmail: string;

  // Vehicle information
  licensePlate: string;
  vehicleModel: string;
  batteryCapacity: number;
  currentOdo: number;

  // Rental information
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;

  // Contract information
  contractId: string;
  contractCreatedDate: string;

  // Staff information
  staffName: string;

  // Signature information
  renterSignature?: string;
  staffSignature?: string;
  signDateRenter?: string;
  signDateStaff?: string;
}
```

### Contract Status Enum

```typescript
// packages/types/contract/contract-status.ts
export enum ContractStatus {
  Draft = "Draft",
  Active = "Active",
  Completed = "Completed",
  Terminated = "Terminated",
  Voided = "Voided",
}
```

### API Response Types

```typescript
// Expected API response structure
interface ContractDetailsResponse {
  contractId: string;
  bookingId: string;
  status: ContractStatus;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  signedByRenter: boolean;
  signedByStaff: boolean;
  signedAt?: string;
  renter: {
    renterId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  vehicle: {
    vehicleId: string;
    brand: string;
    model: string;
    licensePlate: string;
    year?: number;
    color?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## API Endpoints

### 1. Get Contract Details (Step 3)

**Endpoint:** `GET /api/contract/{contractId}`

**Purpose:** Get contract details for Step 3 (Contract Signing)

**Authentication:** Required (JWT Token)

**Response:**
```json
{
  "message": "Contract details retrieved successfully",
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "bookingId": "456e7890-e89b-12d3-a456-426614174001",
    "status": "Draft",
    "termsAndConditions": "Standard rental terms...",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-02T00:00:00.000Z",
    "signedByRenter": false,
    "signedByStaff": false,
    "signedAt": null,
    "renter": {
      "renterId": "789e0123-e89b-12d3-a456-426614174002",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "0901234567"
    },
    "vehicle": {
      "vehicleId": "012e3456-e89b-12d3-a456-426614174003",
      "brand": "Tesla",
      "model": "Model 3",
      "licensePlate": "51A-12345",
      "year": 2023,
      "color": "White"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get Contract by Inspection ID

**Note:** Currently, contracts are linked to bookings, not directly to inspections. You need to:
1. Get inspection by ID
2. Get booking from inspection
3. Get contract from booking

**Alternative:** Create a new endpoint `GET /api/checkin-session/{inspectionId}/contract` if needed.

### 3. Submit Contract for Signing

**Endpoint:** `PUT /api/contract/{contractId}/submit`

**Purpose:** Staff submits contract for renter signing (Draft → Active)

**Authentication:** Required (Staff only)

**Request Body:**
```json
{
  "renterInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "0901234567"
  }
}
```

**Response:**
```json
{
  "message": "Contract submitted for renter signing",
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "Active",
    "signedByRenter": false,
    "signedByStaff": false,
    "signedAt": null,
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 4. Staff Sign Contract

**Endpoint:** `PUT /api/contract/{contractId}/staff-sign`

**Purpose:** Staff signs the contract (after renter has signed)

**Authentication:** Required (Staff only)

**Request Body:**
```json
{
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Response:**
```json
{
  "message": "Staff signed the contract successfully",
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "Completed",
    "signedByRenter": true,
    "signedByStaff": true,
    "signedAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  }
}
```

### 5. Reject Contract

**Endpoint:** `PUT /api/contract/{contractId}/reject`

**Purpose:** Staff rejects the contract

**Authentication:** Required (Staff only)

**Request Body:**
```json
{
  "reason": "Contract contains incorrect information"
}
```

**Response:**
```json
{
  "message": "Contract has been rejected and voided",
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "Voided",
    "signedByRenter": false,
    "signedByStaff": false,
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "statusReason": "Contract contains incorrect information"
  }
}
```

### 6. Get Contract List (Staff)

**Endpoint:** `GET /api/contract/staff/list`

**Purpose:** Get all contracts for staff with pagination and filtering

**Authentication:** Required (Staff only)

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `pageSize` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status (Draft, Active, Completed, Terminated, Voided)
- `search` (string, optional): Search by booking ID, license plate, or renter name

**Response:**
```json
{
  "message": "Staff contracts retrieved successfully",
  "data": {
    "contracts": [
      {
        "contractId": "123e4567-e89b-12d3-a456-426614174000",
        "bookingId": "456e7890-e89b-12d3-a456-426614174001",
        "status": "Active",
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-01-02T00:00:00.000Z",
        "signedByRenter": true,
        "signedByStaff": false,
        "signedAt": null,
        "renterName": "John Doe",
        "renterEmail": "john@example.com",
        "vehicleBrand": "Tesla",
        "vehicleModel": "Model 3",
        "vehicleLicensePlate": "51A-12345",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### 7. Approve Step 3 (Move to Step 4)

**Endpoint:** `PUT /api/checkin-session/{inspectionId}/step3/approve`

**Purpose:** Complete contract signing and move to Step 4 (Payment)

**Authentication:** Required (Staff only)

**Response:**
```json
{
  "message": "Contract signing completed. Moved to Step 4 - Payment.",
  "data": {
    "inspectionId": 101,
    "currentStep": 4,
    "subStatus": "WaitingPayment",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  }
}
```

---

## Integration Points

### 1. ContractDataService (contract-data-service.ts)

**Current Implementation:** Uses mock service

**Location:** `packages/contract/contract-data-service.ts`

**Methods to Replace:**

#### `getContractData(inspectionId: string)`

**Current:**
```typescript
static async getContractData(inspectionId: string): Promise<ContractData> {
  // Uses mockService.getVehicleInspectionById()
  // Needs to call API instead
}
```

**Required API Flow:**
1. Get inspection by ID → Get booking ID
2. Get contract by booking ID (or create new endpoint)
3. Get contract details
4. Map API response to ContractData

**Implementation:**
```typescript
static async getContractData(inspectionId: string): Promise<ContractData> {
  // Step 1: Get inspection
  const inspection = await api.get(`/api/checkin-session/${inspectionId}`);
  
  // Step 2: Get contract by booking ID
  // Option A: If contract exists
  const contract = await api.get(`/api/contract?bookingId=${inspection.bookingId}`);
  
  // Option B: If new endpoint exists
  // const contract = await api.get(`/api/checkin-session/${inspectionId}/contract`);
  
  // Step 3: Map to ContractData
  return this.mapApiResponseToContractData(contract.data);
}
```

#### `submitContract(contractId: string)`

**Current:** Mock implementation

**Required:** Call `PUT /api/contract/{contractId}/submit`

#### `getContractStatus(contractId: string)`

**Current:** Mock implementation

**Required:** Use data from `GET /api/contract/{contractId}`

---

### 2. ContractSigningStep Component

**Location:** `apps/web/src/components/staff/check-in/process/step3/ContractSigningStep.tsx`

**Current Implementation:**
- Uses `ContractDataService.getContractData()` (mock)
- Handles loading states
- Handles error states
- Updates renter info locally

**Changes Needed:**
1. Replace mock service calls with real API calls
2. Handle API errors properly
3. Update contract status after actions
4. Refresh contract data after status changes

**Key Methods:**
- `loadContractData()`: Replace with API call
- `handlePrimary()`: Call submit/sign API
- `handleReject()`: Call reject API

---

### 3. ContractList Component

**Location:** `apps/web/src/components/staff/contract/ContractList.tsx`

**Current Implementation:**
- Uses `mockService.getContracts()`
- Implements pagination
- Implements filtering

**Changes Needed:**
1. Replace with `GET /api/contract/staff/list`
2. Handle query parameters (page, pageSize, status, search)
3. Update pagination based on API response

---

### 4. ContractActions Component

**Location:** `apps/web/src/components/staff/contract/ContractActions.tsx`

**Current Implementation:**
- Uses `mockService.signContractByStaff()`

**Changes Needed:**
1. Replace with `PUT /api/contract/{contractId}/staff-sign`
2. Handle signature data (if needed)
3. Update contract status after signing

---

## Data Mapping

### API Response → ContractData

```typescript
function mapApiResponseToContractData(
  apiResponse: ContractDetailsResponse,
  inspection?: VehicleInspection
): ContractData {
  return {
    // Renter information
    renterName: apiResponse.renter.fullName,
    renterId: apiResponse.renter.renterId,
    renterPhone: apiResponse.renter.phoneNumber,
    renterEmail: apiResponse.renter.email,

    // Vehicle information
    licensePlate: apiResponse.vehicle.licensePlate,
    vehicleModel: `${apiResponse.vehicle.brand} ${apiResponse.vehicle.model}`,
    batteryCapacity: 0, // Need to get from vehicle details
    currentOdo: inspection?.odometerReading || 0,

    // Rental information
    startDate: apiResponse.startDate,
    endDate: apiResponse.endDate,
    pickupLocation: "", // Need to get from booking
    returnLocation: "", // Need to get from booking
    totalPrice: 0, // Need to calculate from booking

    // Contract information
    contractId: apiResponse.contractId,
    contractCreatedDate: apiResponse.createdAt,

    // Staff information
    staffName: "", // Need to get from inspection or contract

    // Signature information
    renterSignature: apiResponse.signedByRenter ? "signed" : undefined,
    staffSignature: apiResponse.signedByStaff ? "signed" : undefined,
    signDateRenter: apiResponse.signedByRenter ? apiResponse.signedAt : undefined,
    signDateStaff: apiResponse.signedByStaff ? apiResponse.signedAt : undefined,
  };
}
```

### ContractData → API Request

```typescript
function mapContractDataToSubmitRequest(
  contractData: ContractData
): SubmitContractDto {
  return {
    renterInfo: {
      fullName: contractData.renterName,
      email: contractData.renterEmail,
      phoneNumber: contractData.renterPhone,
    },
  };
}
```

---

## Implementation Steps

### Step 1: Create API Service Layer

**File:** `apps/web/src/services/contract.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import { ContractDetailsResponse } from '@/types/api/contract';

export class ContractService {
  static async getContractDetails(contractId: string) {
    const response = await apiClient.get(`/api/contract/${contractId}`);
    return response.data;
  }

  static async getContractByInspectionId(inspectionId: string) {
    // Option 1: If endpoint exists
    // return apiClient.get(`/api/checkin-session/${inspectionId}/contract`);
    
    // Option 2: Get via booking
    const inspection = await apiClient.get(`/api/checkin-session/${inspectionId}`);
    const bookingId = inspection.data.bookingId;
    // Need to find contract by bookingId
    return apiClient.get(`/api/contract?bookingId=${bookingId}`);
  }

  static async submitContract(contractId: string, renterInfo: any) {
    return apiClient.put(`/api/contract/${contractId}/submit`, {
      renterInfo,
    });
  }

  static async staffSignContract(contractId: string, signatureData: string) {
    return apiClient.put(`/api/contract/${contractId}/staff-sign`, {
      signatureData,
    });
  }

  static async rejectContract(contractId: string, reason: string) {
    return apiClient.put(`/api/contract/${contractId}/reject`, {
      reason,
    });
  }

  static async getContracts(query: ContractListQuery) {
    return apiClient.get('/api/contract/staff/list', { params: query });
  }
}
```

### Step 2: Update ContractDataService

**File:** `packages/contract/contract-data-service.ts`

Replace mock implementations with real API calls:

```typescript
import { ContractService } from '@/services/contract.service';

export class ContractDataService {
  static async getContractData(inspectionId: string): Promise<ContractData> {
    // Get contract from API
    const response = await ContractService.getContractByInspectionId(inspectionId);
    const contractDetails = response.data.data;
    
    // Get additional data (inspection, booking, vehicle, location)
    const inspection = await apiClient.get(`/api/checkin-session/${inspectionId}`);
    // ... get other required data
    
    // Map to ContractData
    return this.mapToContractData(contractDetails, inspection.data);
  }

  static async submitContract(contractId: string, renterInfo: any): Promise<void> {
    await ContractService.submitContract(contractId, renterInfo);
  }

  // ... other methods
}
```

### Step 3: Update ContractSigningStep Component

**File:** `apps/web/src/components/staff/check-in/process/step3/ContractSigningStep.tsx`

Update to use real API:

```typescript
const loadContractData = useCallback(async () => {
  try {
    setIsLoading(true);
    setError("");

    // Use real API instead of mock
    const data = await ContractDataService.getContractData(inspectionId);
    setContractData(data);
    
    // Get contract status from API response
    const contractDetails = await ContractService.getContractDetails(data.contractId);
    setStatus(contractDetails.data.status);
    setRenterSigned(contractDetails.data.signedByRenter);
    setStaffSigned(contractDetails.data.signedByStaff);

    // Update renter info
    setRenterInfo({
      fullName: data.renterName,
      email: data.renterEmail,
      phoneNumber: data.renterPhone,
    });
  } catch (err) {
    setError("Unable to load contract data. Please try again.");
    console.error("Error loading contract data:", err);
  } finally {
    setIsLoading(false);
  }
}, [inspectionId]);

const handlePrimary = useCallback(async () => {
  if (!contractData) return;
  setIsSubmitting(true);
  try {
    if (status === ContractStatus.Draft) {
      // Submit contract
      await ContractDataService.submitContract(
        contractData.contractId,
        {
          fullName: renterInfo.fullName,
          email: renterInfo.email,
          phoneNumber: renterInfo.phoneNumber,
        }
      );
      setStatus(ContractStatus.Active);
      
      // Refresh contract data
      await loadContractData();
    } else if (
      status === ContractStatus.Active &&
      renterSigned &&
      !staffSigned
    ) {
      // Staff signs contract
      await ContractService.staffSignContract(
        contractData.contractId,
        "" // signature data if needed
      );
      setStaffSigned(true);
      setStatus(ContractStatus.Completed);
      
      // Refresh contract data
      await loadContractData();
    }
  } catch (error) {
    console.error("Error processing action:", error);
    setError("Unable to process. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}, [contractData, status, renterSigned, staffSigned, renterInfo, loadContractData]);
```

### Step 4: Update ContractList Component

**File:** `apps/web/src/components/staff/contract/ContractList.tsx`

Replace mock service with API:

```typescript
const load = async () => {
  try {
    const response = await ContractService.getContracts({
      page,
      pageSize: PAGE_SIZE,
      status: filters.status !== "All" ? filters.status : undefined,
      search: filters.keyword || undefined,
    });
    
    const { contracts, total } = response.data.data;
    setItems(contracts);
    setTotal(total);
  } catch (error) {
    console.error("Error loading contracts:", error);
    // Handle error
  }
};
```

### Step 5: Update ContractActions Component

**File:** `apps/web/src/components/staff/contract/ContractActions.tsx`

Replace mock service with API:

```typescript
const handleStaffSign = async () => {
  startTransition(async () => {
    try {
      await ContractService.staffSignContract(contract.contractId, "");
      onChanged?.(); // Refresh contract list
    } catch (error) {
      console.error("Error signing contract:", error);
      // Handle error
    }
  });
};
```

---

## Error Handling

### Common Error Scenarios

1. **Contract Not Found (404)**
   - Show error message: "Contract not found"
   - Redirect to contract list or check-in session

2. **Unauthorized Access (403)**
   - Show error message: "You don't have permission to access this contract"
   - Redirect to appropriate page

3. **Invalid Status Transition (400)**
   - Show error message: "Invalid contract status"
   - Refresh contract data to get latest status

4. **Network Errors**
   - Show error message: "Network error. Please try again."
   - Provide retry button

### Error Handling Pattern

```typescript
try {
  const response = await ContractService.getContractDetails(contractId);
  // Handle success
} catch (error) {
  if (error.response?.status === 404) {
    setError("Contract not found");
  } else if (error.response?.status === 403) {
    setError("You don't have permission to access this contract");
  } else if (error.response?.status === 400) {
    setError(error.response.data.message || "Invalid request");
  } else {
    setError("An error occurred. Please try again.");
  }
}
```

---

## Testing

### Unit Tests

1. **ContractDataService**
   - Test data mapping from API response to ContractData
   - Test error handling

2. **ContractSigningStep Component**
   - Test loading states
   - Test error states
   - Test contract submission
   - Test contract signing

3. **ContractList Component**
   - Test pagination
   - Test filtering
   - Test error handling

### Integration Tests

1. **API Integration**
   - Test real API calls (with test environment)
   - Test error responses
   - Test authentication

2. **End-to-End Flow**
   - Test complete contract signing flow
   - Test contract list with filters
   - Test contract actions

---

## Additional Notes

### Missing API Endpoints

The following endpoints may need to be created:

1. **GET /api/checkin-session/{inspectionId}/contract**
   - Get contract directly from inspection ID
   - This would simplify the integration

2. **GET /api/contract?bookingId={bookingId}**
   - Get contract by booking ID
   - Alternative to the above

### Contract Creation

Currently, contracts are created automatically when Step 2 is approved. Ensure:
- Contract is created with correct booking ID
- Contract status is set to "Draft"
- Contract contains all required data

### Signature Handling

Currently, signature handling is simplified. If you need actual signature images:
- Update API to accept signature image data
- Update UI to capture signature (canvas or image upload)
- Store signature in contract

### Contract PDF Generation

If PDF generation is needed:
- Create endpoint: `GET /api/contract/{contractId}/pdf`
- Update ContractRenderer to support PDF download
- Handle PDF generation on backend

---

## Summary

### Current Status
- ✅ UI components implemented and translated
- ✅ Contract template and generator ready
- ✅ Mock service structure in place
- ⚠️ API integration needed

### Next Steps
1. Create API service layer
2. Update ContractDataService to use real API
3. Update components to use real API
4. Test integration
5. Handle errors properly
6. Update documentation

### Key Files to Modify
1. `packages/contract/contract-data-service.ts` - Replace mock with API
2. `apps/web/src/components/staff/check-in/process/step3/ContractSigningStep.tsx` - Update API calls
3. `apps/web/src/components/staff/contract/ContractList.tsx` - Update API calls
4. `apps/web/src/components/staff/contract/ContractActions.tsx` - Update API calls

### API Endpoints Required
1. `GET /api/contract/{contractId}` - Get contract details
2. `GET /api/checkin-session/{inspectionId}/contract` - Get contract by inspection (recommended)
3. `PUT /api/contract/{contractId}/submit` - Submit contract
4. `PUT /api/contract/{contractId}/staff-sign` - Staff sign contract
5. `PUT /api/contract/{contractId}/reject` - Reject contract
6. `GET /api/contract/staff/list` - Get contract list
7. `PUT /api/checkin-session/{inspectionId}/step3/approve` - Approve Step 3

---

## Contact

For questions or issues, please refer to the backend API documentation:
- `docs/backend/step3-contract-apis-documentation.md`
- API Swagger documentation (if available)

