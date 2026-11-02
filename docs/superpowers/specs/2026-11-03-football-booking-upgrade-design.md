# Thiết kế nâng cấp hệ thống FootballBooking (7 hạng mục)

## 1. Mục tiêu và Bối cảnh (Intent & Why)
Nâng cấp hệ thống quản lý và đặt sân bóng đá mini `FootballBooking` trên nhánh `feature/update-football-booking` nhằm hoàn thiện 7 hạng mục chức năng và trải nghiệm người dùng theo chuẩn các nền tảng đặt sân thể thao hiện đại (Playtomic, CourtReserve, Booking.com):

1. **SQLite – MySQL**: Hoàn thiện cấu hình đa cơ sở dữ liệu (MySQL mặc định cho Production/Development, hỗ trợ chuyển đổi cấu hình SQLite/MySQL qua `Database:Provider`, và tạo bộ EF Core Migrations chuẩn).
2. **Khách thêm tài khoản đăng nhập**: Bổ sung luồng Đăng ký, Đăng nhập, Đăng xuất và trang Quản lý lịch đặt sân cá nhân cho khách hàng (`/account/*`), đồng thời giữ nguyên khả năng đặt sân nhanh không cần đăng nhập (Guest Checkout).
3. **Thêm phương thức thanh toán**: Mở rộng các phương thức thanh toán phổ biến tại Việt Nam (`VietQR`, `MoMo`, `ZaloPay`, `Card` bên cạnh `Cash`, `BankTransfer`, `Online`, `Other`); cho phép khách chọn phương thức thanh toán mong muốn ngay khi đặt sân và hiển thị thông tin/mã QR thanh toán trên trang kết quả đặt sân.
4. **Sửa lịch (`/admin/schedule`)**: Nâng cấp lịch điều phối FullCalendar cho phép click trực tiếp vào khung giờ trống để mở nhanh form tạo booking (điền sẵn sân, ngày, khung giờ), bổ sung lọc theo trạng thái booking, điều hướng ngày nhanh và làm giàu thông tin hiển thị trên thẻ lịch.
5. **Đổi biểu đồ sang Biểu đồ Thác nước (Waterfall Chart)**: Chuyển đổi biểu đồ doanh thu trên Dashboard và Báo cáo sang biểu đồ thác nước (Waterfall Chart) sử dụng floating bars `[start, end]` của Chart.js, thể hiện cả biến động doanh thu lũy kế theo kỳ lẫn cầu nối cơ cấu doanh thu (*Tiền sân → +Dịch vụ → -Khuyến mãi → +Phí hủy → -Hoàn tiền → =Thực thu*).
6. **Tính lương & Phân quyền nhân viên (`/admin/staff`)**: Mở rộng hồ sơ nhân viên với cấu hình lương (Lương cơ bản, Lương theo giờ, Số giờ công, % Hoa hồng xử lý booking), trang Bảng tính lương nhân viên theo kỳ, và cơ chế Phân quyền chi tiết theo chức năng (Claims-based authorization) để Chủ sân cấp quyền linh hoạt cho từng nhân viên.
7. **Sửa giao diện (UI/UX)**: Đồng bộ thanh điều hướng công khai (hiển thị trạng thái đăng nhập khách hàng), nâng cấp giao diện trang Chủ, trang Đặt sân (stepper 3 bước trực quan + chọn phương thức thanh toán), trang Lịch sân và Báo cáo quản trị.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals (Mục tiêu cần đạt)
- Giữ vững kiến trúc Clean Architecture 4 tầng hiện có (`Domain`, `Application`, `Infrastructure`, `Web`).
- Toàn bộ 7 hạng mục hoạt động xuyên suốt từ Domain/Database đến giao diện Razor và JavaScript bundle.
- Tương thích ngược với toàn bộ unit tests và integration tests hiện có, đồng thời bổ sung test mới cho cả 7 hạng mục.

