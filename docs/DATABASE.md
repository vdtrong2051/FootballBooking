# DATABASE DESIGN

## 1. Tổng quan

- Database engine: MySQL 8.4+.
- ORM: Entity Framework Core 10 với Pomelo provider.
- Identity: ASP.NET Core Identity với khóa `Guid`.
- Migrations: lưu trong `FootballBooking.Infrastructure`.
- Tiền: `long` theo VND.
- Audit timestamp: UTC.
- Booking schedule: `DateOnly + StartMinute + EndMinute`.

JSON không thay MySQL.

---

## 2. Quy ước chung

### 2.1. Khóa

- Primary key: `Guid`.
- Identity user/role key: `Guid`.
- BookingCode và PromoCode là khóa nghiệp vụ riêng, không thay primary key.

### 2.2. Timestamp

Entity cần theo dõi thay đổi dùng:

```text
CreatedAtUtc
UpdatedAtUtc
```

Soft-deactivation dùng `Status` hoặc `IsActive`, không mặc định dùng `IsDeleted` cho mọi bảng.

### 2.3. Chuỗi

Đặt giới hạn độ dài rõ ràng để tránh TEXT không kiểm soát và giúp migration sang database server.

### 2.4. Phone

Lưu:

- `CustomerPhone`: snapshot hiển thị.
- `CustomerPhoneNormalized`: chỉ số hóa phục vụ tìm kiếm/giới hạn promo.

Không dùng phone làm primary key.

---

## 3. Identity tables

ASP.NET Core Identity tạo:

- `AspNetUsers`
- `AspNetRoles`
- `AspNetUserRoles`
- `AspNetUserClaims`
- `AspNetRoleClaims`
- `AspNetUserLogins`
- `AspNetUserTokens`

### 3.1. ApplicationUser

Mở rộng `IdentityUser<Guid>`:

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| Id | Guid | Có | Identity key |
| FullName | string(120) | Có | Tên hiển thị |
| AccountStatus | enum/int | Có | Active, Locked, Inactive |
| LastLoginAtUtc | DateTimeOffset? | Không | Lần đăng nhập cuối |
| CreatedAtUtc | DateTimeOffset | Có | Tạo tài khoản |
| UpdatedAtUtc | DateTimeOffset | Có | Cập nhật |

Role kỹ thuật:

- Customer
- Owner
- Staff

Guest không có row trong bảng user.

---

## 4. Fields

### 4.1. Fields

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| Id | Guid | Có | PK |
| Code | string(30) | Có | Unique |
| Name | string(120) | Có | Tên sân |
| Slug | string(160) | Có | Unique public URL |
| FieldType | string(50) | Có | Ví dụ 5 người, 7 người |
| Capacity | int? | Không | Sức chứa |
| Description | string(2000)? | Không | Mô tả |
| Address | string(300)? | Không | Địa chỉ |
| AmenitiesJson | string? | Không | Danh sách tiện ích đơn giản; không dùng cho nghiệp vụ quan hệ |
| MinimumBookingMinutes | int | Có | Mặc định 60 |
| SlotStepMinutes | int | Có | Mặc định 30 |
| Status | enum/int | Có | Active, TemporarilyClosed, Maintenance, Inactive |
| CreatedAtUtc | DateTimeOffset | Có |  |
| UpdatedAtUtc | DateTimeOffset | Có |  |

Constraints:

- Code unique.
- Slug unique.
- MinimumBookingMinutes > 0.
- SlotStepMinutes > 0.

Không cascade delete từ Field đến Booking.

### 4.2. FieldImages

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| FieldId | Guid | Có |
| StoragePath | string(500) | Có |
| AltText | string(200)? | Không |
| SortOrder | int | Có |
| IsCover | bool | Có |
| CreatedAtUtc | DateTimeOffset | Có |

Delete behavior:

- Có thể cascade khi Field chưa có history và được xóa trong giai đoạn seed.
- Trong nghiệp vụ thật, Field không hard-delete; image được xóa riêng và file storage xử lý an toàn.

### 4.3. FieldOperatingHours

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| Id | Guid | Có | PK |
| FieldId | Guid | Có | FK |
| DayOfWeek | int | Có | 0–6 |
| IsClosed | bool | Có | Ngày đóng cửa |
| OpenMinute | int? | Tùy | Null khi đóng |
| CloseMinute | int? | Tùy | Null khi đóng |

