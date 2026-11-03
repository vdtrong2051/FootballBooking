# FootballBooking 7-Item Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện 7 hạng mục nâng cấp trên nhánh `feature/update-football-booking` gồm: hỗ trợ đa provider SQLite/MySQL kèm EF Migrations, tài khoản đăng nhập khách hàng (`/account/*`), mở rộng phương thức thanh toán (`VietQr`, `MoMo`, `ZaloPay`, `Card`), nâng cấp lịch sân FullCalendar, đổi sang biểu đồ thác nước (Waterfall Chart), tính lương & phân quyền chi tiết nhân viên, và nâng cấp giao diện công khai/quản trị.

**Architecture:** Mở rộng trực tiếp trên kiến trúc Clean Architecture 4 tầng hiện có (`Domain`, `Application`, `Infrastructure`, `Web`). Tận dụng `ApplicationUser` + Identity Claims cho tài khoản khách hàng, phân quyền nhân viên và cấu hình lương; mở rộng `PaymentMethod`, `BookingService`, `ReportService` và các bundle JS (`admin-reports.js`, `admin-schedule.js`).

**Tech Stack:** .NET 10.0, ASP.NET Core MVC + Razor Views, EF Core 9 (`Pomelo.EntityFrameworkCore.MySql` & `Microsoft.EntityFrameworkCore.Sqlite`), ASP.NET Core Identity, Tailwind CSS v4, Chart.js, FullCalendar, xUnit.

**Spec:** `docs/superpowers/specs/2026-11-03-football-booking-upgrade-design.md`

## Global Constraints

- Chỉ làm việc và commit trên nhánh: `feature/update-football-booking`.
- Target Framework: `.NET 10.0`, ASP.NET Core MVC + Razor Views, EF Core 9.
- Frontend build: `npm run build:css` (Tailwind v4) và `npm run build:js` (esbuild) xuất ra `src/FootballBooking.Web/wwwroot/`.
- Ngôn ngữ hiển thị: 100% tiếng Việt có dấu chuẩn trên giao diện và thông báo lỗi.
- Giữ nguyên khả năng đặt sân nhanh không cần đăng nhập (Guest Checkout) và toàn quyền của `Owner`.

## Review Focus

- Khách đã đăng nhập (`BookingSource.CustomerWeb`) đặt sân trực tuyến phải được tạo ở trạng thái `BookingStatus.PendingPayment` (có `ExpiresAtUtc`) giống `GuestWeb`, không được tự động thành `Confirmed` như khi nhân viên tạo nội bộ.
- Khi cấu hình `Database:Provider = "Sqlite"` hoặc chuỗi kết nối `Data Source=...`, `AddInfrastructure` phải đăng ký `SqliteBookingWriteLock` thay vì `MySqlBookingWriteLock` để không gọi lệnh `GET_LOCK` của MySQL trên kết nối SQLite.
- Nhân viên (`Staff`) cũ hoặc được seed trong môi trường test chưa có claim `permission` cụ thể vẫn phải truy cập được Lịch sân và Thanh toán theo quy tắc tương thích ngược, trong khi nhân viên đã được cấu hình danh sách quyền riêng thì chỉ truy cập đúng các quyền được cấp.
- Biểu đồ thác nước (Waterfall Chart) khi nhận dữ liệu có giá trị âm (như `-Khuyến mãi`, `-Hoàn tiền`) phải truyền mảng `[start, end]` và giữ nguyên độ lớn biến động có dấu trong tooltip thay vì hiển thị `[object Object]`.
- Khách hàng đăng ký hoặc đăng nhập qua `/account/login` truy cập `/account/bookings` phải nhìn thấy cả booking gắn `CustomerUserId` của mình lẫn booking khách đặt trước đó trùng số điện thoại chuẩn hóa (`CustomerPhoneNormalized`).

---

### Task 1: Hỗ trợ đa cơ sở dữ liệu SQLite – MySQL & Khởi tạo EF Migrations

