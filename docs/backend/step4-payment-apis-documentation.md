# Step 4: Payment APIs Documentation

## Tổng quan

Step 4 trong quy trình check-in xe điện là bước thanh toán. Sau khi hợp đồng đã được ký (Step 3), staff sẽ tạo payment URL thông qua VNPay để thực hiện thanh toán. API này chỉ dành cho Staff và yêu cầu JWT authentication.

## Authentication

Tất cả APIs yêu cầu:

- JWT token trong header: `Authorization: Bearer <token>`
- Role có thể là "Staff" hoặc "Renter" (tùy vào business logic)
- StaffID trong token phải khớp với StaffID của inspection (nếu là staff)

## Các API Endpoints

### 1. Create VNPay Payment URL

**Endpoint:** `POST /api/payment/create-payment-url`

**Mô tả:** Tạo payment URL từ VNPay để thanh toán cho check-in session ở step 4. API này sẽ:
1. Validate inspection đang ở step 4
2. Tính toán tổng số tiền (deposit + rental price)
3. Tạo Payment record với status "Pending"
4. Generate VNPay payment URL

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "inspectionId": "101",
  "paymentMethod": "VNPay"
}
```

**Validation:**

- `inspectionId`: Required, string (sẽ được convert sang number)
- `paymentMethod`: Required, enum, chỉ chấp nhận "VNPay"
- Inspection phải tồn tại
- Inspection.CurrentStep phải = 4
- Contract phải tồn tại (đã hoàn thành step 3)
- Booking phải tồn tại
- Vehicle phải tồn tại

**Response 200:**

```json
{
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=15000000&vnp_Command=pay&vnp_CreateDate=20240101103000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+checkin+xe+101&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:3000/payment/callback&vnp_TmnCode=YOUR_TMN_CODE&vnp_TxnRef=1&vnp_Version=2.1.0&vnp_SecureHash=...",
  "paymentId": 1
}
```

**Error Responses:**

- `400 Bad Request`: 
  - Invalid payment method (chỉ hỗ trợ VNPay)
  - Invalid inspection ID format
  - Inspection không ở step 4
  - Total amount <= 0
- `404 Not Found`: 
  - Vehicle inspection not found
  - Booking not found
  - Contract not found (chưa hoàn thành step 3)
  - Vehicle not found
- `500 Internal Server Error`: Server error khi tạo payment hoặc generate URL

**Example Request:**

```bash
curl -X POST http://localhost:5000/api/payment/create-payment-url \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "inspectionId": "101",
    "paymentMethod": "VNPay"
  }'