### Non-Goals (Không nằm trong phạm vi)
- Không tích hợp webhook thanh toán thật từ cổng ngân hàng/MoMo/ZaloPay (sử dụng hiển thị hướng dẫn chuyển khoản / VietQR động theo mã booking và xác nhận thu tiền trong Admin).
- Không xây dựng hệ thống chấm công vân tay hay bảng phân ca phức tạp theo từng ngày (`StaffShift`).

### Anti-Goals (Những điều tuyệt đối tránh)
- Không bắt buộc khách hàng phải đăng nhập mới được đặt sân (tránh làm rớt tỷ lệ chuyển đổi của khách vãng lai).
- Không phá vỡ quyền truy cập tối cao của `Owner` khi áp dụng phân quyền chi tiết cho `Staff`.

---

## 3. Ràng buộc kỹ thuật (Constraints)
- **Chỉ làm việc và commit trên nhánh**: `feature/update-football-booking`.
- **Target Framework**: `.NET 10.0`, ASP.NET Core MVC + Razor Views, EF Core 9 (`Pomelo.EntityFrameworkCore.MySql` và `Microsoft.EntityFrameworkCore.Sqlite`).
- **Frontend**: Tailwind CSS v4 (`npm run build:css`) và esbuild (`npm run build:js`) đóng gói `Scripts/admin-reports.js`, `Scripts/admin-schedule.js`, `Scripts/site.js` ra `wwwroot/`.
- **Ngôn ngữ hiển thị**: 100% tiếng Việt có dấu chuẩn trên giao diện và thông báo lỗi.

---

## 4. Các phương án đã cân nhắc (Approaches)

### Phương án 1 (Đã chọn): Tích hợp liền mạch trên kiến trúc sẵn có (Integrated Booking & Operations)
- Mở rộng trực tiếp trên `ApplicationUser`, `Booking`, `PaymentMethod`, `ReportService`, `ScheduleController` và `StaffController`.
- Dùng Claims (`StaffPermissions`) lưu qua `UserManager` của ASP.NET Core Identity để phân quyền nhân viên mà không cần tạo bảng phân quyền rời rạc.
- Dùng các trường cấu hình lương trên `ApplicationUser` kết hợp dữ liệu thực tế từ các booking nhân viên đã xử lý/vận hành trong kỳ để tính bảng lương tự động.
- **Lý do chọn**: Gọn nhẹ, tận dụng tối đa các thành phần đã có (`CustomerUserId`, `BookingSource.CustomerWeb`, Identity Claims, Chart.js, FullCalendar), dễ bảo trì và kiểm thử.

### Phương án 2 (Đã loại bỏ): Tách phân hệ HRM & Cổng thanh toán độc lập
- Tạo các bảng `StaffShift`, `PayrollRecord` và màn hình redirect cổng thanh toán riêng.
- **Lý do loại bỏ**: Làm phình schema cơ sở dữ liệu và buộc chủ sân phải nhập lịch ca trực hàng ngày trước khi tính được lương.

---

## 5. Thiết kế chi tiết từng hạng mục (Detailed Design)

### 5.1. Hạng mục 1: SQLite – MySQL (`FootballBooking.Infrastructure`)
- Mở rộng `DatabaseOptions` thêm thuộc tính `Provider` (`"MySql"` mặc định hoặc `"Sqlite"`).
- Trong `MySqlDatabaseConfiguration` / `DependencyInjection.cs`:
  - Nếu `Database:Provider` là `"Sqlite"` hoặc chuỗi kết nối bắt đầu bằng `Data Source=` / `DataSource=`, cấu hình `options.UseSqlite(connectionString)` và đăng ký `SqliteBookingWriteLock` (in-process `SemaphoreSlim` write lock) cho `IBookingWriteLock`.
  - Mặc định sử dụng `options.UseMySql(...)` và `MySqlBookingWriteLock`.
