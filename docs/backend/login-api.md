# Hướng dẫn sử dụng Endpoint Login

## Tổng quan

Endpoint login đã được cải thiện để xử lý các trường hợp lỗi cụ thể và trả về thông báo lỗi rõ ràng bằng tiếng Việt.

## Endpoint

```
POST /api/auth/login
```

## Request Body

```json
{
  "emailOrPhone": "user@example.com", // hoặc "0123456789"
  "password": "password123"
}
```

## Response thành công

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "accountId": "uuid-here",
      "fullName": "Tên người dùng",
      "role": "Renter"
    }
  }
}
```

## Các trường hợp lỗi

### 1. Email không tồn tại

**Status Code:** 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Email không tồn tại trong hệ thống",
  "error": "Email Not Found",
  "code": "EMAIL_NOT_FOUND"
}
```

### 2. Số điện thoại không tồn tại

**Status Code:** 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Số điện thoại không tồn tại trong hệ thống",
  "error": "Phone Not Found",
  "code": "PHONE_NOT_FOUND"
}
```

### 3. Mật khẩu không chính xác

**Status Code:** 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Mật khẩu không chính xác",
  "error": "Invalid Password",
  "code": "INVALID_PASSWORD"
}
```

### 4. Tài khoản bị vô hiệu hóa

**Status Code:** 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Tài khoản đã bị vô hiệu hóa",
  "error": "Account Inactive",
  "code": "ACCOUNT_INACTIVE"
}
```

### 5. Tài khoản bị khóa

**Status Code:** 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Tài khoản đã bị khóa",
  "error": "Account Locked",
  "code": "ACCOUNT_LOCKED"
}
```

### 6. Lỗi server

**Status Code:** 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Có lỗi xảy ra trong quá trình đăng nhập",
  "error": "Internal Server Error",
  "code": "LOGIN_ERROR"
}
```

## Cách hoạt động

1. **Phân biệt Email/Phone:** Hệ thống tự động phân biệt email (chứa @) và số điện thoại
2. **Kiểm tra tài khoản:** Tìm kiếm tài khoản theo email hoặc số điện thoại
3. **Kiểm tra trạng thái:** Xác minh tài khoản có đang hoạt động không
4. **Xác thực mật khẩu:** So sánh mật khẩu với hash trong database
5. **Tạo JWT:** Nếu tất cả đều hợp lệ, tạo access token

## Lưu ý

- Tất cả thông báo lỗi đều bằng tiếng Việt để dễ hiểu
- Mỗi loại lỗi có mã code riêng để frontend có thể xử lý phù hợp
- Response thành công có cấu trúc thống nhất với `success`, `message`, và `data`