```

**Example Response:**

```json
{
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=15000000&vnp_Command=pay&vnp_CreateDate=20240101103000&vnp_CurrCode=VND&vnp_IpAddr=192.168.1.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+checkin+xe+101&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:3000/payment/callback&vnp_TmnCode=TEST_TMN&vnp_TxnRef=1&vnp_Version=2.1.0&vnp_SecureHash=abc123...",
  "paymentId": 1
}
```

## Business Logic

### Quy trình thanh toán Step 4:

1. **Validation**: 
   - Kiểm tra inspection tồn tại và đang ở step 4
   - Kiểm tra contract đã được tạo (step 3 đã hoàn thành)
   - Kiểm tra booking và vehicle tồn tại

2. **Tính toán tổng tiền**:
   - `depositAmount` = Booking.DepositAmount
   - `rentalPrice` = Vehicle.RentalRate × số giờ thuê (làm tròn lên)
   - `totalAmount` = depositAmount + rentalPrice
   - Số giờ thuê = (Booking.EndTime - Booking.StartTime) / (1000 × 60 × 60), làm tròn lên

3. **Tạo Payment Record**:
   - ContractDatTTID: ID của contract
   - Amount: totalAmount
   - Currency: "VND"
   - PaymentType: "RentalFee"
   - PaymentMethod: "VNPay"
   - Status: "Pending"
   - TransactionID: null (sẽ được cập nhật sau khi thanh toán thành công)
   - PaymentDate: thời gian hiện tại

4. **Generate VNPay URL**:
   - Amount: totalAmount × 100 (VNPay yêu cầu đơn vị nhỏ nhất)
   - IP Address: từ request (x-forwarded-for, x-real-ip, hoặc req.ip)
   - Order ID: PaymentID (ID của payment record vừa tạo)
   - Order Info: "Thanh toan checkin xe {inspectionId}"
   - Return URL: từ config (VNPAY_RETURN_URL) hoặc default
   - Locale: "vn"
   - Order Type: "other"

### Database Changes:

- **Payment Table**: Tạo record mới với:
  - ContractDatTTID: Link đến contract
  - Amount: Tổng số tiền thanh toán
  - Status: "Pending"
  - PaymentMethod: "VNPay"
  - PaymentType: "RentalFee"

### Validation Rules:

- Chỉ chấp nhận payment method "VNPay"
- Inspection.CurrentStep phải = 4
- Contract phải tồn tại (đã hoàn thành step 3)
- Total amount phải > 0
- IP address sẽ được extract từ request headers

### Calculation Formula:

```
depositAmount = Booking.DepositAmount
durationHours = Math.ceil((Booking.EndTime - Booking.StartTime) / (1000 * 60 * 60))
rentalPrice = Vehicle.RentalRate * durationHours
totalAmount = depositAmount + rentalPrice
vnpayAmount = Math.round(totalAmount * 100) // VNPay requires smallest currency unit
```

## Error Handling

Tất cả APIs đều có error handling đầy đủ với các HTTP status codes phù hợp:

- `400 Bad Request`: 
  - Invalid payment method
  - Invalid inspection ID
  - Inspection không ở step 4
  - Total amount <= 0
- `404 Not Found`: 
  - Vehicle inspection not found
  - Booking not found
  - Contract not found
  - Vehicle not found
- `500 Internal Server Error`: 
  - Lỗi khi tạo payment record
  - Lỗi khi generate VNPay URL
  - Lỗi database

## Dependencies

- **nestjs-vnpay**: Module tích hợp VNPay payment gateway
- **vnpay**: Package VNPay SDK
- **TypeORM**: Database operations
- **JWT**: Authentication
- **Class-validator**: Input validation
- **@nestjs/config**: Configuration management

## Environment Variables

Cần cấu hình các biến môi trường sau trong file `.env`:

```env
# VNPay Configuration
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECURE_SECRET=your_secure_secret
VNPAY_HOST=https://sandbox.vnpayment.vn  # Optional, default: sandbox
VNPAY_TEST_MODE=true  # Optional, default: false
VNPAY_HASH_ALGORITHM=SHA512  # Optional, default: SHA512
VNPAY_ENABLE_LOG=true  # Optional, default: false
VNPAY_RETURN_URL=http://localhost:3000/payment/callback  # Optional, default: localhost:3000/payment/callback
```

### Giải thích các biến môi trường:

- `VNPAY_TMN_CODE`: Mã Terminal ID của VNPay (bắt buộc)
- `VNPAY_SECURE_SECRET`: Mã bảo mật của VNPay (bắt buộc)
- `VNPAY_HOST`: URL của VNPay gateway (optional, mặc định: sandbox)
- `VNPAY_TEST_MODE`: Chế độ test (optional, mặc định: false)
- `VNPAY_HASH_ALGORITHM`: Thuật toán mã hóa (optional, mặc định: SHA512)
- `VNPAY_ENABLE_LOG`: Bật/tắt log (optional, mặc định: false)
- `VNPAY_RETURN_URL`: URL callback sau khi thanh toán (optional)

## Testing

### Unit Tests:

File test: `apps/api/test/payment.service.spec.ts` (cần tạo)

### Test Cases:

- ✅ Validate payment method (chỉ chấp nhận VNPay)
- ✅ Validate inspection step (phải = 4)
- ✅ Validate inspection exists
- ✅ Validate contract exists
- ✅ Calculate total amount correctly
- ✅ Create payment record with correct data
- ✅ Generate VNPay URL with correct parameters
- ✅ Handle errors properly
- ✅ IP address extraction from request

### Integration Tests:

- Test với JWT authentication
- Test với invalid inspection ID
- Test với inspection không ở step 4
- Test với contract không tồn tại
- Test VNPay URL generation
- Test payment record creation

### Manual Testing với Postman:

1. **Setup**:
   - Đăng nhập để lấy JWT token
   - Tạo check-in session và hoàn thành step 1-3
   - Lấy inspectionId từ step 3

2. **Test Create Payment URL**:
   - Method: POST
   - URL: `http://localhost:5000/api/payment/create-payment-url`
   - Headers:
     - `Authorization: Bearer <token>`
     - `Content-Type: application/json`
   - Body:
     ```json
     {
       "inspectionId": "101",
       "paymentMethod": "VNPay"
     }
     ```

