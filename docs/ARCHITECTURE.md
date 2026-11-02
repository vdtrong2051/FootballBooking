# SYSTEM ARCHITECTURE

## 1. Mục tiêu kiến trúc

Kiến trúc phải:

- Phù hợp một dự án đơn nhóm, một cơ sở sân bóng và một tiến trình web.
- Giữ logic nghiệp vụ tách khỏi Controller và Razor View.
- Dễ kiểm thử.
- Không phức tạp như microservices hoặc enterprise architecture quá mức.
- Dùng MySQL để hỗ trợ database server và nhiều web instance.
- Hỗ trợ website công khai và Admin Area trong cùng ứng dụng.

---

## 2. Phong cách kiến trúc

Sử dụng **pragmatic modular monolith** với ASP.NET Core MVC.

```text
Browser
  │
  ├── Public Razor Views
  └── Admin Area Razor Views
          │
          ▼
ASP.NET Core Controllers
          │
          ▼
Application Services
          │
          ├── Domain rules
          └── Infrastructure interfaces
                    │
                    ▼
        EF Core / Identity / JSON / Email
                    │
                    ▼
                  MySQL
```

Không dùng:

- Microservices.
- Message broker.
- Distributed event bus.
- React SPA.
- Blazor.
- CQRS framework.
- Generic repository cho mọi entity.

---

## 3. Cấu trúc solution

```text
FootballBooking.sln
├── src/
│   ├── FootballBooking.Web/
│   ├── FootballBooking.Application/
│   ├── FootballBooking.Domain/
│   └── FootballBooking.Infrastructure/
└── tests/
    └── FootballBooking.Tests/
```

### 3.1. FootballBooking.Domain

Chứa:

- Entities.
- Enums.
- Value objects khi thực sự cần.
- Domain exceptions.
- Quy tắc bất biến cốt lõi.
- Các hàm tính toán thuần không phụ thuộc IO.

Ví dụ:

```text
Entities/
Enums/
Rules/
Exceptions/
```

Không chứa:

- DbContext.
- Controller.
- Razor.
- JSON file access.
- Email.
- HTTP.

### 3.2. FootballBooking.Application

Chứa use case và điều phối nghiệp vụ:

```text
Abstractions/
Bookings/
Fields/
Pricing/
Payments/
Promotions/
Reports/
Notifications/
Common/
```

Ví dụ service:

- `BookingService`.
- `AvailabilityService`.
- `PricingService`.
- `PaymentService`.
- `CancellationService`.
- `PromotionService`.
- `ReportService`.
- `NotificationService`.
- `ActivityLogService`.

Chứa:

- DTO.
- Command/query model đơn giản.
- Interface hạ tầng.
- Validation nghiệp vụ.
- Transaction orchestration.

Không chứa Razor hoặc EF migration.

### 3.3. FootballBooking.Infrastructure

Chứa:

```text
Data/
Identity/
Persistence/
Notifications/
Json/
Time/
Files/
DependencyInjection.cs
```

Trách nhiệm:

- `ApplicationDbContext`.
- EF Core configurations.
- Migrations.
- ASP.NET Core Identity persistence.
- MySQL provider (Pomelo).
- Seed từ JSON.
- Email implementation.
- Clock implementation.
- File/image storage local.
- MySQL advisory lock theo sân/ngày để chống ghi booking đồng thời giữa nhiều instance.

### 3.4. FootballBooking.Web

Chứa:

```text
Areas/Admin/
Controllers/
Views/
ViewModels/
ViewComponents/
TagHelpers/
wwwroot/
Program.cs
```

Trách nhiệm:

- HTTP route.
- Model binding.
- Antiforgery.
- Authentication/authorization entry points.
- Mapping request sang Application DTO.
- Mapping kết quả sang ViewModel.
- Razor Views.
- JSON endpoints cho FullCalendar và Chart.js.

### 3.5. FootballBooking.Tests

Một project test ban đầu để giảm overhead.

Cấu trúc gợi ý:

```text
Domain/
Application/
Integration/
TestData/
Fixtures/
```

Khi dự án lớn hơn có thể tách test project, nhưng không cần ở giai đoạn đầu.

---

## 4. Project references

```text
Application → Domain
Infrastructure → Application + Domain
Web → Application + Infrastructure
Tests → Domain + Application + Infrastructure + Web
```

Không tạo reference ngược.

---

## 5. Web architecture

### 5.1. Public website

Controller bình thường:

- `HomeController`.
- `FieldsController`.
- `BookingController`.
- `BookingLookupController`.
- `CustomerAccountController`.

Layout:

```text
Views/Shared/_PublicLayout.cshtml
```

### 5.2. Admin Area

```text
Areas/Admin/
├── Controllers/
├── Views/
├── ViewModels/
└── AdminAreaRegistration không cần thiết trong ASP.NET Core
```

Layout:

```text
Areas/Admin/Views/Shared/_AdminLayout.cshtml
```

Controller có `[Area("Admin")]` và authorization phù hợp.

### 5.3. Admin login

Có thể dùng Identity cookie chung nhưng tạo endpoint UI riêng `/admin/login`.

Luồng:

- Owner/Staff đăng nhập thành công → `/admin/dashboard`.
- Customer đăng nhập tại `/admin/login` → từ chối.
- Anonymous vào `/admin/*` → redirect `/admin/login`.
- Owner/Staff vào `/login` công khai → có thể redirect admin dashboard sau xác thực.

---

## 6. Application service boundaries

### 6.1. AvailabilityService

Chịu trách nhiệm:

- Operating hours.
- Field status.
- Field blocks.
- Active booking overlap.
- Trả available slots.

Không tính giá.

### 6.2. PricingService

Chịu trách nhiệm:

- Chọn rule giá phù hợp.
- Chia booking thành các đoạn giá.
- Tính court amount.
- Trả breakdown để hiển thị và lưu snapshot.

### 6.3. BookingService

Chịu trách nhiệm:

- Điều phối guest/customer/staff booking.
- Gọi availability.
- Gọi pricing.
- Gọi promotion.
- Tạo booking và service lines.
- Tạo mã booking.
- Tạo giữ chỗ.
- Chuyển trạng thái hợp lệ.

### 6.4. PaymentService

- Ghi nhận payment.
- Tính paid/refunded totals.
- Cập nhật payment status.
- Không tự chuyển booking status trừ rule được mô tả rõ.

### 6.5. CancellationService

- Kiểm tra quyền hủy.
- Tính phí hủy.
- Chuyển Cancelled.
- Tạo refund request/record khi cần.
- Ghi audit và notification.

### 6.6. ReportService

- Query đọc tối ưu.
- Trả DTO, không trả entity.
- Dashboard và CSV.

---

## 7. Persistence strategy

### 7.1. DbContext

`ApplicationDbContext` kế thừa:

```csharp
IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
```

DbContext chứa DbSet cho entity nghiệp vụ.

### 7.2. EF configurations

Mỗi entity có `IEntityTypeConfiguration<T>` riêng khi mapping không đơn giản.

```text
Data/Configurations/
```

### 7.3. Migration

Migration nằm trong Infrastructure.

Startup project là Web.

### 7.4. Transactions

Bắt buộc cho:

- Booking creation.
- Booking confirmation khi liên quan payment.
- Cancellation + refund record.
- Payment + aggregate status update.
- Promotion usage + booking creation.

### 7.5. MySQL concurrency

Để giảm double booking giữa nhiều web instance:

1. Lấy MySQL advisory lock theo `FieldId + BookingDate` trên một connection riêng.
2. Query lại overlap sau khi giữ lock.
3. Tạo booking và promotion usage.
4. Lưu thay đổi.
5. Nhả advisory lock trên đúng connection đã lấy lock.

Không coi UI slot là khóa. Production cần chạy concurrency test bằng MySQL thật.

---

## 8. Time architecture

Tạo interface:

```csharp
public interface ISystemClock
{
    DateTimeOffset UtcNow { get; }
}
```

Cấu hình business time zone trong settings:

```json
{
  "Business": {
    "TimeZoneId": "Asia/Ho_Chi_Minh"
  }
}
```

- Audit và expiration lưu UTC.
- BookingDate/StartMinute/EndMinute là thời gian nghiệp vụ địa phương.
- Service chuyển đổi rõ ràng, không dùng `DateTime.Now` rải rác.

---

## 9. Frontend architecture

### 9.1. Tailwind và Preline

Nguồn CSS:

```text
src/FootballBooking.Web/Styles/input.css
```

Output:

```text
src/FootballBooking.Web/wwwroot/css/site.css
```

JavaScript ứng dụng:

```text
src/FootballBooking.Web/wwwroot/js/
```

Không dùng CDN cho core UI ở bản production cuối; build asset cục bộ.

### 9.2. Razor composition

Dùng:

- Layout.
- Partial views.
- View Components cho khối có query/use case riêng.
- Tag Helpers cho badge trạng thái hoặc form pattern lặp lại nếu hữu ích.

Không tạo một view khổng lồ chứa toàn bộ trang.

### 9.3. JavaScript endpoints

Các endpoint JSON chỉ trả DTO cần thiết.

Ví dụ:

```text
GET /api/fields/{fieldId}/availability?date=2026-07-25
GET /admin/api/schedule/events?start=...&end=...&fieldId=...
GET /admin/api/dashboard/revenue?from=...&to=...
```

Đảm bảo authorization cho `/admin/api/*`.

---

## 10. Cross-cutting concerns

### 10.1. Validation

- Form validation ở Web.
- Business validation ở Application.
- Database constraints là lớp bảo vệ cuối.

### 10.2. Errors

- Domain/application lỗi dự kiến → kết quả có mã lỗi.
- Lỗi không dự kiến → exception handler, correlation ID và log.
- Không hiển thị stack trace ngoài Development.

### 10.3. Logging

Dùng `ILogger<T>`.

Không log secret.

### 10.4. Activity audit

Audit nghiệp vụ khác application log kỹ thuật. Audit lưu database và hiển thị cho Owner.

### 10.5. Seed

- Role và Owner seed idempotent.
- Dữ liệu demo đọc JSON chỉ trong Development hoặc khi lệnh seed được gọi rõ ràng.
- Không seed tài khoản với mật khẩu cố định trong source.

---

## 11. Deployment model v1

- Một hoặc nhiều ASP.NET Core process.
- Một MySQL server được quản lý độc lập.
- Reverse proxy IIS, Nginx hoặc Kestrel tùy môi trường.
- HTTPS.
- Backup MySQL định kỳ và kiểm tra khả năng restore.
- Secrets kết nối được cung cấp qua Secret Manager hoặc biến môi trường.

---

## 12. Architectural decision records tóm tắt

### ADR-001: ASP.NET Core MVC thay vì SPA

Lý do: phù hợp backend-first, Razor + template UI, ít phụ thuộc frontend framework.

### ADR-002: Modular monolith

Lý do: đủ tách trách nhiệm nhưng không tạo overhead microservices.

### ADR-003: MySQL cho persistence

Lý do: phù hợp triển khai server, hỗ trợ nhiều connection/web instance và cung cấp advisory lock để phối hợp tạo booking.

### ADR-004: JSON không phải database

Lý do: booking, payment và lịch cần transaction, relation và query.

### ADR-005: Admin Area cùng ứng dụng

Lý do: một deployment và authentication, UI vẫn tách rõ bằng route/layout.