**Files:**
- Modify: `src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj`
- Modify: `src/FootballBooking.Infrastructure/Data/DatabaseOptions.cs`
- Modify: `src/FootballBooking.Infrastructure/Data/MySqlDatabaseConfiguration.cs`
- Create: `src/FootballBooking.Infrastructure/Bookings/SqliteBookingWriteLock.cs`
- Modify: `src/FootballBooking.Infrastructure/DependencyInjection.cs`
- Modify: `src/FootballBooking.Infrastructure/Identity/ApplicationUser.cs`
- Create: `src/FootballBooking.Infrastructure/Migrations/*` (EF Core Initial Migration)
- Test: `tests/FootballBooking.Tests/Integration/FieldPersistenceTests.cs`

**Interfaces:**
- Consumes: `IBookingWriteLock` (`FootballBooking.Application.Bookings`)
- Produces:
  - `DatabaseOptions.Provider` (`string`, default `"MySql"`, supports `"Sqlite"`)
  - `MySqlDatabaseConfiguration.IsSqlite(string connectionString, DatabaseOptions options) -> bool`
  - `SqliteBookingWriteLock : IBookingWriteLock`
  - `ApplicationUser` properties: `PhoneNumber` (inherited), `BaseSalary` (`long`), `HourlyRate` (`long`), `StandardHoursPerMonth` (`int`), `CommissionPercent` (`decimal`)

- [ ] **Step 1: Viết unit/integration test kiểm tra cấu hình provider SQLite và `SqliteBookingWriteLock`**

Thêm test vào `tests/FootballBooking.Tests/Integration/FieldPersistenceTests.cs`:
```csharp
[Fact]
public async Task AddInfrastructure_WhenConfiguredWithSqliteProvider_UsesSqliteAndAcquiresWriteLock()
{
    var configuration = new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "Data Source=:memory:",
            ["Database:Provider"] = "Sqlite"
        })
        .Build();

    var services = new ServiceCollection();
    services.AddLogging();
    services.AddInfrastructure(configuration);

    await using var provider = services.BuildServiceProvider();
    var writeLock = provider.GetRequiredService<IBookingWriteLock>();
    await using var handle = await writeLock.TryAcquireAsync(Guid.NewGuid(), new DateOnly(2026, 7, 25), TimeSpan.FromSeconds(1), CancellationToken.None);

    Assert.NotNull(handle);
}
```

- [ ] **Step 2: Chạy test để xác nhận test fail**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "AddInfrastructure_WhenConfiguredWithSqliteProvider_UsesSqliteAndAcquiresWriteLock"`
Expected: FAIL (do `MySqlDatabaseConfiguration` gọi `UseMySql` trên chuỗi kết nối SQLite và `MySqlBookingWriteLock` mở `MySqlConnection`).

- [ ] **Step 3: Triển khai hỗ trợ SQLite + MySQL, mở rộng `ApplicationUser` và tạo EF Core Migration**

1. Thêm package reference `Microsoft.EntityFrameworkCore.Sqlite` vào `src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj`.
2. Trong `DatabaseOptions.cs`, thêm `public string Provider { get; init; } = "MySql";`.
3. Trong `MySqlDatabaseConfiguration.cs`, thêm `IsSqlite(string connectionString, DatabaseOptions options)` trả về `true` khi `options.Provider` là `"Sqlite"` (ignore case) hoặc `connectionString` chứa `"Data Source="` / `"DataSource="` và không chứa `"Server="`. Nếu `IsSqlite` là `true`, gọi `options.UseSqlite(connectionString)` trong `Configure(...)`.
4. Tạo `SqliteBookingWriteLock.cs` cài đặt `IBookingWriteLock` bằng `ConcurrentDictionary<string, SemaphoreSlim>` theo khóa `$"{fieldId:N}:{bookingDate:yyyyMMdd}"`.
5. Trong `DependencyInjection.cs`, đăng ký `SqliteBookingWriteLock` khi `MySqlDatabaseConfiguration.IsSqlite(...)` là `true`, ngược lại đăng ký `MySqlBookingWriteLock`.
6. Trong `ApplicationUser.cs`, bổ sung các thuộc tính phục vụ lương nhân viên:
   - `public long BaseSalary { get; set; }`
   - `public long HourlyRate { get; set; }`
   - `public int StandardHoursPerMonth { get; set; } = 160;`
   - `public decimal CommissionPercent { get; set; }`
7. Tạo EF Core migration vào `src/FootballBooking.Infrastructure/Migrations/` để đồng bộ toàn bộ schema.

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "FieldPersistenceTests"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/FootballBooking.Infrastructure tests/FootballBooking.Tests/Integration/FieldPersistenceTests.cs
git commit -m "feat(infra): support configurable SQLite and MySQL database providers with migrations"
```