- Tạo bộ EF Core Migrations chuẩn trong `src/FootballBooking.Infrastructure/Migrations/` để sẵn sàng khởi tạo schema.

### 5.2. Hạng mục 2: Khách thêm tài khoản đăng nhập (`/account/*`)
- **Controller & Routes (`AccountController.cs`)**:
  - `GET /account/register`, `POST /account/register`: Đăng ký tài khoản khách hàng (`FullName`, `PhoneNumber`, `Email`, `Password`, `ConfirmPassword`), gán role `ApplicationRoles.Customer` và tự động đăng nhập.
  - `GET /account/login`, `POST /account/login`: Đăng nhập cho khách hàng (hỗ trợ cả Email hoặc Số điện thoại); nếu là tài khoản `Owner`/`Staff` đăng nhập nhầm cổng hoặc ngược lại vẫn điều hướng hợp lý.
  - `POST /account/logout`: Đăng xuất và quay về trang chủ.
  - `GET /account/bookings`: Trang **"Lịch đặt của tôi"** liệt kê tất cả booking của khách (khớp theo `CustomerUserId` hoặc số điện thoại chuẩn hóa của tài khoản), cho phép xem chi tiết và hủy booking hợp lệ.
- **Tích hợp vào luồng Đặt sân (`BookingController.cs`)**:
  - Khi khách đã đăng nhập với role `Customer`:
    - `GET /booking`: Tự động điền sẵn `CustomerName`, `CustomerPhone`, `CustomerEmail` từ hồ sơ `ApplicationUser`.
    - `POST /booking`: Truyền `BookingSource.CustomerWeb` và `CustomerUserId` của khách vào `BookingCreateCommand` (mở rộng thêm trường `CustomerUserId` và `PreferredPaymentMethod` trên `BookingCreateCommand`).

### 5.3. Hạng mục 3: Thêm phương thức thanh toán
- **Domain (`PaymentMethod.cs`)**:
  - Giữ các giá trị cũ và bổ sung các phương thức mới:
    - `Cash = 1` (Tiền mặt tại sân)
    - `BankTransfer = 2` (Chuyển khoản ngân hàng)
    - `Online = 3` (Thanh toán trực tuyến)
    - `Other = 4` (Khác)
    - `VietQr = 5` (Quét mã VietQR)
    - `MoMo = 6` (Ví điện tử MoMo)
    - `ZaloPay = 7` (Ví điện tử ZaloPay)
    - `Card = 8` (Thẻ ATM / Quốc tế)
- **Cập nhật nhãn hiển thị (`BookingLabels.PaymentMethod`)**: Hiển thị đầy đủ tên tiếng Việt cho cả 8 phương thức.
- **Luồng khách đặt sân (`/booking` & `/booking/success/{code}`)**:
  - Trên form `/booking`, khách chọn **Phương thức thanh toán dự kiến** (VietQR, MoMo, ZaloPay, Chuyển khoản, Tiền mặt tại sân).
  - Khi tạo booking, lưu ghi chú phương thức hoặc tạo bản ghi `PaymentRecord` trạng thái `Pending` (nếu chọn chuyển khoản/ví/QR) hoặc hiển thị khung hướng dẫn thanh toán trực quan (kèm mã QR động VietQR/MoMo theo mã `BookingCode` và số tiền cọc 50% hoặc toàn bộ) trên trang `/booking/success/{code}`.
  - Trên màn hình Admin (`/admin/bookings/{id}`, `/admin/bookings/{id}/settlement`, `/admin/payments`), dropdown phương thức thu/hoàn tiền hiển thị đầy đủ các phương thức mới.

### 5.4. Hạng mục 4: Sửa lịch (`/admin/schedule`)
- **Nâng cấp Backend (`ScheduleController.cs` & `BookingService.cs`)**:
  - Hỗ trợ lọc sự kiện trên lịch theo `status` (`BookingStatus?`) bên cạnh `fieldId`.
  - Bổ sung thông tin `fieldId`, `customerPhone`, `paymentStatus`, `totalAmount`, `remainingAmount` vào `ScheduleEventDto` và JSON `/admin/api/schedule/events`.
