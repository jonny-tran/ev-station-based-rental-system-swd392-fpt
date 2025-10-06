# Check-in Session APIs Documentation

## Overview

This document describes the 3 APIs implemented for the EV rental check-in system. These APIs handle QR code validation, check-in session creation, and session listing for staff members.

## Authentication

All APIs require JWT authentication and are restricted to users with the "Staff" role.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

## API Endpoints

### 1. Validate QR Code & Get Booking Info

**Endpoint:** `GET /api/booking/validate-qr/{bookingId}`

**Purpose:** Validate the booking ID from the QR code and return related details.

**Parameters:**

- `bookingId` (path): Booking ID from QR code (UUID format)

**Validation Rules:**

- Booking must exist
- Booking status must be "Pending"
- No existing check-in session for this booking

**Response (200 OK):**

```json
{
  "message": "Booking validated successfully",
  "data": {
    "booking": {
      "bookingId": "123e4567-e89b-12d3-a456-426614174000",
      "status": "Pending",
      "depositAmount": 150.0,
      "startTime": "2024-01-01T10:00:00Z",
      "endTime": "2024-01-01T18:00:00Z",
      "createdAt": "2024-01-01T09:00:00Z"
    },
    "renter": {
      "renterId": "123e4567-e89b-12d3-a456-426614174001",
      "fullName": "John Doe",
      "identityNumber": "123456789",
      "address": "123 Main St",
      "dateOfBirth": "1990-01-01"
    },
    "vehicle": {
      "vehicleId": "123e4567-e89b-12d3-a456-426614174002",
      "brand": "Tesla",
      "model": "Model 3",
      "licensePlate": "51A-12345",
      "year": 2023,
      "color": "White"
    },
    "rentalLocation": {
      "rentalLocationId": "123e4567-e89b-12d3-a456-426614174003",
      "name": "EV Hub District 7",
      "address": "123 Nguyen Van Linh, HCMC",
      "city": "Ho Chi Minh City",
      "country": "Vietnam"
    }
  }
}
```

**Error Responses:**

- `403 Forbidden`: Access denied. Staff only.
- `404 Not Found`: Booking not found
- `400 Bad Request`: Booking is not pending
- `409 Conflict`: Check-in session already exists

### 2. Create Check-in Session

**Endpoint:** `POST /api/checkin-session/create`

**Purpose:** Create a new check-in session for a validated booking.

**Request Body:**

```json
{
  "bookingId": "123e4567-e89b-12d3-a456-426614174000",
  "staffId": "123e4567-e89b-12d3-a456-426614174004"
}
```

**Validation:**

- `bookingId`: Required, UUID format
- `staffId`: Required, UUID format

**Response (201 Created):**

```json
{
  "message": "Check-in session created successfully",
  "data": {
    "inspectionId": 1,
    "bookingId": "123e4567-e89b-12d3-a456-426614174000",
    "staffId": "123e4567-e89b-12d3-a456-426614174004",
    "inspectionType": "check_in",
    "currentStep": 1,
    "status": "Pending",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Error Responses:**

- `403 Forbidden`: Access denied. Staff only.
- `400 Bad Request`: Invalid booking or not pending
- `409 Conflict`: Check-in session already exists
- `500 Internal Server Error`: Unexpected error

### 3. Get Check-in Sessions List

**Endpoint:** `GET /api/checkin-session/list`

**Purpose:** Retrieve paginated list of check-in sessions for the authenticated staff member.

**Query Parameters:**

- `page` (optional): Page number (default: 1, minimum: 1)
- `pageSize` (optional): Items per page (default: 10, minimum: 1, maximum: 100)
- `status` (optional): Filter by inspection status (`Pending`, `Approved`, `Completed`, `Rejected`)
- `search` (optional): Search by booking ID, vehicle model, or renter name

**Response (200 OK):**

```json
{
  "message": "Check-in sessions retrieved successfully",
  "data": {
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "sessions": [
      {
        "inspectionId": 1,
        "status": "Pending",
        "currentStep": 1,
        "booking": {
          "bookingId": "123e4567-e89b-12d3-a456-426614174000",
          "status": "Pending",
          "depositAmount": 150.0,
          "startTime": "2024-01-01T10:00:00Z",
          "endTime": "2024-01-01T18:00:00Z"
        },
        "vehicle": {
          "brand": "Tesla",
          "model": "Model 3",
          "licensePlate": "51A-12345"
        },
        "renter": {
          "fullName": "John Doe",
          "identityNumber": "123456789"
        }
      }
    ]
  }
}
```

**Error Responses:**

- `403 Forbidden`: Access denied. Staff only.
- `500 Internal Server Error`: Query failure

## Database Schema

### VehicleInspectionDatTT Table

The check-in sessions are stored in the `VehicleInspectionDatTT` table with the following key fields:

- `InspectionDatTTID`: Primary key (bigint, auto-increment)
- `StaffID`: Staff member creating the session (uniqueidentifier)
- `BookingID`: Associated booking (uniqueidentifier)
- `InspectionType`: Type of inspection (`check_in` or `check_out`)
- `CurrentStep`: Current step in the inspection process (tinyint)
- `Status`: Session status (`Pending`, `Approved`, `Completed`, `Rejected`)
- `CreatedAt`: Session creation timestamp
- `UpdatedAt`: Last update timestamp

## Business Logic

### QR Code Validation Flow

1. **Authentication Check**: Verify JWT token and staff role
2. **Booking Validation**: Check if booking exists and is in "Pending" status
3. **Session Check**: Ensure no existing check-in session for this booking
4. **Data Retrieval**: Fetch related entities (renter, vehicle, rental location)

### Check-in Session Creation Flow

1. **Authentication Check**: Verify JWT token and staff role
2. **Booking Validation**: Check if booking exists and is in "Pending" status
3. **Session Check**: Ensure no existing check-in session for this booking
4. **Session Creation**: Create new VehicleInspection record with:
   - `InspectionType`: "check_in"
   - `CurrentStep`: 1
   - `Status`: "Pending"
   - `StaffID`: From request
   - `BookingID`: From request

### Session Listing Flow

1. **Authentication Check**: Verify JWT token and staff role
2. **Staff Filtering**: Only show sessions created by the authenticated staff member
3. **Pagination**: Apply page and pageSize parameters
4. **Filtering**: Apply status and search filters if provided
5. **Data Joining**: Include related booking, vehicle, and renter information

## Error Handling

All APIs implement comprehensive error handling with appropriate HTTP status codes:

- **400 Bad Request**: Invalid input data or business rule violations
- **403 Forbidden**: Authentication/authorization failures
- **404 Not Found**: Resource not found
- **409 Conflict**: Business rule conflicts (e.g., duplicate sessions)
- **500 Internal Server Error**: Unexpected server errors

## Testing

Unit tests are provided for the service layer covering:

- Successful operations
- Error scenarios
- Edge cases
- Business logic validation

Run tests with:

```bash
npm test -- --testPathPatterns=checkin-session.service.spec.ts
```

## Implementation Notes

- **TypeORM**: Used for database operations with query builders for complex joins
- **Validation Pipes**: Request validation using class-validator decorators
- **Swagger Documentation**: Complete API documentation with examples
- **Separation of Concerns**: Clear separation between controller, service, and repository layers
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Security**: JWT authentication with role-based access control