---

### Task 2: Mở rộng Phương thức Thanh toán & Gắn Khách hàng vào Booking

**Files:**
- Modify: `src/FootballBooking.Domain/Bookings/PaymentMethod.cs`
- Modify: `src/FootballBooking.Application/Bookings/BookingLabels.cs`
- Modify: `src/FootballBooking.Application/Bookings/BookingCommands.cs`
- Modify: `src/FootballBooking.Application/Bookings/BookingDtos.cs`
- Modify: `src/FootballBooking.Application/Bookings/IBookingService.cs`
- Modify: `src/FootballBooking.Application/Bookings/IBookingStore.cs`
- Modify: `src/FootballBooking.Application/Bookings/BookingService.cs`
- Modify: `src/FootballBooking.Infrastructure/Bookings/EfBookingStore.cs`
- Test: `tests/FootballBooking.Tests/Application/BookingServiceTests.cs`

**Interfaces:**
- Produces:
  - `PaymentMethod`: `Cash = 1`, `BankTransfer = 2`, `Online = 3`, `Other = 4`, `VietQr = 5`, `MoMo = 6`, `ZaloPay = 7`, `Card = 8`
  - `BookingCreateCommand`: thêm tham số tùy chọn `Guid? CustomerUserId = null`, `PaymentMethod? PreferredPaymentMethod = null`
  - `IBookingService.ListCustomerBookingsAsync(Guid customerUserId, string? customerPhone, CancellationToken cancellationToken = default) -> Task<IReadOnlyList<BookingSummaryDto>>`
  - `IBookingService.ListScheduleEventsAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, BookingStatus? status = null, CancellationToken cancellationToken = default)`
  - `ScheduleEventDto`: bổ sung `Guid? FieldId`, `string? CustomerPhone`, `string? PaymentStatusLabel`

- [ ] **Step 1: Viết failing tests trong `tests/FootballBooking.Tests/Application/BookingServiceTests.cs`**

Thêm các test kiểm tra:
1. `CreateBookingAsync_WhenSourceIsCustomerWeb_CreatesPendingPaymentWithCustomerUserId`: khi `Source = BookingSource.CustomerWeb` và truyền `CustomerUserId`, booking được tạo với `Status == BookingStatus.PendingPayment`, `ExpiresAtUtc != null`, và `CustomerUserId` được lưu đúng.
2. `PaymentMethodLabels_WhenNewMethodsProvided_ReturnsVietnameseLabels`: `BookingLabels.PaymentMethod` trả về `"Quét mã VietQR"`, `"Ví MoMo"`, `"Ví ZaloPay"`, `"Thẻ ngân hàng"`.
3. `ListScheduleEventsAsync_WhenFilteredByStatus_ReturnsMatchingBookingEventsOnly`.

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "BookingServiceTests"`
Expected: FAIL

- [ ] **Step 3: Cập nhật `PaymentMethod`, `BookingLabels`, `BookingService` và `EfBookingStore`**

1. Thêm `VietQr = 5`, `MoMo = 6`, `ZaloPay = 7`, `Card = 8` vào `PaymentMethod.cs` và nhãn tiếng Việt tương ứng vào `BookingLabels.PaymentMethod`:
   - `PaymentMethod.VietQr => "Quét mã VietQR"`
   - `PaymentMethod.MoMo => "Ví MoMo"`
   - `PaymentMethod.ZaloPay => "Ví ZaloPay"`
   - `PaymentMethod.Card => "Thẻ ngân hàng"`
2. Trong `BookingCreateCommand`, thêm `Guid? CustomerUserId = null, PaymentMethod? PreferredPaymentMethod = null`.
3. Trong `BookingService.CreateBookingAsync`:
   - Sửa điều kiện trạng thái: `var status = command.Source is BookingSource.GuestWeb or BookingSource.CustomerWeb ? BookingStatus.PendingPayment : BookingStatus.Confirmed;`
   - Truyền `command.CustomerUserId` vào constructor `Booking(...)`.
   - Nếu `command.PreferredPaymentMethod` có giá trị và `Note` chưa ghi phương thức, nối thông tin phương thức thanh toán đã chọn hoặc tạo bản ghi `PaymentRecord` trạng thái `Pending` (với số tiền cọc 50% `TotalAmount`) khi khách chọn `VietQr`, `MoMo`, `ZaloPay`, `BankTransfer`, `Card`.
4. Thêm `ListCustomerBookingsAsync(Guid customerUserId, string? customerPhoneNormalized, CancellationToken cancellationToken)` trong `IBookingStore`, `EfBookingStore` và `BookingService` trả về các booking có `CustomerUserId == customerUserId` hoặc `CustomerPhoneNormalized == normalizedPhone`.
5. Mở rộng `ListScheduleEventsAsync` nhận thêm `BookingStatus? status = null` và trả về thêm `FieldId`, `CustomerPhone`, `PaymentStatusLabel` trong `ScheduleEventDto`.

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "BookingServiceTests"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/FootballBooking.Domain src/FootballBooking.Application src/FootballBooking.Infrastructure tests/FootballBooking.Tests/Application/BookingServiceTests.cs
git commit -m "feat(bookings): add VietQR/MoMo/ZaloPay/Card payment methods and customer booking queries"
```