Unique:

```text
FieldId + DayOfWeek
```

Validation:

```text
0 <= OpenMinute < CloseMinute <= 1440
```

### 4.4. FieldBlocks

Phiên bản đầu lưu một row cho một ngày và khoảng phút. Một lịch nhiều ngày được Application service mở rộng thành nhiều row.

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| FieldId | Guid | Có |
| BlockDate | DateOnly | Có |
| StartMinute | int | Có |
| EndMinute | int | Có |
| BlockType | enum/int | Có |
| Reason | string(500) | Có |
| CreatedByUserId | Guid | Có |
| CreatedAtUtc | DateTimeOffset | Có |

Index:

```text
FieldId + BlockDate + StartMinute + EndMinute
```

---

## 5. Pricing

### 5.1. PricingRules

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| Id | Guid | Có | PK |
| FieldId | Guid | Có | FK |
| Name | string(150) | Có | Tên rule |
| RuleType | enum/int | Có | Weekday, Weekend, Holiday, SpecificDate, SpecialRange |
| SpecificDate | DateOnly? | Không | Rule ngày cụ thể |
| DayOfWeek | int? | Không | Rule theo thứ |
| EffectiveFrom | DateOnly | Có | Bắt đầu hiệu lực |
| EffectiveTo | DateOnly? | Không | Không giới hạn nếu null |
| StartMinute | int | Có | Khung giá |
| EndMinute | int | Có | Khung giá |
| PricePerHour | long | Có | VND |
| Priority | int | Có | Số lớn ưu tiên cao |
| IsActive | bool | Có |  |
| CreatedAtUtc | DateTimeOffset | Có |  |
| UpdatedAtUtc | DateTimeOffset | Có |  |

Validation:

- PricePerHour >= 0.
- 0 <= StartMinute < EndMinute <= 1440.
- EffectiveTo null hoặc >= EffectiveFrom.

Index:

```text
FieldId + EffectiveFrom + EffectiveTo + IsActive
FieldId + SpecificDate
FieldId + DayOfWeek + StartMinute + EndMinute
```

Rule overlap được phép nếu Priority phân biệt rõ; PricingService phải phát hiện trường hợp cùng priority gây mơ hồ và báo cấu hình lỗi.

---

## 6. Services

### 6.1. Services

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| Code | string(30) | Có, unique |
| Name | string(120) | Có |
| Description | string(1000)? | Không |
| UnitName | string(50) | Có |
| UnitPrice | long | Có |
| IsQuantityTracked | bool | Có |
| AvailableQuantity | int? | Không |
| IsActive | bool | Có |
| CreatedAtUtc | DateTimeOffset | Có |
| UpdatedAtUtc | DateTimeOffset | Có |

Phiên bản đầu có thể không làm inventory transaction đầy đủ. Nếu IsQuantityTracked, chỉ validate số lượng hiện tại theo scope MVP.

---

## 7. Bookings

### 7.1. Bookings

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| Id | Guid | Có | PK |
| BookingCode | string(30) | Có | Unique, không đoán tuần tự dễ dàng |
| CustomerUserId | Guid? | Không | Null cho guest |
| CustomerName | string(120) | Có | Snapshot |
| CustomerPhone | string(30) | Có | Snapshot |
| CustomerPhoneNormalized | string(30) | Có | Search |
| CustomerEmail | string(254)? | Không | Snapshot |
| FieldId | Guid | Có | FK |
| BookingDate | DateOnly | Có | Ngày địa phương |
| StartMinute | int | Có | 0–1440 |
| EndMinute | int | Có | 0–1440 |
| CourtAmount | long | Có | Snapshot |
| ServiceAmount | long | Có | Snapshot |
| DiscountAmount | long | Có | Snapshot |
| CancellationFeeAmount | long | Có | Mặc định 0 |
| TotalAmount | long | Có | Tổng phải trả |
| PaidAmount | long | Có | Denormalized, cập nhật từ payment hợp lệ |
| RefundedAmount | long | Có | Denormalized |
| BookingStatus | enum/int | Có |  |
| PaymentStatus | enum/int | Có |  |
| BookingSource | enum/int | Có |  |
| PromoCodeId | Guid? | Không | Promo áp dụng |
| PromoCodeSnapshot | string(50)? | Không |  |
| CreatedByUserId | Guid? | Không | Staff/Owner nếu tạo hộ |
| ExpiresAtUtc | DateTimeOffset? | Không | Pending hold |
| CancelledAtUtc | DateTimeOffset? | Không |  |
| CancellationReason | string(500)? | Không |  |
| Notes | string(1000)? | Không |  |
| Version | long | Có | Optimistic version do app tăng |
| CreatedAtUtc | DateTimeOffset | Có |  |
| UpdatedAtUtc | DateTimeOffset | Có |  |