- **Nâng cấp Frontend (`Schedule/Index.cshtml` & `Scripts/admin-schedule.js`)**:
  - Bổ sung bộ lọc theo **Trạng thái booking** và ô chọn **Ngày xem lịch** (`date`).
  - Cho phép **click/quét chọn khung giờ trống trên lịch (`selectable: true`, `dateClick` / `select`)** để chuyển thẳng tới `/admin/bookings/create?fieldId=...&date=...&startMinute=...` (tự động điền sân, ngày và giờ bắt đầu trên trang tạo booking nội bộ).
  - Hiển thị thẻ sự kiện trên lịch giàu thông tin hơn: Mã booking, tên khách, SĐT và nhãn trạng thái thanh toán.

### 5.5. Hạng mục 5: Đổi biểu đồ sang Biểu đồ Thác nước (Waterfall Chart)
- **Backend (`ReportDtos.cs`, `ReportService.cs`, `DashboardController.cs`)**:
  - Bổ sung hỗ trợ dữ liệu Waterfall trong `ChartDatasetDto` (cho phép biểu diễn các cột biến động và cột tổng kết, hoặc thêm endpoint `/admin/api/dashboard/revenue-waterfall?from=...&to=...` cùng dữ liệu waterfall cho `/admin/api/dashboard/revenue`).
  - Cung cấp 2 góc nhìn Waterfall chuẩn quản trị tài chính:
    1. **Biểu đồ thác nước Cơ cấu Doanh thu** (*Tiền sân → +Dịch vụ đi kèm → -Khuyến mãi → +Phí hủy sân → -Hoàn tiền → -Còn phải thu → =Thực thu ròng*).
    2. **Biểu đồ thác nước Lũy kế Doanh thu theo ngày/tháng**: Mỗi ngày/tháng là một bậc thang `[lũy_kế_trước, lũy_kế_sau]` và cột cuối cùng là `Tổng doanh thu kỳ`.
- **Frontend (`Scripts/admin-reports.js` & `Reports/Index.cshtml`, `Dashboard/Index.cshtml`)**:
  - Chuyển đổi bộ dựng biểu đồ trong `admin-reports.js` sang vẽ **Waterfall Chart** bằng floating bars `[start, end]` của Chart.js.
  - Tự động tô màu theo tính chất cột:
    - Cột tăng (`+`): Xanh lá (`#15803d` / `rgba(21, 128, 61, 0.22)`).
    - Cột giảm (`-` như Khuyến mãi, Hoàn trả, Công nợ): Đỏ cam (`#dc2626` / `rgba(220, 38, 38, 0.22)`).
    - Cột Tổng kết (`Tổng cộng / Thực thu`): Xanh lam đậm (`#1d4ed8` / `rgba(29, 78, 216, 0.28)`).
  - Tooltip hiển thị rõ: Giá trị biến động (`+500.000 ₫` hoặc `-100.000 ₫`) và Số dư lũy kế tại bước đó.

### 5.6. Hạng mục 6: Tính lương & Phân quyền nhân viên (`/admin/staff`)
- **Phân quyền chi tiết (Granular Staff Permissions)**:
  - Định nghĩa danh sách quyền nghiệp vụ trong `StaffPermissions` (`Application/Common/Security/StaffPermissions.cs`) lưu dưới dạng User Claim (`permission`):
    - `schedule.manage`: Xem và điều phối lịch sân, tạo/cập nhật booking.
    - `payments.manage`: Thu tiền, hoàn tiền và quyết toán booking.
    - `catalog.manage`: Quản lý sân bóng, dịch vụ đi kèm và khuyến mãi.
    - `reports.view`: Xem báo cáo doanh thu và biểu đồ thống kê.
  - Cấu hình Authorization Policies trong `Program.cs` (`CanManageSchedule`, `CanManagePayments`, `CanManageCatalog`, `CanViewReports`):
    - Role `Owner` luôn có toàn quyền.
    - Role `Staff` được kiểm tra theo Claim tương ứng (với nhân viên cũ chưa cấu hình claim cụ thể thì mặc định có `schedule.manage` và `payments.manage` để tương thích ngược).
