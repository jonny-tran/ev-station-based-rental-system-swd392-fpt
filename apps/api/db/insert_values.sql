-- Insert sample accounts
--- Password: pass123456789
INSERT INTO [Account] ([Email], [PasswordHash], [PhoneNumber], [FullName], [AvatarUrl], [Role], [Status])
VALUES
('jonnytran.working@gmail.com', '$2a$16$i1qpiIFTr67AljIEU9rU3e4SqlVqzM5LdJDbo4afduGbxCHib2HTK', '0869503259', N'Trần Thành Đạt', NULL, 'Renter', 'Active'),
('datttse172775@fpt.edu.vn', '$2a$16$i1qpiIFTr67AljIEU9rU3e4SqlVqzM5LdJDbo4afduGbxCHib2HTK', '0987568756', N'Trần Thành Đạt SE172775', NULL, 'Renter', 'Active'),
('staff1@example.com',  '$2a$16$i1qpiIFTr67AljIEU9rU3e4SqlVqzM5LdJDbo4afduGbxCHib2HTK', NULL, N'Staff 1', NULL, 'Staff',  'Active'),
('staff2@example.com',  '$2a$16$i1qpiIFTr67AljIEU9rU3e4SqlVqzM5LdJDbo4afduGbxCHib2HTK', NULL, N'Staff 2', NULL, 'Staff',  'Active'),
('admin@example.com',   '$2a$16$i1qpiIFTr67AljIEU9rU3e4SqlVqzM5LdJDbo4afduGbxCHib2HTK', NULL, N'Admin EVRental', NULL, 'Admin', 'Active');


-- Insert renters linked to their accounts
INSERT INTO [Renter] ([AccountID], [Address], [DateOfBirth], [IdentityNumber], [FrontIdentityImageUrl], [BackIdentityImageUrl])
SELECT [AccountID], N'161/31, Lê Tấn Bê, An Lạc, Bình Tân, TP.HCM', '2003-11-04', '079203022692', NULL, NULL
FROM [Account] WHERE [Email] = 'jonnytran.working@gmail.com';

INSERT INTO [Renter] ([AccountID], [Address], [DateOfBirth], [IdentityNumber], [FrontIdentityImageUrl], [BackIdentityImageUrl])
SELECT [AccountID], N'141/11, Lê Tấn Bê, An Lạc, Bình Tân, TP.HCM', '2003-11-07', '079203022693', NULL, NULL
FROM [Account] WHERE [Email] = 'datttse172775@fpt.edu.vn';

select * from Account


-- Insert sample rental locations
INSERT INTO [RentalLocation] 
([Name], [Address], [City], [Country], [ContactNumber], [OpeningHours], [ClosingHours], [Latitude], [Longitude])
VALUES 
-- Trạm VinFast Đồng Khởi (Quận 1)
(N'Trạm Thuê Xe VinFast - Đồng Khởi, Quận 1', 
 N'Tầng 1, Tòa Nhà Vincom Center, 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 
 N'TP. Hồ Chí Minh', 
 N'Việt Nam', 
 '0905123456', 
 '07:00', 
 '21:00', 
 10.779783, 
 106.699018),

-- Trạm VinFast Phú Mỹ Hưng (Quận 7)
(N'Trạm Thuê Xe VinFast - Phú Mỹ Hưng, Quận 7', 
 N'1489 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh', 
 N'TP. Hồ Chí Minh', 
 N'Việt Nam', 
 '0905789456', 
 '07:00', 
 '21:00', 
 10.731903, 
 106.705150);

 select * from [RentalLocation]


 -- Insert sample staff
 -- Staff 1: thuộc Trạm VinFast Đồng Khởi (Quận 1)
INSERT INTO [Staff] ([AccountID], [RentalLocationID])
SELECT a.[AccountID], r.[RentalLocationID]
FROM [Account] a
JOIN [RentalLocation] r 
    ON r.[Name] = N'Trạm Thuê Xe VinFast - Đồng Khởi, Quận 1'