Constraints:

- BookingCode unique.
- StartMinute < EndMinute.
- Amounts >= 0.
- TotalAmount = max(0, CourtAmount + ServiceAmount - DiscountAmount + CancellationFeeAmount) theo nghiệp vụ hiện hành.

Indexes:

```text
UNIQUE BookingCode
FieldId + BookingDate + BookingStatus + StartMinute + EndMinute
CustomerPhoneNormalized + BookingDate
CustomerUserId + BookingDate
BookingStatus + ExpiresAtUtc
PaymentStatus + BookingDate
CreatedAtUtc
```

Không cascade delete:

- Field → Booking: Restrict.
- User → Booking: SetNull hoặc Restrict tùy relation; snapshot giữ lịch sử.
- PromoCode → Booking: SetNull, snapshot giữ mã.

### 7.2. BookingServices

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| BookingId | Guid | Có |
| ServiceId | Guid? | Không |
| ServiceCodeSnapshot | string(30) | Có |
| ServiceNameSnapshot | string(120) | Có |
| UnitNameSnapshot | string(50) | Có |
| UnitPrice | long | Có |
| Quantity | int | Có |
| LineTotal | long | Có |
| AddedByUserId | Guid? | Không |
| CreatedAtUtc | DateTimeOffset | Có |

ServiceId nullable để vẫn giữ line nếu service sau này ngừng hoặc không còn tham chiếu.

---

## 8. Payments

### 8.1. Payments

Một row là một giao dịch hoặc điều chỉnh tài chính.

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| BookingId | Guid | Có |
| PaymentType | enum/int | Có | Payment, Refund |
| Method | enum/int | Có | Cash, BankTransfer, Online, Other |
| Amount | long | Có | Số dương |
| Status | enum/int | Có | Pending, Succeeded, Failed, Cancelled |
| TransactionCode | string(100)? | Không |
| Note | string(500)? | Không |
| EvidencePath | string(500)? | Không |
| RecordedByUserId | Guid? | Không |
| ProcessedAtUtc | DateTimeOffset? | Không |
| CreatedAtUtc | DateTimeOffset | Có |

Indexes:

```text
BookingId + Status
TransactionCode
CreatedAtUtc
```

Không sửa lịch sử giao dịch thành công tùy ý. Điều chỉnh bằng giao dịch bổ sung hoặc workflow phù hợp.

---

## 9. Promotions

### 9.1. PromoCodes

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| Code | string(50) | Có, unique |
| Name | string(150) | Có |
| DiscountType | enum/int | Có | Percentage, FixedAmount |
| DiscountValue | long/int | Có | Quy ước rõ trong code |
| MaximumDiscountAmount | long? | Không |
| MinimumOrderAmount | long | Có |
| StartsAtUtc | DateTimeOffset | Có |
| EndsAtUtc | DateTimeOffset | Có |
| TotalUsageLimit | int? | Không |
| PerPhoneUsageLimit | int? | Không |
| ApplicableFieldId | Guid? | Không |
| ApplicableStartMinute | int? | Không |
| ApplicableEndMinute | int? | Không |
| IsActive | bool | Có |
| CreatedAtUtc | DateTimeOffset | Có |
| UpdatedAtUtc | DateTimeOffset | Có |

Percentage nên lưu basis points hoặc integer percent thống nhất. Đề xuất:

```text
DiscountValue = 1500 nghĩa là 15.00%
```

### 9.2. PromoCodeUsages

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| PromoCodeId | Guid | Có |
| BookingId | Guid | Có, unique |
| CustomerUserId | Guid? | Không |
| CustomerPhoneNormalized | string(30) | Có |
| DiscountAmount | long | Có |
| UsedAtUtc | DateTimeOffset | Có |

