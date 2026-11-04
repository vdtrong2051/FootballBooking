using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace FootballBooking.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMySql : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FullName = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                    AccountStatus = table.Column<int>(type: "int", nullable: false),
                    BaseSalary = table.Column<long>(type: "bigint", nullable: false),
                    HourlyRate = table.Column<long>(type: "bigint", nullable: false),
                    StandardHoursPerMonth = table.Column<int>(type: "int", nullable: false),
                    CommissionPercent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    LastLoginAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true),
                    SecurityStamp = table.Column<string>(type: "longtext", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Fields",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Code = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                    Slug = table.Column<string>(type: "varchar(160)", maxLength: 160, nullable: false),
                    FieldType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true),
                    Address = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: true),
                    AmenitiesJson = table.Column<string>(type: "json", nullable: true),
                    MinimumBookingMinutes = table.Column<int>(type: "int", nullable: false),
                    SlotStepMinutes = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fields", x => x.Id);
                    table.CheckConstraint("CK_Fields_MinimumBookingMinutes_Positive", "MinimumBookingMinutes > 0");
                    table.CheckConstraint("CK_Fields_SlotStepMinutes_Positive", "SlotStepMinutes > 0");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PromoCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    DiscountType = table.Column<int>(type: "int", nullable: false),
                    DiscountValue = table.Column<long>(type: "bigint", nullable: false),
                    MaximumDiscountAmount = table.Column<long>(type: "bigint", nullable: true),
                    MinimumOrderAmount = table.Column<long>(type: "bigint", nullable: false),
                    StartsAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    EndsAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    TotalUsageLimit = table.Column<int>(type: "int", nullable: true),
                    PerPhoneUsageLimit = table.Column<int>(type: "int", nullable: true),
                    ApplicableFieldId = table.Column<Guid>(type: "char(36)", nullable: true),
                    ApplicableStartMinute = table.Column<int>(type: "int", nullable: true),
                    ApplicableEndMinute = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromoCodes", x => x.Id);
                    table.CheckConstraint("CK_PromoCodes_Amounts", "MinimumOrderAmount >= 0 AND (MaximumDiscountAmount IS NULL OR MaximumDiscountAmount >= 0)");
                    table.CheckConstraint("CK_PromoCodes_DiscountValue", "DiscountValue > 0");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Code = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true),
                    UnitName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    UnitPrice = table.Column<long>(type: "bigint", nullable: false),
                    IsQuantityTracked = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AvailableQuantity = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                    table.CheckConstraint("CK_Services_AvailableQuantity", "AvailableQuantity IS NULL OR AvailableQuantity >= 0");
                    table.CheckConstraint("CK_Services_UnitPrice", "UnitPrice >= 0");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "varchar(255)", nullable: false),
                    ProviderKey = table.Column<string>(type: "varchar(255)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "longtext", nullable: true),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    RoleId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    LoginProvider = table.Column<string>(type: "varchar(255)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false),
                    Value = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FieldBlocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FieldId = table.Column<Guid>(type: "char(36)", nullable: false),
                    BlockDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartMinute = table.Column<int>(type: "int", nullable: false),
                    EndMinute = table.Column<int>(type: "int", nullable: false),
                    BlockType = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FieldBlocks", x => x.Id);
                    table.CheckConstraint("CK_FieldBlocks_Minutes", "StartMinute >= 0 AND StartMinute < EndMinute AND EndMinute <= 1440");
                    table.ForeignKey(
                        name: "FK_FieldBlocks_Fields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "Fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FieldImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FieldId = table.Column<Guid>(type: "char(36)", nullable: false),
                    StoragePath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    AltText = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsCover = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FieldImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FieldImages_Fields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "Fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FieldOperatingHours",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FieldId = table.Column<Guid>(type: "char(36)", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    IsClosed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OpenMinute = table.Column<int>(type: "int", nullable: true),
                    CloseMinute = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FieldOperatingHours", x => x.Id);
                    table.CheckConstraint("CK_FieldOperatingHours_DayOfWeek", "DayOfWeek >= 0 AND DayOfWeek <= 6");
                    table.CheckConstraint("CK_FieldOperatingHours_Minutes", "IsClosed = 1 OR (OpenMinute IS NOT NULL AND CloseMinute IS NOT NULL AND OpenMinute >= 0 AND OpenMinute < CloseMinute AND CloseMinute <= 1440)");
                    table.ForeignKey(
                        name: "FK_FieldOperatingHours_Fields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "Fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PricingRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FieldId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    RuleType = table.Column<int>(type: "int", nullable: false),
                    SpecificDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DayOfWeek = table.Column<int>(type: "int", nullable: true),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    StartMinute = table.Column<int>(type: "int", nullable: false),
                    EndMinute = table.Column<int>(type: "int", nullable: false),
                    PricePerHour = table.Column<long>(type: "bigint", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingRules", x => x.Id);
                    table.CheckConstraint("CK_PricingRules_EffectiveTo", "EffectiveTo IS NULL OR EffectiveTo >= EffectiveFrom");
                    table.CheckConstraint("CK_PricingRules_Minutes", "StartMinute >= 0 AND StartMinute < EndMinute AND EndMinute <= 1440");
                    table.CheckConstraint("CK_PricingRules_Price", "PricePerHour >= 0");
                    table.ForeignKey(
                        name: "FK_PricingRules_Fields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "Fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    BookingCode = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    FieldId = table.Column<Guid>(type: "char(36)", nullable: false),
                    BookingDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartMinute = table.Column<int>(type: "int", nullable: false),
                    EndMinute = table.Column<int>(type: "int", nullable: false),
                    CustomerName = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                    CustomerPhone = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    CustomerPhoneNormalized = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    CustomerEmail = table.Column<string>(type: "varchar(180)", maxLength: 180, nullable: true),
                    CustomerUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                    Source = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    PaymentStatus = table.Column<int>(type: "int", nullable: false),
                    CourtAmount = table.Column<long>(type: "bigint", nullable: false),
                    ServiceAmount = table.Column<long>(type: "bigint", nullable: false),
                    DiscountAmount = table.Column<long>(type: "bigint", nullable: false),
                    CancellationFeeAmount = table.Column<long>(type: "bigint", nullable: false),
                    RefundedAmount = table.Column<long>(type: "bigint", nullable: false),
                    TotalAmount = table.Column<long>(type: "bigint", nullable: false),
                    PaidAmount = table.Column<long>(type: "bigint", nullable: false),
                    PromoCodeId = table.Column<Guid>(type: "char(36)", nullable: true),
                    PromoCodeSnapshot = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    ExpiresAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    CancelledAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    CancellationReason = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.CheckConstraint("CK_Bookings_Amounts", "CourtAmount >= 0 AND ServiceAmount >= 0 AND DiscountAmount >= 0 AND TotalAmount >= 0 AND PaidAmount >= 0 AND RefundedAmount >= 0");
                    table.CheckConstraint("CK_Bookings_Minutes", "StartMinute >= 0 AND StartMinute < EndMinute AND EndMinute <= 1440");
                    table.ForeignKey(
                        name: "FK_Bookings_Fields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "Fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bookings_PromoCodes_PromoCodeId",
                        column: x => x.PromoCodeId,
                        principalTable: "PromoCodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BookingServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    BookingId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ServiceId = table.Column<Guid>(type: "char(36)", nullable: true),
                    ServiceCodeSnapshot = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    ServiceNameSnapshot = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                    UnitNameSnapshot = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    UnitPrice = table.Column<long>(type: "bigint", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    LineTotal = table.Column<long>(type: "bigint", nullable: false),
                    AddedByUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingServices", x => x.Id);
                    table.CheckConstraint("CK_BookingServices_Amounts", "UnitPrice >= 0 AND LineTotal >= 0");
                    table.CheckConstraint("CK_BookingServices_Quantity", "Quantity > 0");
                    table.ForeignKey(
                        name: "FK_BookingServices_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingServices_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    BookingId = table.Column<Guid>(type: "char(36)", nullable: false),
                    PaymentType = table.Column<int>(type: "int", nullable: false),
                    Method = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TransactionCode = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    EvidencePath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    RecordedByUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                    ProcessedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.CheckConstraint("CK_Payments_Amount", "Amount > 0");
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PromoCodeUsages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    PromoCodeId = table.Column<Guid>(type: "char(36)", nullable: false),
                    BookingId = table.Column<Guid>(type: "char(36)", nullable: false),
                    CustomerPhoneNormalized = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    DiscountAmount = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromoCodeUsages", x => x.Id);
                    table.CheckConstraint("CK_PromoCodeUsages_DiscountAmount", "DiscountAmount >= 0");
                    table.ForeignKey(
                        name: "FK_PromoCodeUsages_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromoCodeUsages_PromoCodes_PromoCodeId",
                        column: x => x.PromoCodeId,
                        principalTable: "PromoCodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_BookingCode",
                table: "Bookings",
                column: "BookingCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CustomerPhoneNormalized_BookingCode",
                table: "Bookings",
                columns: new[] { "CustomerPhoneNormalized", "BookingCode" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_FieldId_BookingDate_StartMinute_EndMinute",
                table: "Bookings",
                columns: new[] { "FieldId", "BookingDate", "StartMinute", "EndMinute" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_PromoCodeId",
                table: "Bookings",
                column: "PromoCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_BookingId",
                table: "BookingServices",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_ServiceId",
                table: "BookingServices",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_FieldBlocks_FieldId_BlockDate_StartMinute_EndMinute",
                table: "FieldBlocks",
                columns: new[] { "FieldId", "BlockDate", "StartMinute", "EndMinute" });

            migrationBuilder.CreateIndex(
                name: "IX_FieldImages_FieldId_SortOrder",
                table: "FieldImages",
                columns: new[] { "FieldId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_FieldOperatingHours_FieldId_DayOfWeek",
                table: "FieldOperatingHours",
                columns: new[] { "FieldId", "DayOfWeek" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Fields_Code",
                table: "Fields",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Fields_Slug",
                table: "Fields",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingId_Status",
                table: "Payments",
                columns: new[] { "BookingId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CreatedAtUtc",
                table: "Payments",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_TransactionCode",
                table: "Payments",
                column: "TransactionCode");

            migrationBuilder.CreateIndex(
                name: "IX_PricingRules_FieldId_DayOfWeek_StartMinute_EndMinute",
                table: "PricingRules",
                columns: new[] { "FieldId", "DayOfWeek", "StartMinute", "EndMinute" });

            migrationBuilder.CreateIndex(
                name: "IX_PricingRules_FieldId_EffectiveFrom_EffectiveTo_IsActive",
                table: "PricingRules",
                columns: new[] { "FieldId", "EffectiveFrom", "EffectiveTo", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_PricingRules_FieldId_SpecificDate",
                table: "PricingRules",
                columns: new[] { "FieldId", "SpecificDate" });

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodes_Code",
                table: "PromoCodes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodes_IsActive_StartsAtUtc_EndsAtUtc",
                table: "PromoCodes",
                columns: new[] { "IsActive", "StartsAtUtc", "EndsAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodeUsages_BookingId",
                table: "PromoCodeUsages",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodeUsages_PromoCodeId_CustomerPhoneNormalized",
                table: "PromoCodeUsages",
                columns: new[] { "PromoCodeId", "CustomerPhoneNormalized" });

            migrationBuilder.CreateIndex(
                name: "IX_Services_Code",
                table: "Services",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Services_IsActive_SortOrder",
                table: "Services",
                columns: new[] { "IsActive", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "BookingServices");

            migrationBuilder.DropTable(
                name: "FieldBlocks");

            migrationBuilder.DropTable(
                name: "FieldImages");

            migrationBuilder.DropTable(
                name: "FieldOperatingHours");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PricingRules");

            migrationBuilder.DropTable(
                name: "PromoCodeUsages");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Fields");

            migrationBuilder.DropTable(
                name: "PromoCodes");
        }
    }
}
