# Booking APIs Documentation

## Tổng quan

Tài liệu này mô tả việc triển khai Booking APIs trong NestJS với JWT Authentication và Role-based Authorization theo kiến trúc 3-tier.

## Kiến trúc hệ thống

### 3-Tier Architecture

```
Controller → Service → Repository → Entity
```

### Cấu trúc thư mục

```
src/
├── controllers/
│   └── booking.controller.ts
├── services/
│   └── booking.service.ts
├── repositories/
│   ├── booking.repository.ts
│   └── renter.repository.ts
├── entities/
│   ├── booking.entity.ts
│   ├── vehicle.entity.ts
│   ├── rentalLocation.entity.ts
│   ├── renter.entity.ts
│   └── account.entity.ts
├── exceptions/
│   └── booking.exceptions.ts
├── modules/
│   └── booking.module.ts
└── guards/
    └── jwt-auth.guard.ts
```

## Database Schema

### Bảng chính

- **Booking**: Thông tin đặt xe
- **Vehicle**: Thông tin xe
- **RentalLocation**: Địa điểm cho thuê
- **Renter**: Thông tin người thuê
- **Account**: Tài khoản người dùng

### Relationships

```
Account (1) ←→ (1) Renter (1) ←→ (N) Booking (N) ←→ (1) Vehicle (N) ←→ (1) RentalLocation
```

## API Endpoints

### 1. GET /api/booking/all

**Mục đích**: Lấy danh sách tất cả bookings của renter hiện tại

**Authentication**: JWT Token required
**Authorization**: Chỉ role "Renter"

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Response Format**:

```json
{
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "bookingId": "uuid",
      "renterId": "uuid",
      "vehicleId": "uuid",
      "startTime": "2025-01-01T08:00:00Z",
      "endTime": "2025-01-01T11:00:00Z",
      "depositAmount": 150.0,
      "status": "Pending",
      "createdAt": "2025-01-01T07:00:00Z",
      "totalAmount": 450.0,
      "vehicle": {
        "name": "Tesla Model 3",
        "licensePlate": "51A-12345"
      },
      "rentalLocation": {
        "name": "EV Hub District 7",
        "address": "123 Nguyen Van Linh, HCMC"
      }
    }
  ]
}
```

### 2. GET /api/booking/details/:bookingId

**Mục đích**: Lấy chi tiết booking theo ID

**Authentication**: JWT Token required
**Authorization**: Chỉ role "Renter" và booking phải thuộc về renter hiện tại

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Response Format**:

```json
{
  "message": "Booking details retrieved successfully",
  "data": {
    "bookingId": "uuid",
    "renterId": "uuid",
    "vehicleId": "uuid",
    "startTime": "2025-01-01T08:00:00Z",
    "endTime": "2025-01-01T11:00:00Z",
    "depositAmount": 100.0,
    "status": "Confirmed",
    "createdAt": "2025-01-01T07:00:00Z",
    "totalAmount": 300.0,
    "vehicle": {
      "vehicleId": "uuid",
      "rentalLocationId": "uuid",
      "licensePlate": "51H-99888",
      "model": "Leaf",
      "brand": "Nissan",
      "year": 2023,
      "mileage": 20000,
      "batteryCapacity": 60,
      "batteryLevel": 80,
      "chargingCycles": 32,
      "color": "Blue",
      "imageUrl": "https://...",
      "rentalRate": 150,
      "lastServiceDate": "2025-01-01T00:00:00Z",
      "status": "Available"
    },
    "rentalLocation": {
      "rentalLocationId": "uuid",
      "name": "EV Hub District 1",
      "address": "10 Ly Tu Trong, D1, HCMC",
      "city": "HCMC",
      "country": "Vietnam",
      "contactNumber": "0909009009",
      "openingHours": "08:00",
      "closingHours": "22:00",
      "latitude": 10.7724,
      "longitude": 106.6952
    }
  }
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid or missing authentication token",
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied. Only renters can access this resource.",
  "error": "Access Denied",
  "code": "ACCESS_DENIED"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Booking not found or does not belong to you",
  "error": "Booking Not Found",
  "code": "BOOKING_NOT_FOUND"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "An unexpected error occurred",
  "error": "Internal Server Error",
  "code": "INTERNAL_SERVER_ERROR"
}
```

## Implementation Details

### 1. Entities

#### Booking Entity

```typescript
@Entity("Booking")
export class Booking {
  @Column({ name: "BookingID", type: "uniqueidentifier", primary: true })
  BookingID: string;

  @Column({ name: "RenterID", type: "uniqueidentifier" })
  RenterID: string;

  @Column({ name: "VehicleID", type: "uniqueidentifier" })
  VehicleID: string;

  @Column({ name: "StartTime", type: "datetime2" })
  StartTime: Date;

  @Column({ name: "EndTime", type: "datetime2" })
  EndTime: Date;

  @Column({ name: "DepositAmount", type: "decimal", precision: 10, scale: 2 })
  DepositAmount: number;

  @Column({ name: "Status", type: "nvarchar", length: 255 })
  Status: "Pending" | "Confirmed" | "Cancelled" | "Expired" | "Completed";

  @Column({ name: "CreatedAt", type: "datetime2" })
  CreatedAt: Date;

  @Column({ name: "CancelledAt", type: "datetime2", nullable: true })
  CancelledAt: Date;

  // Relations
  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: "VehicleID" })
  vehicle: Vehicle;

  @ManyToOne(() => Renter)
  @JoinColumn({ name: "RenterID" })
  renter: Renter;
}
```