Indexes:

```text
PromoCodeId + UsedAtUtc
PromoCodeId + CustomerPhoneNormalized
UNIQUE BookingId
```

---

## 10. Notifications

### 10.1. Notifications

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| BookingId | Guid? | Không |
| CustomerUserId | Guid? | Không |
| Channel | enum/int | Có | InApp, Email, Sms, Zalo |
| Recipient | string(254) | Có |
| TemplateKey | string(100) | Có |
| Subject | string(200)? | Không |
| Body | string | Có |
| Status | enum/int | Có | Pending, Sent, Failed |
| RetryCount | int | Có |
| LastError | string(1000)? | Không |
| ScheduledAtUtc | DateTimeOffset? | Không |
| SentAtUtc | DateTimeOffset? | Không |
| CreatedAtUtc | DateTimeOffset | Có |

Phiên bản đầu có thể xử lý đồng bộ hoặc background service đơn giản, không cần message broker.

---

## 11. Reviews

### 11.1. Reviews

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| BookingId | Guid | Có, unique |
| FieldId | Guid | Có |
| CustomerUserId | Guid? | Không |
| Rating | int | Có | 1–5 |
| Comment | string(2000)? | Không |
| IsVisible | bool | Có |
| CreatedAtUtc | DateTimeOffset | Có |

Chỉ Completed booking được review.

---

## 12. OTP

### 12.1. OtpCodes

Không lưu OTP plaintext.

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| Purpose | enum/int | Có |
| DestinationNormalized | string(254) | Có |
| CodeHash | string(500) | Có |
| ExpiresAtUtc | DateTimeOffset | Có |
| AttemptCount | int | Có |
| MaxAttempts | int | Có |
| ConsumedAtUtc | DateTimeOffset? | Không |
| CreatedAtUtc | DateTimeOffset | Có |

Index:

```text
DestinationNormalized + Purpose + ExpiresAtUtc
```

---

## 13. Activity logs

### 13.1. ActivityLogs

| Field | Type | Required |
|---|---|---:|
| Id | Guid | Có |
| ActorUserId | Guid? | Không |
| Action | string(120) | Có |
| EntityType | string(120) | Có |
| EntityId | string(100)? | Không |
| BeforeJson | string? | Không |
| AfterJson | string? | Không |
| IpAddress | string(64)? | Không |
| UserAgent | string(500)? | Không |
| CorrelationId | string(100)? | Không |
| CreatedAtUtc | DateTimeOffset | Có |

Indexes:

```text
ActorUserId + CreatedAtUtc
EntityType + EntityId + CreatedAtUtc
Action + CreatedAtUtc
```

Không cascade delete audit log khi user hoặc entity bị vô hiệu hóa.

---

## 14. Delete behavior tóm tắt

| Parent | Child | Behavior |
|---|---|---|
| Field | Booking | Restrict |
| Field | PricingRule | Restrict hoặc controlled delete khi chưa dùng |
| Booking | BookingService | Cascade |
| Booking | Payment | Restrict |
| Booking | PromoCodeUsage | Restrict |
| Booking | Review | Restrict |
| User | Booking snapshot relations | SetNull/Restrict |
| User | ActivityLog | SetNull |
| PromoCode | Booking | SetNull + snapshot |

Lịch sử tài chính và audit không được mất do cascade.

---

## 15. Seed data

Seed tối thiểu:

- Roles: Customer, Owner, Staff.
- Một Owner lấy email/password từ Secret Manager hoặc environment variables.
- Dữ liệu demo sân, giờ hoạt động, dịch vụ và giá chỉ trong Development.

Seed phải idempotent.

File JSON gợi ý:

```text
src/FootballBooking.Infrastructure/SeedData/fields.json
src/FootballBooking.Infrastructure/SeedData/services.json
src/FootballBooking.Infrastructure/SeedData/pricing-rules.json
```

---

## 16. Backup và migration tương lai

Connection string MySQL không lưu mật khẩu production trong repository; dùng Secret Manager hoặc biến môi trường.

Khi nâng cấp hoặc đổi database provider:

- Giữ entity và application service.
- Thay provider trong Infrastructure.
- Tạo lại migration theo provider đích.
- Rà soát DateOnly, enum, index và concurrency.
- Giữ cơ chế khóa database phù hợp với provider.
