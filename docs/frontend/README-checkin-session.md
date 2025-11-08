# Check-in Session Service

Service để tích hợp với Check-in Session APIs từ backend EV rental system.

## Tổng quan

CheckInSessionService cung cấp các phương thức để:

- Xác thực QR code và lấy thông tin booking
- Tạo phiên check-in mới
- Lấy danh sách phiên check-in với phân trang và lọc
- Cập nhật trạng thái phiên check-in
- Xử lý lỗi một cách nhất quán

## Cài đặt

Service này được export từ `packages/index.ts`, vì vậy bạn có thể import trực tiếp:

```typescript
import { CheckInSessionService } from "@/packages";
```

## API Endpoints được hỗ trợ

### 1. Validate QR Code

```typescript
GET / api / booking / validate - qr / { bookingId };
```

### 2. Create Check-in Session

```typescript
POST / api / checkin - session / create;
```

### 3. Get Check-in Sessions List

```typescript
GET / api / checkin - session / list;
```

## Cách sử dụng

### 1. Xác thực QR Code

```typescript
import { CheckInSessionService } from "@/packages";

async function validateQRCode(bookingId: string) {
  try {
    const response = await CheckInSessionService.validateQRCode(bookingId);

    if (response.success && response.data) {
      const { booking, renter, vehicle, rentalLocation } = response.data;

      // Sử dụng thông tin booking
      console.log("Booking validated:", booking.bookingId);
      console.log("Renter:", renter.fullName);
      console.log("Vehicle:", vehicle.brand, vehicle.model);

      return response.data;
    }
  } catch (error) {
    console.error("Validation failed:", error);
  }
}
```

### 2. Tạo phiên check-in

```typescript
async function createCheckInSession(bookingId: string, staffId: string) {
  try {
    const response = await CheckInSessionService.createSession({
      bookingId,
      staffId,
    });

    if (response.success && response.data) {
      console.log("Session created:", response.data.inspectionId);
      return response.data;
    }
  } catch (error) {
    if (CheckInSessionService.isCheckInSessionError(error)) {
      switch (error.code) {
        case "SESSION_ALREADY_EXISTS":
          console.log("Session already exists");
          break;
        case "BOOKING_NOT_PENDING":
          console.log("Booking is not pending");
          break;
      }
    }
  }
}
```

### 3. Lấy danh sách phiên check-in

```typescript
async function getSessionsList() {
  try {
    const query = {
      page: 1,
      pageSize: 10,
      status: "Pending" as InspectionStatus,
      search: "Tesla",
    };

    const response = await CheckInSessionService.getSessionsList(query);

    if (response.success && response.data) {
      const { total, sessions } = response.data;
      console.log(`Found ${total} sessions`);

      sessions.forEach((session) => {
        console.log(`Session ${session.inspectionId}: ${session.status}`);
      });

      return response.data;
    }
  } catch (error) {
    console.error("Failed to get sessions:", error);
  }
}
```

### 4. Cập nhật trạng thái phiên

```typescript
async function updateSessionStatus(inspectionId: number) {
  try {
    const response = await CheckInSessionService.updateSessionStatus(
      inspectionId,
      "Approved",
      2 // current step
    );

    if (response.success) {
      console.log("Status updated successfully");
    }
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}
```

## Xử lý lỗi

Service cung cấp các phương thức tiện ích để xử lý lỗi:

```typescript
try {
  await CheckInSessionService.validateQRCode(bookingId);
} catch (error) {
  // Kiểm tra xem có phải lỗi API không
  if (CheckInSessionService.isCheckInSessionError(error)) {
    console.error("API Error:", error.message);
    console.error("Status Code:", error.status);
    console.error("Error Code:", error.code);
  }

  // Lấy thông báo lỗi
  const errorMessage = CheckInSessionService.getErrorMessage(error);
  console.error("Error:", errorMessage);
}
```

### Các mã lỗi có thể xảy ra

- `BOOKING_NOT_FOUND`: Booking không tồn tại
- `BOOKING_NOT_PENDING`: Booking không ở trạng thái Pending
- `SESSION_ALREADY_EXISTS`: Đã tồn tại session cho booking này
- `ACCESS_DENIED`: Không có quyền truy cập (chỉ dành cho staff)
- `INVALID_INPUT`: Dữ liệu đầu vào không hợp lệ
- `SERVER_ERROR`: Lỗi server

## Types được sử dụng

### InspectionStatus

```typescript
type InspectionStatus = "Pending" | "Approved" | "Completed" | "Rejected";
```

### InspectionType

```typescript
type InspectionType = "check_in" | "check_out";
```

### CheckInSessionListQuery

```typescript
interface CheckInSessionListQuery {
  page?: number; // Số trang (default: 1)
  pageSize?: number; // Kích thước trang (default: 10, max: 100)
  status?: InspectionStatus; // Lọc theo trạng thái
  search?: string; // Tìm kiếm theo booking ID, vehicle model, renter name
}
```

## Quy trình check-in hoàn chỉnh

```typescript
async function completeCheckinFlow(bookingId: string, staffId: string) {
  try {
    // 1. Xác thực QR code
    const validationResponse =
      await CheckInSessionService.validateQRCode(bookingId);
    if (!validationResponse.success) throw new Error("QR validation failed");

    // 2. Tạo session
    const sessionResponse = await CheckInSessionService.createSession({
      bookingId,
      staffId,
    });
    if (!sessionResponse.success) throw new Error("Session creation failed");

    const inspectionId = sessionResponse.data.inspectionId;

    // 3. Cập nhật trạng thái khi hoàn thành
    await CheckInSessionService.updateSessionStatus(
      inspectionId,
      "Completed",
      5
    );

    console.log("Check-in flow completed successfully!");
  } catch (error) {
    console.error("Check-in flow failed:", error);
    throw error;
  }
}
```

## Lưu ý

1. **Authentication**: Tất cả API calls đều yêu cầu JWT token trong Authorization header
2. **Staff Only**: Chỉ users với role "Staff" mới có thể sử dụng các APIs này
3. **Error Handling**: Luôn sử dụng try-catch để xử lý lỗi
4. **Pagination**: Khi lấy danh sách, sử dụng pagination để tránh load quá nhiều data
5. **Status Management**: Theo dõi và cập nhật trạng thái session một cách chính xác

## Tương lai

Các API endpoints sau sẽ được thêm vào khi backend implement:

- `GET /api/checkin-session/{inspectionId}` - Lấy thông tin chi tiết session
- `PATCH /api/checkin-session/{inspectionId}` - Cập nhật session
- `DELETE /api/checkin-session/{inspectionId}` - Xóa session (nếu cần)

Xem file `checkin-session-usage-example.ts` để có thêm ví dụ chi tiết.
