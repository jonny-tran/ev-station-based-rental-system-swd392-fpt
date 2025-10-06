# Postman Testing Guide - Step 2 APIs

## Cách test API Upload Photos với Postman

### 1. Setup Request

**Method:** `POST`  
**URL:** `http://localhost:3000/api/checkin-session/{inspectionId}/photos`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data (Postman sẽ tự động set)
```

### 2. Body Configuration

Chọn **form-data** trong tab Body:

| Key       | Type | Value         | Description      |
| --------- | ---- | ------------- | ---------------- |
| `front`   | File | [Choose File] | Ảnh mặt trước xe |
| `rear`    | File | [Choose File] | Ảnh mặt sau xe   |
| `left`    | File | [Choose File] | Ảnh bên trái xe  |
| `right`   | File | [Choose File] | Ảnh bên phải xe  |
| `odo`     | File | [Choose File] | Ảnh đồng hồ km   |
| `battery` | File | [Choose File] | Ảnh mức pin      |

### 3. File Requirements

- **Format:** JPEG hoặc PNG
- **Size:** Tối đa 5MB mỗi file
- **Quantity:** Chính xác 6 files
- **Names:** front, rear, left, right, odo, battery

### 4. Expected Response

**Success (200):**

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

**Error (400):**

```json
{
  "message": "Missing required photo: front",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 5. Common Issues & Solutions

#### Issue 1: "Unexpected field - front"

**Cause:** Sử dụng sai interceptor  
**Solution:** ✅ Đã fix - sử dụng FileFieldsInterceptor

#### Issue 2: "Missing required photo: front"

**Cause:** Không upload đủ 6 files hoặc tên field sai  
**Solution:** Đảm bảo upload đủ 6 files với tên chính xác

#### Issue 3: "Invalid file type"

**Cause:** File không phải JPEG/PNG  
**Solution:** Convert file sang định dạng đúng

#### Issue 4: "File size too large"

**Cause:** File > 5MB  
**Solution:** Compress file hoặc chọn file nhỏ hơn

#### Issue 5: "Access denied. Staff only"

**Cause:** JWT token không hợp lệ hoặc role không phải Staff  
**Solution:** Kiểm tra JWT token và role

### 6. Test Cases

#### Test Case 1: Valid Upload

- Upload 6 files JPEG/PNG < 5MB
- Expected: 200 OK với photoUrls

#### Test Case 2: Missing Files

- Upload chỉ 5 files
- Expected: 400 Bad Request

#### Test Case 3: Invalid File Type

- Upload file .txt
- Expected: 400 Bad Request

#### Test Case 4: File Too Large

- Upload file > 5MB
- Expected: 400 Bad Request

#### Test Case 5: Unauthorized

- Không có JWT token
- Expected: 401 Unauthorized

### 7. Environment Variables

Đảm bảo có các biến môi trường:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 8. Debug Tips

1. **Check Network Tab:** Xem request có được gửi đúng không
2. **Check Console:** Xem server logs
3. **Verify JWT:** Decode token để kiểm tra role
4. **Test File Size:** Kiểm tra size của từng file
5. **Check Field Names:** Đảm bảo tên field chính xác

### 9. Sample Test Files

Tạo 6 file test với tên:

- `test-front.jpg` (1MB)
- `test-rear.jpg` (1MB)
- `test-left.jpg` (1MB)
- `test-right.jpg` (1MB)
- `test-odo.jpg` (1MB)
- `test-battery.jpg` (1MB)

### 10. Postman Collection

Có thể tạo Postman Collection với:

- Environment variables cho JWT token
- Pre-request scripts để auto-generate token
- Test scripts để validate response
- Folder structure cho từng API
