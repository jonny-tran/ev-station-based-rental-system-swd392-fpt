CREATE DATABASE FA25_SWD392_SE1849_G5_EVRental
USE FA25_SWD392_SE1849_G5_EVRental
GO
-----------------------
CREATE TABLE [Account] (
  [AccountID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [Email] nvarchar(255) UNIQUE NOT NULL,
  [PasswordHash] nvarchar(255) NOT NULL,
  [PhoneNumber] nvarchar(20),
  [FullName] nvarchar(120) NOT NULL,
  [AvatarUrl] nvarchar(255),
  [Role] nvarchar(255) NOT NULL CHECK ([Role] IN ('Renter', 'Staff', 'Admin')),
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Active', 'Inactive', 'Locked', 'Pending')) DEFAULT 'Pending',
  [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [UpdatedAt] datetime2 NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [Renter] (
  [RenterID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [AccountID] uniqueidentifier UNIQUE NOT NULL,
  [Address] nvarchar(255),
  [DateOfBirth] date,
  [IdentityNumber] nvarchar(20),
  [FrontIdentityImageUrl] nvarchar(255),
  [BackIdentityImageUrl] nvarchar(255)
)
GO

CREATE TABLE [RentalLocation] (
  [RentalLocationID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [Name] nvarchar(120) NOT NULL,
  [Address] nvarchar(255) NOT NULL,
  [City] nvarchar(80) NOT NULL,
  [Country] nvarchar(80) NOT NULL,
  [ContactNumber] nvarchar(20),
  [OpeningHours] nvarchar(100),
  [ClosingHours] nvarchar(100),
  [Latitude] decimal(10,6),
  [Longitude] decimal(10,6)
)
GO

CREATE TABLE [Staff] (
  [StaffID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [AccountID] uniqueidentifier UNIQUE NOT NULL,
  [RentalLocationID] uniqueidentifier NOT NULL
)
GO

CREATE TABLE [Vehicle] (
  [VehicleID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [RentalLocationID] uniqueidentifier NOT NULL,
  [LicensePlate] nvarchar(20) UNIQUE NOT NULL,
  [Model] nvarchar(120) NOT NULL,
  [Brand] nvarchar(120) NOT NULL,
  [Year] smallint,
  [Mileage] int NOT NULL DEFAULT (0),
  [BatteryCapacity] int,
  [BatteryLevel] decimal(5,2),
  [ChargingCycles] int,
  [Color] nvarchar(50),
  [ImageUrl] nvarchar(255),
  [RentalRate] decimal(10,2),
  [LastServiceDate] datetime2,
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Available', 'Rented', 'Maintenance', 'Charging')) DEFAULT 'Available'
)
GO

CREATE TABLE [Booking] (
  [BookingID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [RenterID] uniqueidentifier NOT NULL,
  [VehicleID] uniqueidentifier NOT NULL,
  [StartTime] datetime2 NOT NULL,
  [EndTime] datetime2 NOT NULL,
  [DepositAmount] decimal(10,2) NOT NULL DEFAULT (0),
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Pending', 'Confirmed', 'Cancelled', 'Expired', 'Completed')) DEFAULT 'Pending',
  [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [CancelledAt] datetime2
)
GO

CREATE TABLE [ContractDatTT] (
  [ContractDatTTID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [BookingID] uniqueidentifier UNIQUE NOT NULL,
  [TermsAndConditions] nvarchar(max),
  [StartDate] datetime2 NOT NULL,
  [EndDate] datetime2 NOT NULL,
  [SignedAt] datetime2,
  [SignedByRenter] bit NOT NULL DEFAULT (0),
  [SignedByStaff] bit NOT NULL DEFAULT (0),
  [ContractPdfUrl] nvarchar(255),
  [VoidedAt] datetime2,
  [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [UpdatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Draft', 'Active', 'Completed', 'Terminated', 'Voided')) DEFAULT 'Active',
  [StatusReason] nvarchar(255)
)
GO

CREATE TABLE [ContractSignature] (
  [ContractSignatureID] bigint PRIMARY KEY IDENTITY(1, 1),
  [ContractDatTTID] uniqueidentifier NOT NULL,
  [SignedBy] nvarchar(50),
  [SignatureUrl] nvarchar(255),
  [SignedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [SignatureType] nvarchar(50)
)
GO

CREATE TABLE [DriverLicense] (
  [LicenseID] bigint PRIMARY KEY IDENTITY(1, 1),
  [RenterID] uniqueidentifier NOT NULL,
  [LicenseNumber] nvarchar(50) NOT NULL,
  [IssuedDate] date NOT NULL,
  [ExpiryDate] date NOT NULL,
  [LicenseType] nvarchar(255) NOT NULL CHECK ([LicenseType] IN ('Car', 'Motorcycle')),
  [LicenseImageUrl] nvarchar(250),
  [IssuedBy] nvarchar(120),
  [VerifiedStatus] nvarchar(255) NOT NULL CHECK ([VerifiedStatus] IN ('Pending', 'Verified', 'Rejected')) DEFAULT 'Pending',
  [VerifiedAt] datetime2
)
GO

CREATE TABLE [BookingHistory] (
  [bookingHistoryID] bigint PRIMARY KEY IDENTITY(1, 1),
  [BookingID] uniqueidentifier NOT NULL,
  [Action] nvarchar(20) NOT NULL,
  [ActionDateTime] datetime2 NOT NULL DEFAULT (GETDATE()),
  [PerformedBy] nvarchar(255) NOT NULL CHECK ([PerformedBy] IN ('Staff', 'Renter')),
  [Description] nvarchar(255)
)
GO

CREATE TABLE [VehicleInspectionDatTT] (
  [InspectionDatTTID] bigint PRIMARY KEY IDENTITY(1, 1),
  [StaffID] uniqueidentifier NOT NULL,
  [BookingID] uniqueidentifier NOT NULL,
  [InspectionType] nvarchar(255) NOT NULL CHECK ([InspectionType] IN ('check_in', 'check_out')),
  [InspectionDateTime] datetime2 NOT NULL DEFAULT (GETDATE()),
  [VehicleConditionNotes] nvarchar(max),
  [OdometerReading] int,
  [BatteryLevel] decimal(5,2),
  [DamageNotes] nvarchar(max),
  [PhotoUrls] nvarchar(max),
  [CurrentStep] tinyint,
  [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [UpdatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Pending', 'Approved', 'Completed', 'Rejected')) DEFAULT 'Pending',
  [SubStatus] nvarchar(50),
  [RejectedReason] nvarchar(255)
)
GO

CREATE TABLE [Payment] (
  [PaymentID] bigint PRIMARY KEY IDENTITY(1, 1),
  [ContractDatTTID] uniqueidentifier NOT NULL,
  [Amount] decimal(10,2) NOT NULL,
  [Currency] nvarchar(3) NOT NULL DEFAULT 'VND',
  [PaymentType] nvarchar(50) NOT NULL,
  [TransactionID] nvarchar(100),
  [RefundTransactionID] nvarchar(100),
  [ReceiptUrl] nvarchar(255),
  [PaymentDate] datetime2 NOT NULL DEFAULT (GETDATE()),
  [PaymentMethod] nvarchar(255) NOT NULL CHECK ([PaymentMethod] IN ('VNPay', 'Cash')),
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Paid', 'Pending', 'Refund', 'Failed', 'Refunded')) DEFAULT 'Pending'
)
GO

CREATE TABLE [Reports] (
  [ReportID] bigint PRIMARY KEY IDENTITY(1, 1),
  [ReportType] nvarchar(255) NOT NULL CHECK ([ReportType] IN ('Incident', 'Renter', 'Handover')),
  [RenterID] uniqueidentifier,
  [StaffID] uniqueidentifier NOT NULL,
  [VehicleID] uniqueidentifier,
  [ReportDetails] nvarchar(max),
  [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
  [ResolvedAt] datetime2,
  [Status] nvarchar(255) NOT NULL CHECK ([Status] IN ('Open', 'Closed', 'Pending')) DEFAULT 'Open'
)
GO

CREATE INDEX [Staff_index_0] ON [Staff] ("RentalLocationID")
GO

CREATE INDEX [Vehicle_index_1] ON [Vehicle] ("RentalLocationID")
GO

CREATE INDEX [Vehicle_index_2] ON [Vehicle] ("Status")
GO

CREATE INDEX [Booking_index_3] ON [Booking] ("RenterID")
GO

CREATE INDEX [Booking_index_4] ON [Booking] ("VehicleID")
GO

CREATE INDEX [Booking_index_5] ON [Booking] ("StartTime", "EndTime")
GO

CREATE INDEX [ix_booking_overlap] ON [Booking] ("VehicleID", "StartTime", "EndTime")
GO

CREATE UNIQUE INDEX [ux_renter_license_type] ON [DriverLicense] ("RenterID", "LicenseType")
GO

CREATE UNIQUE INDEX [ux_license_number] ON [DriverLicense] ("LicenseNumber")
GO

CREATE INDEX [BookingHistory_index_9] ON [BookingHistory] ("BookingID")
GO

CREATE INDEX [BookingHistory_index_10] ON [BookingHistory] ("ActionDateTime")
GO

CREATE INDEX [VehicleInspection_index_11] ON [VehicleInspectionDatTT] ("BookingID")
GO

CREATE INDEX [VehicleInspection_index_12] ON [VehicleInspectionDatTT] ("StaffID")
GO

CREATE UNIQUE INDEX [ux_contract_type] ON [VehicleInspectionDatTT] ("BookingID", "InspectionType")
GO

CREATE INDEX [Payment_index_14] ON [Payment] ("ContractDatTTID")
GO

CREATE INDEX [Payment_index_15] ON [Payment] ("ContractDatTTID", "PaymentDate")
GO

CREATE INDEX [Payment_index_16] ON [Payment] ("TransactionID")
GO

CREATE INDEX [Reports_index_17] ON [Reports] ("StaffID")
GO

CREATE INDEX [Reports_index_18] ON [Reports] ("RenterID")
GO

CREATE INDEX [Reports_index_19] ON [Reports] ("VehicleID")
GO

CREATE INDEX [Reports_index_20] ON [Reports] ("ReportType", "Status")
GO

---------------------
ALTER TABLE [Renter] ADD FOREIGN KEY ([AccountID]) REFERENCES [Account] ([AccountID])
GO

ALTER TABLE [Staff] ADD FOREIGN KEY ([AccountID]) REFERENCES [Account] ([AccountID])
GO

ALTER TABLE [DriverLicense] ADD FOREIGN KEY ([RenterID]) REFERENCES [Renter] ([RenterID]) ON DELETE CASCADE
GO

ALTER TABLE [Booking] ADD FOREIGN KEY ([RenterID]) REFERENCES [Renter] ([RenterID])
GO

ALTER TABLE [Reports] ADD FOREIGN KEY ([RenterID]) REFERENCES [Renter] ([RenterID]) ON DELETE SET NULL
GO

ALTER TABLE [Staff] ADD FOREIGN KEY ([RentalLocationID]) REFERENCES [RentalLocation] ([RentalLocationID])
GO

ALTER TABLE [Vehicle] ADD FOREIGN KEY ([RentalLocationID]) REFERENCES [RentalLocation] ([RentalLocationID])
GO

ALTER TABLE [Booking] ADD FOREIGN KEY ([VehicleID]) REFERENCES [Vehicle] ([VehicleID])
GO

ALTER TABLE [Reports] ADD FOREIGN KEY ([VehicleID]) REFERENCES [Vehicle] ([VehicleID]) ON DELETE SET NULL
GO

ALTER TABLE [BookingHistory] ADD FOREIGN KEY ([BookingID]) REFERENCES [Booking] ([BookingID]) ON DELETE CASCADE
GO

ALTER TABLE [ContractDatTT] ADD FOREIGN KEY ([BookingID]) REFERENCES [Booking] ([BookingID]) ON DELETE CASCADE
GO

ALTER TABLE [ContractSignature] ADD FOREIGN KEY ([ContractDatTTID]) REFERENCES [ContractDatTT] ([ContractDatTTID])
GO

ALTER TABLE [VehicleInspectionDatTT] ADD FOREIGN KEY ([BookingID]) REFERENCES [Booking] ([BookingID]) ON DELETE CASCADE
GO

ALTER TABLE [VehicleInspectionDatTT] ADD FOREIGN KEY ([StaffID]) REFERENCES [Staff] ([StaffID])
GO

ALTER TABLE [Payment] ADD FOREIGN KEY ([ContractDatTTID]) REFERENCES [ContractDatTT] ([ContractDatTTID]) ON DELETE CASCADE
GO

ALTER TABLE [Reports] ADD FOREIGN KEY ([StaffID]) REFERENCES [Staff] ([StaffID])
GO