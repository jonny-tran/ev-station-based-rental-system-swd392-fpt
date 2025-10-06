# Step 1 Check-in APIs Documentation

## Overview

This document describes the Step 1 APIs for the electric car check-in process. Step 1 focuses on **License Verification** where staff members verify the renter's ID and driver's license documents.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All APIs require JWT authentication with Staff role.

## APIs

### 1. Get Check-in Session Details

**Endpoint:** `GET /api/checkin-session/{inspectionId}`

**Description:** Retrieve complete check-in session details with all related entities including full inspection details, complete booking information, comprehensive renter profile, complete account details, detailed driver license information, full vehicle specifications, rental location details, and contract information (null if not yet created - before step 3).

**Authorization:** Staff only

**Parameters:**

- `inspectionId` (path, number): The inspection ID

**Response:**

```json
{
  "message": "Check-in session details retrieved successfully",
  "data": {
    "inspection": {
      "inspectionId": 101,
      "staffId": "staff-123",
      "bookingId": "booking-123",
      "inspectionType": "check_in",
      "inspectionDateTime": "2024-01-15T10:00:00Z",
      "vehicleConditionNotes": null,
      "odometerReading": null,
      "batteryLevel": null,
      "damageNotes": null,
      "photoUrls": null,
      "currentStep": 1,
      "status": "Pending",
      "subStatus": null,
      "rejectedReason": null,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    "booking": {
      "bookingId": "123e4567-e89b-12d3-a456-426614174000",
      "renterId": "renter-123",
      "vehicleId": "vehicle-123",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T18:00:00Z",
      "depositAmount": 150000,
      "status": "Pending",
      "createdAt": "2024-01-14T10:00:00Z",
      "cancelledAt": null
    },
    "renter": {
      "renterId": "123e4567-e89b-12d3-a456-426614174000",
      "accountId": "account-123",
      "address": "123 Main Street, District 1",
      "dateOfBirth": "1990-01-01",
      "identityNumber": "123456789",
      "frontIdentityImageUrl": "https://example.com/front-id.jpg",
      "backIdentityImageUrl": "https://example.com/back-id.jpg"
    },
    "account": {
      "accountId": "123e4567-e89b-12d3-a456-426614174000",
      "email": "renter@example.com",
      "phoneNumber": "0901234567",
      "fullName": "Nguyen Van A",
      "avatarUrl": "https://example.com/avatar.jpg",
      "role": "Renter",
      "status": "Active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "driverLicense": {
      "licenseId": 1,
      "renterId": "renter-123",
      "licenseNumber": "B1234567",
      "issuedDate": "2020-01-01",
      "expiryDate": "2027-09-30",
      "licenseType": "Car",
      "licenseImageUrl": "https://example.com/license.jpg",
      "issuedBy": "Traffic Department",
      "verifiedStatus": "Verified",
      "verifiedAt": "2024-01-01T00:00:00Z"
    },
    "vehicle": {
      "vehicleId": "123e4567-e89b-12d3-a456-426614174000",
      "rentalLocationId": "location-123",
      "licensePlate": "51A-99999",
      "model": "Model 3",
      "brand": "Tesla",
      "year": 2023,
      "mileage": 10000,
      "batteryCapacity": 75,
      "batteryLevel": 85.5,
      "chargingCycles": 150,
      "color": "White",
      "imageUrl": "https://example.com/vehicle.jpg",
      "rentalRate": 500000,
      "lastServiceDate": "2024-01-01T00:00:00Z",
      "status": "Available"
    },
    "rentalLocation": {
      "rentalLocationId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Downtown Station",
      "address": "456 Downtown Avenue, District 1",
      "city": "Ho Chi Minh City",
      "country": "Vietnam",
      "contactNumber": "0901234567",
      "openingHours": "08:00",
      "closingHours": "22:00",
      "latitude": 10.762622,
      "longitude": 106.660172
    },
    "contract": null
  }
}
```