3. **Expected Result**:
   - Status: 200 OK
   - Response có `paymentUrl` và `paymentId`
   - PaymentUrl có thể mở được trên browser

## Payment Flow

### Complete Payment Flow:

1. **Step 1**: Staff validate QR code và tạo check-in session
2. **Step 2**: Staff upload photos và nhập vehicle data → Tạo contract
3. **Step 3**: Staff và Renter ký contract → Hoàn thành step 3, chuyển sang step 4
4. **Step 4**: Staff gọi API `create-payment-url` → Nhận payment URL
5. **Step 5**: Redirect user đến VNPay URL để thanh toán
6. **Step 6**: VNPay callback về `VNPAY_RETURN_URL` với kết quả thanh toán
7. **Step 7**: (Future) Update payment status dựa trên callback

### Payment Status Flow:

```
Pending → (after payment) → Paid/Failed
```

- **Pending**: Payment đã được tạo, chờ thanh toán
- **Paid**: Thanh toán thành công (sẽ được cập nhật từ VNPay callback)
- **Failed**: Thanh toán thất bại (sẽ được cập nhật từ VNPay callback)

## Implementation Notes

### VNPay Integration:

- Sử dụng package `nestjs-vnpay` v1.0.4
- Sử dụng package `vnpay` v2.4.4
- VNPay service được inject vào PaymentService
- Payment URL được generate bằng method `buildPaymentUrl()`

### IP Address Extraction:

IP address được extract theo thứ tự ưu tiên:
1. `x-forwarded-for` header (lấy IP đầu tiên)
2. `x-real-ip` header
3. `req.ip`
4. `req.socket.remoteAddress`
5. Default: "127.0.0.1"

### Amount Calculation:

- VNPay yêu cầu amount ở đơn vị nhỏ nhất (VND × 100)
- Ví dụ: 150,000 VND → 15,000,000 (trong VNPay)

### Order ID:

- Sử dụng PaymentID làm order ID (orderId)
- PaymentID là bigint, được convert sang string
- Order ID này sẽ được dùng để verify payment từ VNPay callback

## Security Considerations

1. **Authentication**: Tất cả APIs yêu cầu JWT token
2. **Authorization**: Chỉ staff có quyền tạo payment URL
3. **Validation**: Validate đầy đủ input data
4. **Secure Secret**: VNPay secure secret phải được bảo mật, không commit vào git
5. **HTTPS**: Nên sử dụng HTTPS trong production
6. **IP Validation**: VNPay sẽ validate IP address

## Future Enhancements

1. **Payment Callback Handler**: Tạo API để handle VNPay callback
2. **Payment Status Update**: Update payment status sau khi thanh toán
3. **Payment History**: API để xem lịch sử thanh toán
4. **Refund Support**: Hỗ trợ hoàn tiền
5. **Payment Verification**: Verify payment signature từ VNPay
6. **Multiple Payment Methods**: Hỗ trợ thêm các payment method khác (nếu cần)

## Related APIs

- **Step 3 Contract APIs**: `/api/contract/*` - Cần hoàn thành step 3 trước khi tạo payment
- **Check-in Session APIs**: `/api/checkin-session/*` - Quản lý check-in session
- **Booking APIs**: `/api/booking/*` - Quản lý booking

## References

- [VNPay Documentation](https://sandbox.vnpayment.vn/apis)
- [nestjs-vnpay GitHub](https://github.com/lehuygiang28/nestjs-vnpay)
- [VNPay Integration Guide](https://vnpay.js.org/)

## Changelog

### Version 1.0.0 (2024-01-01)

- Initial implementation
- Create payment URL API
- VNPay integration
- Payment record creation