---

### Task 3: Biểu đồ Thác nước (Waterfall Chart) trong Báo cáo & Dashboard

**Files:**
- Modify: `src/FootballBooking.Application/Reports/ReportDtos.cs`
- Modify: `src/FootballBooking.Application/Reports/IReportService.cs`
- Modify: `src/FootballBooking.Application/Reports/ReportService.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/DashboardController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Views/Dashboard/Index.cshtml`
- Modify: `src/FootballBooking.Web/Areas/Admin/Views/Reports/Index.cshtml`
- Modify: `src/FootballBooking.Web/Scripts/admin-reports.js`
- Test: `tests/FootballBooking.Tests/Application/ReportServiceTests.cs`

**Interfaces:**
- Produces:
  - `WaterfallStepDto(string Label, long Delta, long Start, long End, string Tone, bool IsTotal = false)`
  - `ChartDatasetDto`: hỗ trợ thêm `IReadOnlyList<WaterfallStepDto>? WaterfallSteps = null`
  - `IReportService.GetRevenueWaterfallChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken) -> Task<ChartDataDto>`
  - Endpoint `GET /admin/api/dashboard/revenue-waterfall?from=...&to=...`

- [ ] **Step 1: Viết failing tests trong `tests/FootballBooking.Tests/Application/ReportServiceTests.cs`**