**Error Responses:**

- `403 Forbidden`: Access denied. Staff only or mismatched staff ID.
- `404 Not Found`: Inspection not found
- `500 Internal Server Error`: Unexpected error

---

### 2. Approve Step 1 - License Verification

**Endpoint:** `PUT /api/checkin-session/{inspectionId}/step1/approve`

**Description:** Staff approves the documents and moves the inspection to step 2.

**Authorization:** Staff only

**Parameters:**

- `inspectionId` (path, number): The inspection ID

**Request Body:**

```json
{
  "notes": "All documents verified successfully"
}
```

**Response:**

```json
{
  "message": "License verification approved. Moved to Step 2.",
  "data": {
    "inspectionId": 101,
    "currentStep": 2,
    "status": "Pending",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid step or status
- `403 Forbidden`: Access denied. Staff only or mismatched staff ID.
- `404 Not Found`: Inspection not found
- `500 Internal Server Error`: Update failed

**Business Logic:**

- Updates `currentStep` to 2
- Keeps `status` as "Pending"
- Optionally saves `vehicleConditionNotes` if provided
- Updates `updatedAt` timestamp

---

### 3. Reject Step 1 - License Verification

**Endpoint:** `PUT /api/checkin-session/{inspectionId}/step1/reject`

**Description:** Staff rejects the documents and ends the check-in session.

**Authorization:** Staff only

**Parameters:**

- `inspectionId` (path, number): The inspection ID

**Request Body:**

```json
{
  "reason": "Driver license expired"
}
```

**Response:**

```json
{
  "message": "License verification rejected.",
  "data": {
    "inspectionId": 101,
    "status": "Rejected",
    "rejectedReason": "Driver license expired",
    "currentStep": 1
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid state or missing reason
- `403 Forbidden`: Access denied. Staff only or mismatched staff ID.
- `404 Not Found`: Inspection not found
- `500 Internal Server Error`: Update failed

**Business Logic:**

- Updates `status` to "Rejected"
- Sets `rejectedReason` to the provided reason
- Keeps `currentStep` at 1
- Updates `updatedAt` timestamp

## Authorization Rules

All 3 APIs are protected by JWT authentication using `@UseGuards(JwtAuthGuard)`.

The system verifies:

1. The user's role === "Staff"
2. The decoded `accountId` matches the `StaffID` associated with the inspection

If either condition fails, returns `403 Forbidden` with message "Access denied. Staff only or mismatched staff ID."

## Data Flow

1. **Get Details**: Staff retrieves inspection details to review documents
2. **Approve/Reject**: Staff makes decision based on document verification
3. **Update**: System updates inspection record with new status and step

## Validation Rules

### Step 1 Approval

- Must be at `currentStep = 1`
- Must have `status = "Pending"`
- `notes` field is optional

### Step 1 Rejection

- Must be at `currentStep = 1`
- `reason` field is required
- Can reject regardless of current status

## Database Schema

The APIs interact with the following tables:

- `VehicleInspectionDatTT`: Complete inspection record with all inspection details
- `Booking`: Complete booking information including timestamps and status
- `Renter`: Complete renter profile with identity documents and personal information
- `Account`: Complete account details including profile and authentication info
- `DriverLicense`: Complete driver license information with verification status
- `Vehicle`: Complete vehicle specifications including technical details
- `RentalLocation`: Complete rental location details including contact and coordinates
- `ContractDatTT`: Contract information (null until step 3 when contract is created)

## Error Handling

All APIs include comprehensive error handling:

- Input validation using class-validator
- Business logic validation
- Database error handling
- Consistent error response format

## Testing

Unit tests are provided for all service methods covering:

- Successful operations
- Error scenarios
- Authorization checks
- Business logic validation

Run tests with:

```bash
npm run test -- --testPathPattern=step1-checkin-session.service.spec.ts
```