- **Tính lương nhân viên (Staff Payroll)**:
  - Mở rộng `ApplicationUser` với các trường cấu hình lương:
    - `BaseSalary` (`long`, Lương cơ bản/tháng, mặc định `0`)
    - `HourlyRate` (`long`, Lương theo giờ, mặc định `0`)
    - `StandardHoursPerMonth` (`int`, Số giờ công chuẩn/thực tế trong tháng, mặc định `0`)
    - `CommissionPercent` (`decimal`, % thưởng hoa hồng trên doanh thu các booking nhân viên đã tạo hoặc thu tiền, mặc định `0`)
  - Trên trang `/admin/staff`:
    - Form tạo/sửa nhân viên (`StaffForm.cshtml`) cho phép Chủ sân tích chọn **Phân quyền chức năng** và nhập **Cấu hình lương** (Lương cứng, Lương giờ, Giờ công, % Hoa hồng).
    - Trang danh sách & **Bảng tính lương nhân viên** (`/admin/staff` và `/admin/staff/payroll?month=YYYY-MM`): Tự động tính cho từng nhân viên:
      $$\text{Tổng lương} = \text{Lương cơ bản} + (\text{Lương giờ} \times \text{Số giờ công}) + \text{Hoa hồng giao dịch thu tiền/tạo booking trong tháng}$$
    - Hỗ trợ xuất bảng lương ra CSV (`/admin/staff/payroll.csv`).

### 5.7. Hạng mục 7: Sửa giao diện (UI/UX Polish)
- **Public Header (`_PublicNavbar.cshtml`)**:
  - Khi chưa đăng nhập: Hiển thị nút **"Đăng nhập"** (`/account/login`), **"Đăng ký"** (`/account/register`) và CTA **"Đặt sân ngay"**.
  - Khi đã đăng nhập (`Customer`): Hiển thị tên khách hàng, link nhanh **"Lịch đặt của tôi"** (`/account/bookings`) và nút **"Đăng xuất"**; nếu là `Owner`/`Staff` hiển thị thêm lối tắt **"Vào trang Quản trị"** (`/admin/dashboard`).
- **Trang Đặt sân (`Views/Booking/Create.cshtml` & `Success.cshtml`)**:
  - Thiết kế thanh tiến trình 3 bước (*1. Chọn sân & khung giờ → 2. Dịch vụ & Thanh toán → 3. Hoàn tất*).
  - Bổ sung khối chọn **Phương thức thanh toán** dạng thẻ (Card radio) có icon và mô tả rõ ràng.
  - Trang `Success.cshtml` hiển thị hộp hướng dẫn thanh toán VietQR / Ví điện tử trực quan theo phương thức đã chọn.
- **Trang Quản trị (`Schedule`, `Reports`, `Staff`)**:
  - Làm mới bố cục thẻ chỉ số, chú thích màu sắc biểu đồ thác nước, bảng phân quyền dạng badge trực quan và bộ lọc lịch sân gọn gàng.

---

## 6. Phần giao cho Builder quyết định (Left to the Builder)
- Chi tiết CSS utility classes của Tailwind trong các Razor View mới miễn sao tuân thủ hệ thống design token hiện có (`fb-card`, `fb-button`, `fb-input`, `fb-label`, `text-ink`, `text-muted`, `border-line`).
- Cấu trúc chi tiết các helper nội bộ trong `admin-reports.js` và `admin-schedule.js`.