#### Renter Entity

```typescript
@Entity("Renter")
export class Renter {
  @Column({ name: "RenterID", type: "uniqueidentifier", primary: true })
  RenterID: string;

  @Column({ name: "AccountID", type: "uniqueidentifier" })
  AccountID: string;

  @Column({ name: "Address", type: "nvarchar", length: 255, nullable: true })
  Address: string;

  @Column({ name: "DateOfBirth", type: "date", nullable: true })
  DateOfBirth: Date;

  @Column({
    name: "IdentityNumber",
    type: "nvarchar",
    length: 20,
    nullable: true,
  })
  IdentityNumber: string;

  // Relations
  @ManyToOne(() => Account)
  @JoinColumn({ name: "AccountID" })
  account: Account;

  @OneToMany(() => Booking, (booking) => booking.renter)
  bookings: Booking[];
}
```

### 2. Repository Layer

#### BookingRepository

```typescript
@Injectable()
export class BookingRepository {
  async findAllByRenter(renterId: string): Promise<Booking[]> {
    return this.bookingRepository
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.vehicle", "vehicle")
      .leftJoinAndSelect("vehicle.rentalLocation", "rentalLocation")
      .leftJoinAndSelect("booking.renter", "renter")
      .leftJoinAndSelect("renter.account", "account")
      .where("booking.RenterID = :renterId", { renterId })
      .getMany();
  }

  async findByIdAndRenter(
    bookingId: string,
    renterId: string
  ): Promise<Booking | null> {
    return this.bookingRepository
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.vehicle", "vehicle")
      .leftJoinAndSelect("vehicle.rentalLocation", "rentalLocation")
      .leftJoinAndSelect("booking.renter", "renter")
      .leftJoinAndSelect("renter.account", "account")
      .where("booking.BookingID = :bookingId", { bookingId })
      .andWhere("booking.RenterID = :renterId", { renterId })
      .getOne();
  }
}
```

#### RenterRepository

```typescript
@Injectable()
export class RenterRepository {
  async findByAccountId(accountId: string): Promise<Renter | null> {
    return this.renterRepository
      .createQueryBuilder("renter")
      .where("renter.AccountID = :accountId", { accountId })
      .getOne();
  }

  async getRenterIdByAccountId(accountId: string): Promise<string | null> {
    const renter = await this.findByAccountId(accountId);
    return renter ? renter.RenterID : null;
  }
}
```

### 3. Service Layer

#### BookingService

```typescript
@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly renterRepository: RenterRepository
  ) {}

  async findAll(
    user: JwtPayload
  ): Promise<ApiResponse<BookingWithComputedFields[]>> {
    try {
      // Validate user role
      if (user.role !== "Renter") {
        throw new AccessDeniedException();
      }

      // Get renter ID from account ID
      const renterId = await this.getRenterIdByAccountId(user.accountId);

      const bookings = await this.bookingRepository.findAllByRenter(renterId);

      const bookingData = bookings.map((booking) => ({
        bookingId: booking.BookingID,
        renterId: booking.RenterID,
        vehicleId: booking.VehicleID,
        startTime: booking.StartTime,
        endTime: booking.EndTime,
        depositAmount: booking.DepositAmount,
        status: booking.Status,
        createdAt: booking.CreatedAt,
        totalAmount: this.calculateTotalAmount(
          booking.StartTime,
          booking.EndTime,
          booking.DepositAmount
        ),
        vehicle: {
          name: this.combineVehicleName(
            booking.vehicle.Brand,
            booking.vehicle.Model
          ),
          licensePlate: booking.vehicle.LicensePlate,
        },
        rentalLocation: {
          name: booking.vehicle.rentalLocation.Name,
          address: booking.vehicle.rentalLocation.Address,
        },
      }));

      return {
        message: "Bookings retrieved successfully",
        data: bookingData,
      };
    } catch (error) {
      if (error instanceof AccessDeniedException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to retrieve bookings");
    }
  }

  private calculateTotalAmount(
    startTime: Date,
    endTime: Date,
    depositAmount: number
  ): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return depositAmount * hours;
  }

  private combineVehicleName(brand: string, model: string): string {
    return `${brand} ${model}`;
  }

  private async getRenterIdByAccountId(accountId: string): Promise<string> {
    const renterId =
      await this.renterRepository.getRenterIdByAccountId(accountId);
    if (!renterId) {
      throw new UnauthorizedException();
    }
    return renterId;
  }
}
```

### 4. Controller Layer

#### BookingController