Thêm các test:
1. `GetRevenueChartAsync_ReturnsWaterfallStepsWithRunningTotalsAndFinalSummary`: kiểm tra `ChartDatasetDto.Type == "waterfall"` và `WaterfallSteps` chứa các bậc thang lũy kế `[Start, End]` kèm cột cuối `IsTotal == true`.
2. `GetRevenueWaterfallChartAsync_ReturnsFinancialBridgeSteps`: kiểm tra các bước cầu nối tài chính gồm `"Tiền sân"`, `"Dịch vụ"`, `"Khuyến mãi"`, `"Phí hủy"`, `"Hoàn trả"`, `"Còn phải thu"`, `"Thực thu ròng"`, trong đó bước giảm có `Delta < 0` và bước cuối `"Thực thu ròng"` có `IsTotal == true` bằng đúng tổng thực thu.

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "ReportServiceTests"`
Expected: FAIL

- [ ] **Step 3: Cài đặt dữ liệu Waterfall trong `ReportService`, `DashboardController` và vẽ Waterfall Chart trong `admin-reports.js`**

1. Trong `ReportDtos.cs`, thêm `WaterfallStepDto` và thuộc tính tùy chọn `IReadOnlyList<WaterfallStepDto>? WaterfallSteps = null` vào `ChartDatasetDto`.
2. Trong `ReportService.GetRevenueChartAsync`, xây dựng danh sách `WaterfallStepDto` lũy kế theo ngày (bỏ các ngày 0 đồng nếu khoảng > 14 ngày hoặc nhóm theo ngày phát sinh, cuối cùng là cột `"Tổng thực thu"` với `IsTotal = true`, `Start = 0`, `End = totalRevenue`) và đặt `Type = "waterfall"`.
3. Thêm `GetRevenueWaterfallChartAsync` trả về biểu đồ thác nước Cơ cấu Doanh thu:
   - `"Tiền sân"` (`+courtAmount`, `success`)
   - `"Dịch vụ"` (`+serviceAmount`, `info`)
   - `"Khuyến mãi"` (`-discountAmount`, `warning`)
   - `"Phí hủy"` (`+cancellationFee`, `active`)
   - `"Hoàn trả"` (`-refundedAmount`, `danger`)
   - `"Còn phải thu"` (`-remainingAmount`, `warning`)
   - `"Thực thu ròng"` (`netPaid`, `IsTotal = true`, `active`)
4. Thêm action `GET /admin/api/dashboard/revenue-waterfall` trong `DashboardController.cs`.
5. Trong `Scripts/admin-reports.js`:
   - Khi `dataset.type === "waterfall"` và có `dataset.waterfallSteps`, chuyển thành Chart.js `type: "bar"` với `data: steps.map(s => [s.start, s.end])`.
   - Tô màu từng cột theo `step.isTotal` (`#1d4ed8`), `step.delta >= 0` (`#15803d`), `step.delta < 0` (`#dc2626`).
   - Cấu hình `tooltip.callbacks.label` hiển thị: biến động `+/-` từ `step.delta` và lũy kế `step.end`.
