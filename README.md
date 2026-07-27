# FootballBooking

Hệ thống quản lý và đặt sân bóng mini được xây dựng bằng ASP.NET Core MVC.

Ứng dụng phục vụ đồng thời khách hàng, nhân viên vận hành và chủ sân. Khách có thể xem sân, kiểm tra lịch trống và đặt sân trực tuyến; khu vực nội bộ hỗ trợ quản lý lịch sân, booking, thanh toán, dịch vụ và báo cáo.

## Chức năng chính

### Khách hàng

- Xem danh sách sân bóng.
- Xem thông tin chi tiết từng sân.
- Kiểm tra ngày và khung giờ còn trống.
- Đặt sân không cần đăng nhập.
- Chọn dịch vụ đi kèm.
- Áp dụng mã khuyến mãi.
- Nhận mã booking sau khi đặt sân.
- Tra cứu booking bằng mã đặt sân và số điện thoại.
- Hủy booking theo chính sách của hệ thống.
- Theo dõi số tiền đã thanh toán và số tiền còn lại.

### Nhân viên

- Xem lịch hoạt động của các sân.
- Tạo booking trực tiếp cho khách.
- Theo dõi booking chờ cọc và booking đã xác nhận.
- Ghi nhận tiền cọc và thanh toán.
- Check-in khách hàng.
- Cập nhật trạng thái booking.
- Thêm dịch vụ phát sinh.
- Xử lý khách không đến.
- Theo dõi các booking cần xử lý trong ngày.

### Chủ sân

Chủ sân có toàn bộ quyền của nhân viên và các chức năng bổ sung:

- Quản lý sân bóng.
- Quản lý giờ hoạt động.
- Quản lý thời gian khóa sân và bảo trì.
- Quản lý bảng giá.
- Quản lý dịch vụ.
- Quản lý mã khuyến mãi.
- Quản lý tài khoản nhân viên.
- Xem dashboard doanh thu.
- Xem báo cáo booking.
- Xem hiệu suất sử dụng sân.
- Xuất báo cáo CSV.
- Theo dõi nhật ký hoạt động.

## Công nghệ sử dụng

### Backend

- .NET 10
- C#
- ASP.NET Core MVC
- ASP.NET Core Areas
- ASP.NET Core Identity
- Entity Framework Core 10
- LINQ
- System.Text.Json

### Frontend

- Razor Views
- HTML5
- Tailwind CSS
- Preline UI
- JavaScript
- FullCalendar
- Chart.js
- Heroicons

### Dữ liệu

- SQLite
- Entity Framework Core Migrations
- JSON cho cấu hình, dữ liệu mẫu và API response

### Kiểm thử

- xUnit
- ASP.NET Core Integration Testing
- Microsoft.AspNetCore.Mvc.Testing

## Kiến trúc dự án

Dự án được tổ chức theo mô hình Modular Monolith với các project riêng biệt:

```text
FootballBooking/
├── src/
│   ├── FootballBooking.Web/
│   ├── FootballBooking.Application/
│   ├── FootballBooking.Domain/
│   └── FootballBooking.Infrastructure/
├── tests/
│   └── FootballBooking.Tests/
├── docs/
├── FootballBooking.slnx
├── package.json
├── package-lock.json
└── README.md
```

### Vai trò của từng project

| Project | Chức năng |
|---|---|
| `FootballBooking.Web` | Controller, Razor View, ViewModel, route và giao diện |
| `FootballBooking.Application` | Service, DTO, interface và nghiệp vụ ứng dụng |
| `FootballBooking.Domain` | Entity, enum và quy tắc nghiệp vụ cốt lõi |
| `FootballBooking.Infrastructure` | Entity Framework Core, Identity, lưu trữ dữ liệu và seed |
| `FootballBooking.Tests` | Unit test và integration test |

## Quy tắc nghiệp vụ chính

### Chống trùng lịch

Hai booking bị xem là trùng nhau khi:

```text
newStart < existingEnd
và
newEnd > existingStart
```

Hai booking nằm sát nhau vẫn được chấp nhận.

Ví dụ:

```text
17:00–18:00
18:00–19:00
```

### Trạng thái booking

Các trạng thái chính:

- Chờ thanh toán
- Đã xác nhận
- Đã check-in
- Đang sử dụng
- Hoàn thành
- Đã hủy
- Khách không đến
- Hết hạn

### Trạng thái thanh toán

Trạng thái booking và trạng thái thanh toán được quản lý độc lập:

- Chưa thanh toán
- Đã thanh toán một phần
- Đã thanh toán đủ
- Đang hoàn tiền
- Đã hoàn tiền một phần
- Đã hoàn tiền
- Thanh toán thất bại

### Lưu trữ tiền

Giá trị tiền được lưu bằng kiểu `long` theo đơn vị Việt Nam đồng.

Ví dụ:

```text
200000 = 200.000 ₫
```

### Ngày và thời gian

Booking được lưu bằng:

- Ngày đặt sân.
- Phút bắt đầu trong ngày.
- Phút kết thúc trong ngày.

Cách lưu này giúp kiểm tra giao nhau giữa các khung giờ đơn giản và chính xác.

## Yêu cầu môi trường

Cần cài đặt:

- .NET 10 SDK
- Node.js LTS
- npm
- Git
- EF Core CLI

Cài EF Core CLI:

```powershell
dotnet tool install --global dotnet-ef
```

## Cài đặt dự án

Clone repository:

```powershell
git clone https://github.com/vdtrong2051/FootballBooking.git
cd FootballBooking
```

Khôi phục package .NET:

```powershell
dotnet restore
```

Cài package frontend:

```powershell
npm install
```

Build frontend:

```powershell
npm run build
```

## Cấu hình tài khoản quản trị local

Dự án sử dụng .NET Secret Manager để lưu thông tin tài khoản quản trị trong môi trường phát triển.

Khởi tạo Secret Manager:

```powershell
dotnet user-secrets init --project src/FootballBooking.Web
```

Thiết lập tài khoản Owner:

```powershell
dotnet user-secrets set "SeedOwner:Email" "owner@example.local" --project src/FootballBooking.Web
dotnet user-secrets set "SeedOwner:Password" "ChangeThisLocalOnly!123" --project src/FootballBooking.Web
```

Không commit mật khẩu thật hoặc file chứa thông tin bí mật lên GitHub.

## Database

Connection string local mặc định:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=App_Data/football-booking.db"
  }
}
```

Tạo migration:

```powershell
dotnet ef migrations add InitialCreate `
  --project src/FootballBooking.Infrastructure `
  --startup-project src/FootballBooking.Web
```

Áp dụng migration:

```powershell
dotnet ef database update `
  --project src/FootballBooking.Infrastructure `
  --startup-project src/FootballBooking.Web
```

File SQLite local:

```text
src/FootballBooking.Web/App_Data/football-booking.db
```

Database local không được commit lên GitHub.

## Tạo dữ liệu mẫu

Chạy ứng dụng với tham số seed:

```powershell
dotnet run `
  --project src/FootballBooking.Web `
  -- --seed-development-data
```

Dữ liệu mẫu gồm:

- Sân bóng.
- Khung giờ hoạt động.
- Dịch vụ.
- Mã khuyến mãi.
- Tài khoản nội bộ được cấu hình bằng Secret Manager.

Seed dữ liệu chỉ được phép chạy trong môi trường `Development`.

## Chạy ứng dụng

### Cách 1: chạy frontend và backend riêng

Terminal thứ nhất:

```powershell
npm run dev
```

Terminal thứ hai:

```powershell
dotnet watch --project src/FootballBooking.Web
```

### Cách 2: build frontend trước

```powershell
npm run build
dotnet run --project src/FootballBooking.Web
```

Sau khi ứng dụng khởi động, terminal sẽ hiển thị địa chỉ đang lắng nghe, ví dụ:

```text
http://localhost:5100
```

## Các URL chính

### Website khách hàng

```text
/
```

```text
/fields
```

```text
/booking
```

```text
/booking/lookup
```

### Khu vực nội bộ

```text
/admin/login
```

```text
/admin/dashboard
```

```text
/admin/schedule
```

```text
/admin/bookings
```

```text
/admin/payments
```

```text
/admin/fields
```

```text
/admin/pricing
```

```text
/admin/services
```

```text
/admin/promotions
```

```text
/admin/reports
```

```text
/admin/staff
```

```text
/admin/activity-logs
```

Website công khai không hiển thị liên kết đăng nhập quản trị. Chủ sân và nhân viên truy cập trực tiếp `/admin/login`.

## Chạy kiểm thử

Build solution:

```powershell
dotnet build
```

Chạy toàn bộ test:

```powershell
dotnet test
```

Chạy test ở chế độ Release:

```powershell
dotnet build -c Release
dotnet test -c Release --no-build
```

Xuất kết quả test:

```powershell
dotnet test `
  --logger "trx;LogFileName=FootballBooking.trx" `
  --results-directory TestResults
```

Các nhóm nghiệp vụ được kiểm thử gồm:

- Chống trùng booking.
- Cho phép hai booking nằm sát nhau.
- Kiểm tra thời gian khóa sân.
- Tính giá theo nhiều khoảng thời gian.
- Áp dụng dịch vụ và khuyến mãi.
- Đặt sân không cần tài khoản.
- Ghi nhận tiền cọc.
- Chuyển trạng thái vận hành.
- Phân quyền khu vực quản trị.
- Kiểm tra các route công khai và nội bộ.

## Build trước khi commit

```powershell
dotnet restore
dotnet build --no-restore
dotnet test --no-build
npm run build
git status
```

## Tài liệu dự án

Các tài liệu chi tiết nằm trong thư mục `docs`:

- [Đặc tả dự án](docs/PROJECT_SPEC.md)
- [Kiến trúc hệ thống](docs/ARCHITECTURE.md)
- [Thiết kế cơ sở dữ liệu](docs/DATABASE.md)
- [Quy tắc nghiệp vụ](docs/BUSINESS_RULES.md)
- [Route và giao diện](docs/UI_ROUTES.md)
- [Kiểm thử](docs/TESTING.md)
- [Kế hoạch triển khai](docs/IMPLEMENTATION_PLAN.md)
- [Hướng dẫn cài đặt](docs/SETUP_AND_RUN.md)

## Trạng thái dự án

Dự án hiện đã có:

- Cấu trúc solution hoàn chỉnh.
- Website khách hàng.
- Khu vực quản trị bằng ASP.NET Core Area.
- Quản lý sân và lịch hoạt động.
- Luồng đặt sân công khai.
- Chống trùng booking.
- Dịch vụ và mã khuyến mãi.
- Thanh toán và đặt cọc.
- Dashboard và báo cáo.
- Unit test và integration test.

Các phần đang tiếp tục hoàn thiện:

- Tối ưu trải nghiệm thao tác của nhân viên.
- Hoàn thiện luồng xác minh chuyển khoản.
- Bổ sung ảnh giao diện.
- Đóng gói Docker.
- Cấu hình database cho môi trường triển khai.
- Triển khai bản demo trực tuyến.

## Giấy phép

Dự án được phát triển phục vụ mục đích học tập, thực hành kỹ thuật phần mềm và xây dựng portfolio.
