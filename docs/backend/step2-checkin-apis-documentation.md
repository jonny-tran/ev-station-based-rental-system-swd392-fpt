# Step 2: Vehicle Inspection APIs Documentation

## Tổng quan

Step 2 trong quy trình check-in xe điện bao gồm việc kiểm tra tình trạng xe, nhập số km, mức pin và upload 6 ảnh bắt buộc. Các APIs này chỉ dành cho Staff và yêu cầu JWT authentication.

## Authentication

Tất cả APIs yêu cầu:

- JWT token trong header: `Authorization: Bearer <token>`
- Role phải là "Staff"
- StaffID trong token phải khớp với StaffID của inspection

## APIs

### 1. Upload Vehicle Inspection Photos

**Endpoint:** `POST /api/checkin-session/{inspectionId}/photos`

**Mô tả:** Upload 6 ảnh kiểm tra xe (front, rear, left, right, odo, battery)

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Parameters:**

- `inspectionId` (path): ID của inspection (number)

**Body (FormData):**

| KEY (name) | TYPE | VALUE (file)                      | REQUIRED |
| ---------- | ---- | --------------------------------- | -------- |
| `front`    | File | _Choose image file (front.jpg)_   | ✅       |
| `rear`     | File | _Choose image file (rear.jpg)_    | ✅       |
| `left`     | File | _Choose image file (left.jpg)_    | ✅       |
| `right`    | File | _Choose image file (right.jpg)_   | ✅       |
| `odo`      | File | _Choose image file (odo.jpg)_     | ✅       |
| `battery`  | File | _Choose image file (battery.jpg)_ | ✅       |

**Validation:**

- File types: image/jpeg, image/png
- Max size: 5MB mỗi file
- Tất cả 6 files đều bắt buộc

**Response 200:**

```json
{
  "message": "Vehicle inspection photos uploaded successfully",
  "data": {
    "inspectionId": 101,
    "photoUrls": [
      "https://res.cloudinary.com/.../front.jpg",
      "https://res.cloudinary.com/.../rear.jpg",
      "https://res.cloudinary.com/.../left.jpg",
      "https://res.cloudinary.com/.../right.jpg",
      "https://res.cloudinary.com/.../odo.jpg",
      "https://res.cloudinary.com/.../battery.jpg"
    ]
  }
}
```

**Error Responses:**

- `400`: Missing or invalid files
- `403`: Access denied. Staff only or mismatched staff ID
- `404`: Inspection not found
- `500`: Cloudinary upload failure

### 2. Update Vehicle Inspection Data

**Endpoint:** `PUT /api/checkin-session/{inspectionId}/vehicle-data`

**Mô tả:** Cập nhật dữ liệu kiểm tra xe và tạo contract (chuyển sang Step 3)

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**

- `inspectionId` (path): ID của inspection (number)

**Body:**

```json
{
  "odometerKm": 980,
  "batteryLevel": 86,
  "vehicleConditionNotes": "Normal condition",
  "damageNotes": ""
}
```

**Validation:**

- `odometerKm`: >= 0
- `batteryLevel`: 0-100
- `vehicleConditionNotes`: optional string
- `damageNotes`: optional string

**Response 200:**

```json
{
  "message": "Vehicle inspection data updated and contract created (Step 3)",
  "data": {
    "inspectionId": 101,
    "currentStep": 3,
    "status": "Pending",
    "odometerReading": 980,
    "batteryLevel": 86,
    "contract": {
      "contractId": "123e4567-e89b-12d3-a456-426614174000",
      "bookingId": "123e4567-e89b-12d3-a456-426614174000",
      "status": "Draft",
      "startDate": "2024-01-15T10:00:00Z",
      "endDate": "2024-01-20T18:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400`: Invalid step or missing fields
- `403`: Access denied. Staff only or mismatched staff ID
- `404`: Inspection not found
- `500`: Failed contract creation

### 3. Reject Step 2 - Vehicle Inspection

**Endpoint:** `PUT /api/checkin-session/{inspectionId}/step2/reject`

**Mô tả:** Staff từ chối kiểm tra xe

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**

- `inspectionId` (path): ID của inspection (number)

**Body:**

```json
{
  "reason": "Front bumper damaged"
}
```

**Validation:**

- `reason`: required string

**Response 200:**

```json
{
  "message": "Vehicle inspection rejected",
  "data": {
    "inspectionId": 101,
    "status": "Rejected",
    "rejectedReason": "Front bumper damaged"
  }
}
```

**Error Responses:**

- `400`: Missing reason or invalid step
- `403`: Access denied. Staff only or mismatched staff ID
- `404`: Inspection not found
- `500`: Update failed

## Business Logic

### Workflow Step 2:

1. Staff upload 6 ảnh kiểm tra xe
2. Staff nhập dữ liệu xe (km, pin, ghi chú) → **Tự động tạo contract và chuyển sang Step 3**
3. Nếu có vấn đề, Staff có thể từ chối:
   - **Reject**: Cập nhật status "Rejected" với lý do

### Database Changes:

- **VehicleInspection**: Cập nhật OdometerReading, BatteryLevel, PhotoUrls, CurrentStep
- **Contract**: Tạo mới với status "Draft" khi update vehicle data

### Validation Rules:

- Chỉ Staff mới được truy cập
- StaffID phải khớp với inspection
- CurrentStep phải = 2
- Status phải = "Pending" (trừ reject)
- File upload: 6 files, JPEG/PNG, max 5MB
- Odometer: >= 0
- Battery: 0-100%

## Testing

### Unit Tests:

- `apps/api/test/step2-checkin-session.service.spec.ts`

### Test Cases:

- Upload photos validation (file count, type, size)
- Staff authorization
- Step validation
- Contract creation
- Error handling

## Dependencies

- **Multer**: File upload handling
- **Cloudinary**: Image storage
- **TypeORM**: Database operations
- **JWT**: Authentication
- **Class-validator**: Input validation

## Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