6. Cập nhật `Dashboard/Index.cshtml` và `Reports/Index.cshtml` hiển thị chú thích màu sắc Biểu đồ Thác nước (Tăng / Giảm / Tổng kết) và biểu đồ Cơ cấu Doanh thu Thác nước.
7. Chạy `npm run build:js` để cập nhật `wwwroot/js/admin-reports.js`.

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "ReportServiceTests"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/FootballBooking.Application/Reports src/FootballBooking.Web/Areas/Admin src/FootballBooking.Web/Scripts/admin-reports.js src/FootballBooking.Web/wwwroot/js/admin-reports.js tests/FootballBooking.Tests/Application/ReportServiceTests.cs
git commit -m "feat(reports): replace revenue charts with financial and cumulative waterfall charts"
```

---

### Task 4: Tài khoản Khách hàng (`/account/*`) & Tích hợp Đặt sân / Thanh toán Công khai

**Files:**
- Create: `src/FootballBooking.Web/ViewModels/Account/CustomerAccountViewModels.cs`
- Create: `src/FootballBooking.Web/Controllers/AccountController.cs`
- Create: `src/FootballBooking.Web/Views/Account/Login.cshtml`
- Create: `src/FootballBooking.Web/Views/Account/Register.cshtml`
- Create: `src/FootballBooking.Web/Views/Account/Bookings.cshtml`
- Modify: `src/FootballBooking.Web/Controllers/BookingController.cs`
- Modify: `src/FootballBooking.Web/ViewModels/Bookings/BookingViewModels.cs`
- Modify: `src/FootballBooking.Web/Views/Booking/Create.cshtml`
- Modify: `src/FootballBooking.Web/Views/Booking/Success.cshtml`
- Modify: `src/FootballBooking.Web/Views/Shared/Partials/_PublicNavbar.cshtml`
- Test: `tests/FootballBooking.Tests/Integration/FieldRoutesTests.cs`

**Interfaces:**
- Consumes: `ApplicationRoles.Customer`, `IBookingService.ListCustomerBookingsAsync`, `PaymentMethod`
- Produces:
  - Routes: `GET/POST /account/register`, `GET/POST /account/login`, `POST /account/logout`, `GET /account/bookings`
  - `BookingCreateViewModel.PreferredPaymentMethod` (`PaymentMethod`, default `PaymentMethod.VietQr`)

- [ ] **Step 1: Viết failing integration tests trong `tests/FootballBooking.Tests/Integration/FieldRoutesTests.cs`**

Thêm các test:
1. `CustomerAccountRoutes_WhenRequested_RenderLoginAndRegisterPages`: kiểm tra `GET /account/login` và `GET /account/register` trả về `200 OK` với tiêu đề `"Đăng nhập khách hàng"` và `"Đăng ký tài khoản"`.
2. `BookingPage_WhenRendered_ShowsNewPaymentMethodOptions`: kiểm tra `GET /booking` hiển thị `"Quét mã VietQR"`, `"Ví MoMo"`, `"Ví ZaloPay"`.

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "CustomerAccountRoutes_WhenRequested_RenderLoginAndRegisterPages"`
Expected: FAIL (`404 NotFound`)

- [ ] **Step 3: Cài đặt `AccountController`, các View `/account/*`, cập nhật `_PublicNavbar.cshtml` và `BookingController`**

1. Tạo `CustomerAccountViewModels.cs` gồm `CustomerLoginViewModel` (`EmailOrPhone`, `Password`, `RememberMe`), `CustomerRegisterViewModel` (`FullName`, `PhoneNumber`, `Email`, `Password`, `ConfirmPassword`), và `CustomerBookingsViewModel` (`FullName`, `PhoneNumber`, `Email`, `Bookings`).
2. Tạo `AccountController.cs` với `[Route("account")]`:
   - `GET/POST register`: tạo `ApplicationUser` với `Role = ApplicationRoles.Customer`, `PhoneNumber`, `FullName`, tự động đăng nhập và chuyển hướng về `/booking` hoặc `returnUrl`.
   - `GET/POST login`: hỗ trợ tìm user theo Email hoặc `PhoneNumber`, đăng nhập qua `SignInManager`.
   - `POST logout`: đăng xuất và chuyển về `/`.
   - `GET bookings` (`[Authorize]`): lấy danh sách booking qua `bookingService.ListCustomerBookingsAsync(user.Id, user.PhoneNumber, cancellationToken)` và hiển thị trong `Views/Account/Bookings.cshtml`.
3. Cập nhật `_PublicNavbar.cshtml` hiển thị nút `"Đăng nhập"` (`/account/login`), `"Đăng ký"` (`/account/register`) khi chưa đăng nhập; hiển thị tên người dùng, `"Lịch đặt của tôi"` (`/account/bookings`) và nút `"Đăng xuất"` khi đã đăng nhập.
4. Trong `BookingCreateViewModel` và `BookingController.cs`:
   - Thêm `public PaymentMethod PreferredPaymentMethod { get; set; } = PaymentMethod.VietQr;`.
   - Khi user đã đăng nhập, tự động điền `CustomerName`, `CustomerPhone`, `CustomerEmail` trên `GET /booking`, và gửi `BookingSource.CustomerWeb` + `CustomerUserId` + `PreferredPaymentMethod` trên `POST /booking`.
5. Trong `Views/Booking/Create.cshtml` và `Views/Booking/Success.cshtml`:
   - Bổ sung thanh tiến trình 3 bước và danh sách chọn phương thức thanh toán (`VietQr`, `MoMo`, `ZaloPay`, `BankTransfer`, `Card`, `Cash`).
   - Trên `Success.cshtml`, hiển thị hộp hướng dẫn thanh toán VietQR / Ví điện tử kèm mã nội dung chuyển khoản `@Model.Booking.BookingCode` và số tiền cọc cần thanh toán.

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "FieldRoutesTests"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/FootballBooking.Web tests/FootballBooking.Tests/Integration/FieldRoutesTests.cs
git commit -m "feat(web): add customer login/register account flow and payment method checkout UI"
```

---

### Task 5: Nâng cấp Lịch sân Quản trị (`/admin/schedule`)

**Files:**
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/ScheduleController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/BookingsController.cs`
- Modify: `src/FootballBooking.Web/ViewModels/Bookings/BookingViewModels.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Views/Schedule/Index.cshtml`
- Modify: `src/FootballBooking.Web/Scripts/admin-schedule.js`
- Test: `tests/FootballBooking.Tests/Integration/FieldRoutesTests.cs`

**Interfaces:**
- Consumes: `IBookingService.ListScheduleEventsAsync(startDate, endDate, fieldId, status, cancellationToken)`
- Produces:
  - `AdminScheduleViewModel.Status` (`BookingStatus?`), `AdminScheduleViewModel.DateText` (`string`)
  - `GET /admin/schedule?fieldId=...&status=...&date=...`
  - `GET /admin/api/schedule/events?start=...&end=...&fieldId=...&status=...`
  - `GET /admin/bookings/create?fieldId=...&date=...&startMinute=...`

- [ ] **Step 1: Viết failing test trong `tests/FootballBooking.Tests/Integration/FieldRoutesTests.cs`**

Thêm test kiểm tra `ScheduleController` và `/admin/bookings/create` hỗ trợ tham số prefill `fieldId`, `date`, `startMinute` và bộ lọc `status`.

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "FieldRoutesTests"`
Expected: FAIL

- [ ] **Step 3: Cập nhật `ScheduleController`, `BookingsController`, `Schedule/Index.cshtml` và `admin-schedule.js`**

1. Trong `AdminScheduleViewModel`, thêm `public BookingStatus? Status { get; set; }`.
2. Trong `ScheduleController.Index(Guid? fieldId, BookingStatus? status, string? date, CancellationToken cancellationToken)`:
   - Gán `FieldId = fieldId`, `Status = status`, và `InitialDateText` từ `date` (nếu hợp lệ `yyyy-MM-dd`).
   - Lọc `recentBookings` theo `status` nếu có.
3. Trong `ScheduleController.Events(string? start, string? end, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken)`:
   - Truyền `status` xuống `bookingService.ListScheduleEventsAsync(...)`.
   - Trả thêm `fieldId`, `customerPhone`, `paymentStatus` trong `extendedProps`.
4. Trong `Areas/Admin/Controllers/BookingsController.cs`:
   - Mở rộng `Create(Guid? fieldId = null, string? date = null, int? startMinute = null, CancellationToken cancellationToken = default)` để điền sẵn sân, ngày (`dd/MM/yyyy` hoặc `yyyy-MM-dd`) và khung giờ khi nhân viên click từ lịch sân.
5. Trong `Schedule/Index.cshtml` và `Scripts/admin-schedule.js`:
   - Thêm dropdown lọc **Trạng thái booking**, ô chọn **Ngày xem lịch**, và các nút chuyển nhanh `Hôm nay` / `Ngày mai` / `+ Tạo đặt sân`.
   - Bật `selectable: true` và `dateClick` trong `admin-schedule.js`: khi nhân viên click vào khung giờ trên lịch (`timeGridWeek` / `timeGridDay`), điều hướng sang `/admin/bookings/create?date=YYYY-MM-DD&startMinute=...&fieldId=...`.
   - Chạy `npm run build:js` để cập nhật `wwwroot/js/admin-schedule.js`.

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "FieldRoutesTests"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/FootballBooking.Web tests/FootballBooking.Tests/Integration/FieldRoutesTests.cs
git commit -m "feat(schedule): add status/date filtering and click-to-create slot booking on calendar"
```

---

### Task 6: Tính lương & Phân quyền Chi tiết Nhân viên (`/admin/staff`) + Hoàn thiện Giao diện

**Files:**
- Create: `src/FootballBooking.Application/Common/Security/StaffPermissions.cs`
- Modify: `src/FootballBooking.Web/Program.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/StaffController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/FieldsController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/ServicesController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/PromotionsController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Controllers/ReportsController.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/ViewModels/StaffViewModels.cs`
- Modify: `src/FootballBooking.Web/Areas/Admin/Views/Shared/StaffIndex.cshtml`
- Modify: `src/FootballBooking.Web/Areas/Admin/Views/Shared/StaffForm.cshtml`
- Modify: `src/FootballBooking.Web/Areas/Admin/Views/Shared/Partials/_AdminSidebar.cshtml`
- Test: `tests/FootballBooking.Tests/ApplicationRolesTests.cs`
- Test: `tests/FootballBooking.Tests/Integration/AdminRoutesTests.cs`

**Interfaces:**
- Produces:
  - `StaffPermissions`:
    - `ClaimType = "permission"`
    - `ManageSchedule = "schedule.manage"`
    - `ManagePayments = "payments.manage"`
    - `ManageCatalog = "catalog.manage"`
    - `ViewReports = "reports.view"`
    - `All` dictionary/list kèm nhãn tiếng Việt
  - Policies trong `Program.cs`: `CanManageSchedule`, `CanManagePayments`, `CanManageCatalog`, `CanViewReports`
  - `StaffPayrollItemViewModel` và action `GET /admin/staff/payroll.csv`

- [ ] **Step 1: Viết failing tests trong `tests/FootballBooking.Tests/ApplicationRolesTests.cs` và `AdminRoutesTests.cs`**

1. Trong `ApplicationRolesTests.cs`: kiểm tra `StaffPermissions.All` chứa đủ 4 quyền (`schedule.manage`, `payments.manage`, `catalog.manage`, `reports.view`) và công thức tính tổng lương `CalculateTotalSalary(baseSalary, hourlyRate, hours, handledRevenue, commissionPercent)`.
2. Trong `AdminRoutesTests.cs`: kiểm tra nhân viên có claim `reports.view` truy cập được `/admin/reports`, và trang `/admin/staff` hiển thị bảng tính lương và phân quyền.

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj --filter "ApplicationRolesTests|AdminRoutesTests"`
Expected: FAIL

- [ ] **Step 3: Cài đặt `StaffPermissions`, Policies, Tính lương Nhân viên và Đồng bộ Giao diện**

1. Tạo `StaffPermissions.cs` trong `src/FootballBooking.Application/Common/Security/`:
   - Định nghĩa 4 quyền, nhãn tiếng Việt, hàm kiểm tra quyền `HasPermission(ClaimsPrincipal user, string permission)` (luôn trả về `true` cho `Owner`; với `Staff`, nếu user chưa có bất kỳ claim `permission` nào thì mặc định cho phép `schedule.manage` và `payments.manage`, ngược lại kiểm tra claim khớp `permission`).
   - Định nghĩa hàm tính lương `CalculateTotalSalary(long baseSalary, long hourlyRate, int hours, long revenueHandled, decimal commissionPercent) -> (long HourlyPay, long CommissionPay, long TotalSalary)`.
2. Trong `Program.cs`, đăng ký các policy `CanManageSchedule`, `CanManagePayments`, `CanManageCatalog`, `CanViewReports` dùng `StaffPermissions.HasPermission` và cập nhật `[Authorize(Policy = ...)]` trên các Admin Controllers + hiển thị menu tương ứng trong `_AdminSidebar.cshtml`.
3. Mở rộng `StaffViewModels.cs` và `StaffController.cs`:
   - `StaffFormViewModel`: thêm `BaseSalary`, `HourlyRate`, `StandardHoursPerMonth`, `CommissionPercent`, và `List<string> Permissions`.
   - Khi tạo/sửa nhân viên trong `StaffController`: lưu các trường lương trên `ApplicationUser` và đồng bộ danh sách claim `permission` qua `userManager.GetClaimsAsync` / `RemoveClaimsAsync` / `AddClaimsAsync`.
   - Trong `StaffController.Index`: tính toán doanh thu xử lý trong tháng của từng nhân viên (từ các `Bookings` tạo bởi nhân viên hoặc `Payments` thu bởi nhân viên trong `ApplicationDbContext`), tổng hợp bảng lương nhân viên ngay trên `StaffIndex.cshtml` và thêm endpoint `GET /admin/staff/payroll.csv` để xuất CSV bảng lương.
4. Chạy `npm run build:css` và `npm run build:js` để đóng gói toàn bộ giao diện mới.

- [ ] **Step 4: Chạy toàn bộ test suite để xác nhận tất cả pass**

Run: `dotnet test FootballBooking.slnx`
Expected: PASS (100% tests pass, 0 warnings/errors)

- [ ] **Step 5: Commit**

```bash
git add src/ tests/
git commit -m "feat(staff): add staff payroll calculation, granular permission claims, and UI polish"
```
