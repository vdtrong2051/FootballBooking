# FootballBooking

Hệ thống quản lý và đặt sân bóng mini dành cho các cơ sở kinh doanh sân thể thao.

FootballBooking cung cấp website đặt sân trực tuyến cho khách hàng và khu vực vận hành nội bộ cho chủ sân, nhân viên. Hệ thống tập trung vào quản lý lịch sân, chống trùng booking, đặt cọc, thanh toán, dịch vụ phát sinh và báo cáo hoạt động.

## Tổng quan

Một lượt đặt sân được xử lý xuyên suốt từ lúc khách chọn giờ đến khi hoàn thành:

```text
Khách chọn sân và khung giờ
→ Hệ thống kiểm tra lịch trống
→ Tạo yêu cầu giữ sân
→ Ghi nhận tiền cọc
→ Xác nhận booking
→ Check-in
→ Ghi nhận dịch vụ phát sinh
→ Thanh toán phần còn lại
→ Hoàn thành
```

Hệ thống phục vụ ba nhóm người dùng:

- **Khách hàng:** xem sân, kiểm tra lịch trống, đặt sân và tra cứu booking.
- **Nhân viên:** quản lý lịch vận hành, booking, check-in và thanh toán.
- **Chủ sân:** quản lý toàn bộ hệ thống, nhân viên, bảng giá và báo cáo.

## Chức năng nổi bật

### Đặt sân trực tuyến

- Xem danh sách và thông tin chi tiết sân.
- Kiểm tra khung giờ còn trống theo ngày.
- Đặt sân không cần tài khoản.
- Chọn dịch vụ đi kèm.
- Áp dụng mã khuyến mãi.
- Nhận mã booking để tra cứu.
- Hủy booking theo chính sách.

### Quản lý lịch sân

- Hiển thị lịch vận hành tập trung bằng FullCalendar.
- Theo dõi booking theo sân, ngày và trạng thái.
- Tạo booking trực tiếp cho khách gọi điện hoặc đến tại quầy.
- Khóa sân theo khung giờ bảo trì hoặc sự kiện nội bộ.
- Ngăn tạo booking trùng thời gian.
- Cho phép các booking nằm sát nhau nhưng không giao nhau.

### Vận hành booking

- Theo dõi booking chờ cọc, đã xác nhận và đang sử dụng.
- Ghi nhận đặt cọc hoặc thanh toán toàn bộ.
- Check-in khách hàng.
- Chuyển trạng thái theo đúng trình tự vận hành.
- Thêm dịch vụ phát sinh.
- Xử lý booking hết hạn, bị hủy hoặc khách không đến.
- Lưu lịch sử thanh toán và thay đổi trạng thái.

### Quản trị và báo cáo

- Quản lý sân và giờ hoạt động.
- Quản lý bảng giá theo ngày và khung giờ.
- Quản lý dịch vụ và số lượng khả dụng.
- Quản lý chương trình khuyến mãi.
- Quản lý tài khoản nhân viên.
- Theo dõi doanh thu và số lượng booking.
- Phân tích hiệu suất sử dụng sân.
- Xuất báo cáo CSV.
- Theo dõi nhật ký hoạt động.

## Quy tắc nghiệp vụ

### Chống trùng booking

Hai booking được xem là giao nhau khi:

```text
newStart < existingEnd
&&
newEnd > existingStart
```

Ví dụ sau vẫn hợp lệ vì hai booking chỉ nằm sát nhau:

```text
17:00–18:00
18:00–19:00
```

Việc kiểm tra lịch được thực hiện lại tại backend trước khi ghi dữ liệu.

### Trạng thái booking và thanh toán

Trạng thái vận hành và trạng thái thanh toán được quản lý độc lập.

Một booking có thể:

- Đã xác nhận nhưng mới thanh toán một phần.
- Đang sử dụng nhưng vẫn còn số tiền phải thu.
- Đã hủy và đang chờ hoàn tiền.
- Hết hạn vì khách không đặt cọc đúng thời gian.

Cách tổ chức này giúp phản ánh chính xác hoạt động thực tế của cơ sở sân bóng.

### Tính giá

Giá sân có thể thay đổi theo:

- Ngày thường.
- Cuối tuần.
- Ngày đặc biệt.
- Khung giờ cao điểm.
- Khoảng thời gian hiệu lực của bảng giá.

Khi booking đi qua nhiều khung giá, hệ thống chia thời gian thành từng đoạn và tính tiền tương ứng.

## Phân quyền

| Chức năng | Chủ sân | Nhân viên |
|---|:---:|:---:|
| Xem lịch sân | ✓ | ✓ |
| Tạo và xử lý booking | ✓ | ✓ |
| Ghi nhận thanh toán | ✓ | ✓ |
| Check-in và hoàn thành booking | ✓ | ✓ |
| Quản lý sân | ✓ | Hạn chế |
| Quản lý bảng giá | ✓ | — |
| Quản lý khuyến mãi | ✓ | — |
| Quản lý nhân viên | ✓ | — |
| Xem đầy đủ báo cáo tài chính | ✓ | — |
| Xem nhật ký hoạt động | ✓ | — |