WHERE a.[Email] = 'staff1@example.com';


-- Staff 2: thuộc Trạm VinFast Phú Mỹ Hưng (Quận 7)
INSERT INTO [Staff] ([AccountID], [RentalLocationID])
SELECT a.[AccountID], r.[RentalLocationID]
FROM [Account] a
JOIN [RentalLocation] r 
    ON r.[Name] = N'Trạm Thuê Xe VinFast - Phú Mỹ Hưng, Quận 7'
WHERE a.[Email] = 'staff2@example.com';

 select * from [Staff]



-- Insert sample vehicle
-- ⚡ 7 xe máy điện tại Trạm VinFast Đồng Khởi (Quận 1)
INSERT INTO [Vehicle] 
([RentalLocationID], [LicensePlate], [Model], [Brand], [Year], [Mileage], [BatteryCapacity], [BatteryLevel], [ChargingCycles], [Color], [ImageUrl], [RentalRate], [LastServiceDate], [Status])
SELECT 
    r.[RentalLocationID],
    v.[LicensePlate],
    v.[Model],
    v.[Brand],
    v.[Year],
    v.[Mileage],
    v.[BatteryCapacity],
    v.[BatteryLevel],
    v.[ChargingCycles],
    v.[Color],
    NULL AS [ImageUrl],
    v.[RentalRate],
    v.[LastServiceDate],
    v.[Status]
FROM [RentalLocation] r
CROSS APPLY (VALUES
    ('59A1-001.11', N'Klara S', N'VinFast', 2023, 1200, 22, 95.0, 12, N'Đỏ', 120000, '2025-09-15', 'Available'),
    ('59A1-002.22', N'Klara A1', N'VinFast', 2023, 980, 20, 87.5, 10, N'Trắng', 115000, '2025-08-10', 'Available'),
    ('59A1-003.33', N'Feliz S', N'VinFast', 2024, 450, 35, 100.0, 4, N'Xanh dương', 130000, '2025-09-01', 'Available'),
    ('59A1-004.44', N'Evo 200 Lite', N'VinFast', 2024, 350, 28, 98.5, 2, N'Đen', 125000, '2025-09-01', 'Available'),
    ('59A1-005.55', N'Theon S', N'VinFast', 2024, 650, 49, 92.3, 6, N'Xám bạc', 150000, '2025-08-15', 'Available'),
    ('59A1-006.66', N'Vento S', N'VinFast', 2024, 820, 45, 85.7, 9, N'Đen nhám', 140000, '2025-07-25', 'Available'),
    ('59A1-007.77', N'Impes', N'VinFast', 2023, 1500, 20, 80.0, 15, N'Bạc', 110000, '2025-06-30', 'Available')
) AS v([LicensePlate], [Model], [Brand], [Year], [Mileage], [BatteryCapacity], [BatteryLevel], [ChargingCycles], [Color], [RentalRate], [LastServiceDate], [Status])
WHERE r.[Name] = N'Trạm Thuê Xe VinFast - Đồng Khởi, Quận 1';


-- 🚗 3 ô tô điện tại Trạm VinFast Phú Mỹ Hưng (Quận 7)
INSERT INTO [Vehicle] 
([RentalLocationID], [LicensePlate], [Model], [Brand], [Year], [Mileage], [BatteryCapacity], [BatteryLevel], [ChargingCycles], [Color], [ImageUrl], [RentalRate], [LastServiceDate], [Status])
SELECT 
    r.[RentalLocationID],
    v.[LicensePlate],
    v.[Model],
    v.[Brand],
    v.[Year],
    v.[Mileage],
    v.[BatteryCapacity],
    v.[BatteryLevel],
    v.[ChargingCycles],
    v.[Color],
    NULL AS [ImageUrl],
    v.[RentalRate],
    v.[LastServiceDate],
    v.[Status]
