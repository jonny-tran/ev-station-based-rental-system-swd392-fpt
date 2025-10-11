# Step 3: Contract Signing APIs Documentation

## Tổng quan

Step 3 trong quy trình check-in xe điện là bước ký hợp đồng điện tử. Staff và renter sẽ ký hợp đồng thông qua các API này.

## Các API Endpoints

### 1. GET /api/contract/staff/list

**Mục đích:** Lấy danh sách tất cả hợp đồng của staff

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (number, optional): Số trang (mặc định: 1)
- `pageSize` (number, optional): Số item mỗi trang (mặc định: 10)
- `status` (string, optional): Lọc theo trạng thái hợp đồng (Draft, Active, Completed, Terminated, Voided)
- `search` (string, optional): Tìm kiếm theo booking ID, biển số xe, hoặc tên renter

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
        "renterName": "Nguyen Van A",
        "renterEmail": "renter@example.com",
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

**Lỗi có thể xảy ra:**

- `403 Forbidden`: Chỉ staff mới được phép
- `500 Internal Server Error`: Lỗi server

---

### 2. GET /api/contract/renter/list

**Mục đích:** Lấy danh sách tất cả hợp đồng của renter

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (number, optional): Số trang (mặc định: 1)
- `pageSize` (number, optional): Số item mỗi trang (mặc định: 10)
- `status` (string, optional): Lọc theo trạng thái hợp đồng (Draft, Active, Completed, Terminated, Voided)
- `search` (string, optional): Tìm kiếm theo booking ID, biển số xe, hoặc tên renter

**Response:**

```json
{
  "message": "Renter contracts retrieved successfully",
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
        "renterName": "Nguyen Van A",
        "renterEmail": "renter@example.com",
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

**Lỗi có thể xảy ra:**

- `403 Forbidden`: Chỉ renter mới được phép
- `500 Internal Server Error`: Lỗi server

---

### 3. GET /api/contract/{contractId}

**Mục đích:** Lấy thông tin chi tiết hợp đồng cho Step 3

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**

- `contractId` (string): ID của hợp đồng

**Response:**

```json
{
  "message": "Contract details retrieved successfully",
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "bookingId": "456e7890-e89b-12d3-a456-426614174001",
    "status": "Draft",
    "termsAndConditions": "Standard rental terms and conditions apply.",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-02T00:00:00.000Z",
    "signedByRenter": false,
    "signedByStaff": false,
    "signedAt": null,
    "renter": {
      "renterId": "789e0123-e89b-12d3-a456-426614174002",
      "fullName": "Nguyen Van A",
      "email": "renter@example.com",
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

**Lỗi có thể xảy ra:**

- `404 Not Found`: Hợp đồng không tồn tại
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 4. PUT /api/contract/{contractId}/submit

**Mục đích:** Staff gửi hợp đồng cho renter ký

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parameters:**

- `contractId` (string): ID của hợp đồng

**Body:**

```json
{
  "renterInfo": {
    "fullName": "Nguyen Van A",
    "email": "renter@example.com",
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
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "statusReason": null
  }
}
```

**Lỗi có thể xảy ra:**

- `400 Bad Request`: Trạng thái hợp đồng không hợp lệ
- `403 Forbidden`: Chỉ staff mới được phép
- `404 Not Found`: Hợp đồng không tồn tại
- `500 Internal Server Error`: Lỗi server

---

### 5. PUT /api/contract/{contractId}/staff-sign

**Mục đích:** Staff ký hợp đồng

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parameters:**

- `contractId` (string): ID của hợp đồng

**Body:**

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
    "updatedAt": "2024-01-01T10:30:00.000Z",
    "statusReason": null
  }
}
```

**Lỗi có thể xảy ra:**

- `400 Bad Request`: Renter chưa ký hoặc trạng thái không hợp lệ
- `403 Forbidden`: Chỉ staff mới được phép
- `404 Not Found`: Hợp đồng không tồn tại
- `500 Internal Server Error`: Lỗi server

---

### 6. PUT /api/contract/{contractId}/renter-sign

**Mục đích:** Renter ký hợp đồng (API cho mobile app)

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parameters:**

- `contractId` (string): ID của hợp đồng

**Body:**

```json
{
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Response:**

```json
{
  "message": "Renter signed the contract successfully",
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "Active",
    "signedByRenter": true,
    "signedByStaff": false,
    "signedAt": null,
    "updatedAt": "2024-01-01T10:15:00.000Z",
    "statusReason": null
  }
}
```

**Lỗi có thể xảy ra:**

- `403 Forbidden`: Chỉ renter mới được phép hoặc không phải hợp đồng của mình
- `404 Not Found`: Hợp đồng không tồn tại
- `500 Internal Server Error`: Lỗi server

---

### 7. PUT /api/contract/{contractId}/reject

**Mục đích:** Staff từ chối hợp đồng

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parameters:**

- `contractId` (string): ID của hợp đồng

**Body:**

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
    "signedAt": null,
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "statusReason": "Contract contains incorrect information"
  }
}
```

**Lỗi có thể xảy ra:**

- `400 Bad Request`: Trạng thái không hợp lệ
- `403 Forbidden`: Chỉ staff mới được phép
- `404 Not Found`: Hợp đồng không tồn tại
- `500 Internal Server Error`: Lỗi server

---

### 6. PUT /api/checkin-session/{inspectionId}/step3/approve

**Mục đích:** Xác nhận hoàn thành ký hợp đồng, chuyển sang Step 4

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**

- `inspectionId` (number): ID của phiên kiểm tra

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

**Lỗi có thể xảy ra:**

- `400 Bad Request`: Step không hợp lệ hoặc hợp đồng chưa hoàn thành
- `403 Forbidden`: Chỉ staff mới được phép
- `404 Not Found`: Phiên kiểm tra không tồn tại
- `500 Internal Server Error`: Lỗi server

## Business Logic

### Quy trình ký hợp đồng:

1. **Draft → Active**: Staff submit hợp đồng cho renter ký
2. **Active → Completed**: Cả staff và renter đều ký
3. **Active → Voided**: Staff từ chối hợp đồng

### Quy tắc ký:

- **Staff phải ký sau renter**: Staff chỉ có thể ký khi renter đã ký
- **Renter có thể ký trước**: Renter có thể ký ngay khi hợp đồng ở trạng thái Active
- **Hợp đồng hoàn thành**: Khi cả hai bên đã ký, hợp đồng tự động chuyển sang Completed

### Authorization:

- **Staff APIs**: `/submit`, `/staff-sign`, `/reject`, `/step3/approve`
- **Renter APIs**: `/renter-sign`
- **Both**: `/get` (với điều kiện ownership)

## Testing

### Unit Tests

- `apps/api/test/contract.service.spec.ts`: Test business logic của ContractService

### Integration Tests

- Test các endpoints với JWT authentication
- Test authorization rules
- Test contract state transitions

## Dependencies

- **JWT Authentication**: Tất cả APIs đều yêu cầu JWT token
- **Role-based Access**: Phân quyền theo role (Staff/Renter)
- **Ownership Validation**: Kiểm tra quyền sở hữu hợp đồng
- **State Management**: Quản lý trạng thái hợp đồng nghiêm ngặt

## Error Handling

Tất cả APIs đều có error handling đầy đủ với các HTTP status codes phù hợp:

- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Tài nguyên không tồn tại
- `500 Internal Server Error`: Lỗi server