## Kiến trúc hệ thống

Dự án được tổ chức theo hướng Modular Monolith:

```text
FootballBooking/
├── src/
│   ├── FootballBooking.Web/
│   ├── FootballBooking.Application/
│   ├── FootballBooking.Domain/
│   └── FootballBooking.Infrastructure/
├── tests/
│   └── FootballBooking.Tests/
└── docs/
```

| Thành phần | Trách nhiệm |
|---|---|
| `FootballBooking.Web` | ASP.NET Core MVC, Razor Views, Area quản trị và giao diện |
| `FootballBooking.Application` | Dịch vụ ứng dụng, DTO, interface và xử lý nghiệp vụ |
| `FootballBooking.Domain` | Entity, enum và quy tắc cốt lõi |
| `FootballBooking.Infrastructure` | Entity Framework Core, Identity, repository và seed dữ liệu |
| `FootballBooking.Tests` | Unit test và integration test |

Controller chỉ tiếp nhận request, kiểm tra dữ liệu đầu vào và điều phối service. Nghiệp vụ đặt sân, tính giá, thanh toán và chuyển trạng thái được xử lý tại tầng Application.

## Công nghệ

### Backend

- .NET 10
- ASP.NET Core MVC
- Entity Framework Core 10
- ASP.NET Core Identity
- C#
- LINQ

### Frontend

- Razor Views
- Tailwind CSS
- Preline UI
- JavaScript
- FullCalendar
- Chart.js
- Heroicons

### Dữ liệu và kiểm thử

- MySQL 8.4+
- Pomelo Entity Framework Core provider
- Entity Framework Core Migrations
- xUnit
- ASP.NET Core Integration Testing
- Microsoft.AspNetCore.Mvc.Testing

## Các route chính

### Website khách hàng

```text
/
/fields
/booking
/booking/lookup
```

### Khu vực nội bộ

```text
/admin/login
/admin/dashboard
/admin/schedule
/admin/bookings
/admin/payments
/admin/fields
/admin/pricing
/admin/services
/admin/promotions
/admin/reports
/admin/staff
/admin/activity-logs
```

Khu vực quản trị không được hiển thị trực tiếp trên thanh điều hướng công khai.

## Kiểm thử

Bộ kiểm thử hiện bao phủ các nghiệp vụ quan trọng:

- Đặt sân không cần tài khoản.
- Chống trùng booking.
- Cho phép hai booking nằm sát nhau.
- Kiểm tra thời gian khóa sân.
- Tính giá qua nhiều khoảng thời gian.
- Áp dụng dịch vụ và khuyến mãi.
- Ghi nhận đặt cọc.
- Chuyển trạng thái booking.
- Phân quyền route quản trị.
- Seed dữ liệu không bị lặp.

Kết quả kiểm thử gần nhất:

```text
Total tests: 38
Passed: 38
Failed: 0
Skipped: 0
```

## Chạy dự án cục bộ

Yêu cầu:

- .NET 10 SDK
- Node.js và npm

```powershell
git clone https://github.com/vdtrong2051/FootballBooking.git
cd FootballBooking

dotnet restore
npm install
npm run build
dotnet run --project src/FootballBooking.Web
```

Tài khoản quản trị và mật khẩu phát triển được cấu hình bằng .NET Secret Manager, không lưu trong repository.

## Trạng thái phát triển

Các phần cốt lõi đã hoàn thành:

- Website xem và đặt sân.
- Lịch vận hành nội bộ.
- Quản lý sân, dịch vụ và khuyến mãi.
- Đặt cọc và thanh toán.
- Phân quyền Owner và Staff.
- Dashboard và báo cáo.
- Unit test và integration test.

Các phần đang tiếp tục hoàn thiện:

- Tối ưu trải nghiệm thao tác của nhân viên.
- Xác minh chuyển khoản thủ công.
- Bổ sung ảnh và video minh họa.
- Hỗ trợ database theo môi trường triển khai.
- Docker hóa và triển khai bản demo trực tuyến.

## Tài liệu

Tài liệu phân tích và thiết kế chi tiết được lưu trong thư mục [`docs`](docs):

- Đặc tả dự án.
- Kiến trúc hệ thống.
- Thiết kế cơ sở dữ liệu.
- Quy tắc nghiệp vụ.
- Thiết kế route và giao diện.
- Chiến lược kiểm thử.

## Mục đích dự án

FootballBooking được phát triển nhằm thực hành xây dựng một hệ thống web có nghiệp vụ hoàn chỉnh, phân tầng rõ ràng và mô phỏng quy trình vận hành thực tế của một cơ sở kinh doanh sân bóng.