FROM [RentalLocation] r
CROSS APPLY (VALUES
    ('51H-888.88', N'VF e34', N'VinFast', 2023, 6200, 42, 92.0, 20, N'Trắng ngọc', 500000, '2025-09-05', 'Available'),
    ('51H-999.99', N'VF 5 Plus', N'VinFast', 2024, 3100, 47, 98.0, 8, N'Đỏ đô', 600000, '2025-09-10', 'Available'),
    ('51H-686.86', N'VF 6', N'VinFast', 2024, 2200, 59, 100.0, 4, N'Xanh lam', 750000, '2025-09-20', 'Available')
) AS v([LicensePlate], [Model], [Brand], [Year], [Mileage], [BatteryCapacity], [BatteryLevel], [ChargingCycles], [Color], [RentalRate], [LastServiceDate], [Status])
WHERE r.[Name] = N'Trạm Thuê Xe VinFast - Phú Mỹ Hưng, Quận 7';

select * from [Vehicle]


-- Insert sample booking
-- ======================================
-- 🧾 MOCK DATA FOR TABLE [Booking]
-- ======================================

DECLARE @Renter1 uniqueidentifier, @Renter2 uniqueidentifier;

-- 🔹 Lấy ID 2 renter mới
SELECT @Renter1 = [RenterID]
FROM [Renter] r 
JOIN [Account] a ON a.[AccountID] = r.[AccountID]
WHERE a.[Email] = 'jonnytran.working@gmail.com';

SELECT @Renter2 = [RenterID]
FROM [Renter] r 
JOIN [Account] a ON a.[AccountID] = r.[AccountID]
WHERE a.[Email] = 'datttse172775@fpt.edu.vn';

-- Kiểm tra thử có lấy được chưa
PRINT 'Renter1 ID: ' + CAST(@Renter1 AS nvarchar(50));
PRINT 'Renter2 ID: ' + CAST(@Renter2 AS nvarchar(50));


-- ⚙️ Insert 20 bookings with different statuses
INSERT INTO [Booking] ([RenterID], [VehicleID], [StartTime], [EndTime], [DepositAmount], [Status])
SELECT TOP 20
    CASE WHEN ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) % 2 = 1 THEN @Renter1 ELSE @Renter2 END AS [RenterID],
    v.[VehicleID],
    DATEADD(HOUR, ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) * 2, '2025-09-15T08:00:00') AS [StartTime],
    DATEADD(HOUR, ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) * 2 + 3, '2025-09-15T08:00:00') AS [EndTime],
    (100000 + (ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) * 10000)) AS [DepositAmount],
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) IN (1,2) THEN 'Confirmed'
        WHEN ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) IN (3,4) THEN 'Cancelled'
        WHEN ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) IN (5,6) THEN 'Expired'
        WHEN ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) IN (7,8) THEN 'Completed'
        ELSE 'Pending'
    END AS [Status]
FROM [Vehicle] v
ORDER BY v.[VehicleID];

-- ======================================
-- 🧾 THÊM 10 BOOKING MỚI (STATUS = Pending)
-- ======================================
-- 🔹 Insert 10 pending bookings (random between 2 renters)
INSERT INTO [Booking] ([RenterID], [VehicleID], [StartTime], [EndTime], [DepositAmount], [Status])
SELECT TOP 10
    CASE WHEN ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) % 2 = 1 THEN @Renter1 ELSE @Renter2 END AS [RenterID],
    v.[VehicleID],
    DATEADD(HOUR, ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) * 4, '2025-10-02T09:00:00') AS [StartTime],
    DATEADD(HOUR, ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) * 4 + 2, '2025-10-02T09:00:00') AS [EndTime],
    (150000 + (ROW_NUMBER() OVER (ORDER BY v.[VehicleID]) * 15000)) AS [DepositAmount],
    'Pending' AS [Status]
FROM [Vehicle] v
ORDER BY v.[VehicleID];


select * from [Booking]