```typescript
@Controller("booking")
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get("all")
  async getAllBookings(@Request() req: any) {
    const user: JwtPayload = req.user;
    return this.bookingService.findAll(user);
  }

  @Get("details/:bookingId")
  async getBookingDetails(
    @Param("bookingId") bookingId: string,
    @Request() req: any
  ) {
    const user: JwtPayload = req.user;
    return this.bookingService.findById(bookingId, user);
  }
}
```

### 5. Exception Handling

#### Booking Exceptions

```typescript
export class BookingNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Booking not found or does not belong to you",
        error: "Booking Not Found",
        code: "BOOKING_NOT_FOUND",
      },
      HttpStatus.NOT_FOUND
    );
  }
}

export class AccessDeniedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: "Access denied. Only renters can access this resource.",
        error: "Access Denied",
        code: "ACCESS_DENIED",
      },
      HttpStatus.FORBIDDEN
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Invalid or missing authentication token",
        error: "Unauthorized",
        code: "UNAUTHORIZED",
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = "An unexpected error occurred") {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
```

### 6. Module Configuration

#### BookingModule

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Vehicle,
      RentalLocation,
      Renter,
      Account,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, RenterRepository],
  exports: [BookingService, BookingRepository, RenterRepository],
})
export class BookingModule {}
```

## Business Logic

### 1. Total Amount Calculation

```typescript
totalAmount = DepositAmount × (EndTime - StartTime in hours)
```

### 2. Vehicle Name Combination

```typescript
vehicleName = Brand + " " + Model;
```

### 3. Access Control Flow

1. JWT token validation
2. Extract user information (accountId, role)
3. Role validation (must be "Renter")
4. Get RenterID from AccountID
5. Filter bookings by RenterID
6. Return filtered results

## Security Features

### 1. JWT Authentication

- Tất cả endpoints yêu cầu JWT token
- Token được validate bởi JwtAuthGuard

### 2. Role-based Authorization

- Chỉ user có role "Renter" mới được truy cập
- Trả về 403 Forbidden nếu role không đúng

### 3. Data Isolation

- Mỗi renter chỉ thấy bookings của mình
- Kiểm tra ownership trước khi trả về data

### 4. Input Validation

- Validate bookingId format
- Check booking existence và ownership

## Testing

### 1. Test với Postman/Insomnia

#### Login để lấy JWT token

```
POST /auth/login
Content-Type: application/json

{
  "email": "renter@example.com",
  "password": "password123"
}
```

#### Test GET /booking/all

```
GET /booking/all
Authorization: Bearer <jwt_token>
```

#### Test GET /booking/details/:bookingId

```
GET /booking/details/{bookingId}
Authorization: Bearer <jwt_token>
```

### 2. Test Cases

#### Positive Cases

- ✅ Login với role Renter
- ✅ Lấy danh sách bookings của renter
- ✅ Lấy chi tiết booking thuộc về renter

#### Negative Cases

- ❌ Không có JWT token (401)
- ❌ JWT token invalid (401)
- ❌ Role không phải Renter (403)
- ❌ Booking không tồn tại (404)
- ❌ Booking không thuộc về renter (404)

## Deployment Notes

### 1. Environment Variables

```env
# Database Configuration
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_NAME=FA25_SWD392_SE1849_G5_EVRental
DB_SYNC=false
DB_ENCRYPT=false
DB_TRUSTSERVERCERTIFICATE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
```

### 2. Database Setup

- Đảm bảo database đã được tạo với schema đúng
- Chạy insert_values.sql để có dữ liệu test
- Set synchronize: false trong TypeORM config

### 3. Dependencies

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "typeorm": "^0.3.17",
  "mssql": "^10.0.0"
}
```

## Troubleshooting

### 1. Common Issues

#### Database Connection Error

- Kiểm tra connection string trong .env
- Đảm bảo SQL Server đang chạy
- Verify database name và credentials

#### JWT Token Issues

- Kiểm tra JWT_SECRET trong .env
- Verify token format trong request header
- Check token expiration

#### Circular Dependency

- Loại bỏ eager loading trong entities
- Sử dụng QueryBuilder trong repositories
- Import entities đúng thứ tự

### 2. Debug Tips

- Enable logging trong TypeORM
- Check network requests trong browser dev tools
- Verify database queries với SQL Server Management Studio

## Future Enhancements

### 1. Potential Improvements

- Add pagination cho GET /booking/all
- Implement caching với Redis
- Add rate limiting
- Implement soft delete
- Add audit logging

### 2. Additional Features

- Booking creation API
- Booking cancellation API
- Booking status updates
- Booking history tracking
- Advanced filtering và sorting

## Conclusion

Booking APIs đã được triển khai hoàn chỉnh với:

- ✅ JWT Authentication & Role-based Authorization
- ✅ Data isolation theo renter
- ✅ Proper error handling
- ✅ Standard response format
- ✅ 3-tier architecture
- ✅ TypeORM integration
- ✅ Comprehensive documentation

APIs sẵn sàng cho production use với đầy đủ security và business logic requirements.
