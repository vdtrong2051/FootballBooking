# PROJECT SPECIFICATION

## 1. Thông tin chung

### 1.1. Tên dự án

**Football Field Booking & Management System**  
**Hệ thống quản lý và đặt sân bóng mini**

### 1.2. Loại hệ thống

Ứng dụng web phục vụ đồng thời:

- Website giới thiệu và đặt sân cho khách hàng.
- Hệ thống quản trị nội bộ cho chủ sân và nhân viên.

Hệ thống là một ứng dụng ASP.NET Core MVC duy nhất, dùng chung backend và MySQL nhưng tách giao diện bằng route và ASP.NET Core Area.

### 1.3. Mục tiêu kinh doanh

- Tăng khả năng tiếp nhận booking trực tuyến.
- Cho khách biết chính xác sân và giờ còn trống.
- Giảm đặt trùng lịch do ghi chép thủ công.
- Quản lý thống nhất booking từ website, điện thoại, quầy và tin nhắn.
- Theo dõi tiền cọc, thanh toán còn lại và dịch vụ phát sinh.
- Giúp chủ sân theo dõi doanh thu và hiệu suất khai thác.
- Ghi nhận trách nhiệm thao tác của nhân viên.

### 1.4. Vấn đề hiện tại cần giải quyết

- Booking nằm rải rác trong sổ, Excel, Zalo, Facebook và điện thoại.
- Nhân viên không có một lịch chung đáng tin cậy.
- Giá thay đổi theo ngày và giờ nhưng tính thủ công.
- Không kiểm soát rõ booking chờ cọc, đã cọc hay đã thanh toán đủ.
- Khó thống kê giờ cao điểm, giờ thấp điểm và tỷ lệ hủy.
- Khó xác định ai đã sửa hoặc hủy một booking.

---

## 2. Phạm vi phiên bản đầu

### 2.1. Trong phạm vi

- Website công khai.
- Danh sách và chi tiết sân.
- Giờ hoạt động và bảng giá.
- Lịch trống.
- Guest booking không cần tài khoản.
- Tài khoản khách hàng tùy chọn.
- Hai vai trò nội bộ: Owner và Staff.
- Admin Area tại `/admin`.
- Quản lý sân, bảo trì và khóa sân.
- Booking lifecycle.
- Chống trùng lịch.
- Dịch vụ đi kèm.
- Khuyến mãi cơ bản.
- Thanh toán tiền mặt và chuyển khoản được ghi nhận thủ công.
- Tra cứu booking.
- Hủy booking theo chính sách.
- Dashboard và báo cáo cơ bản.
- Xuất CSV.
- Nhật ký hoạt động.

### 2.2. Ngoài phạm vi phiên bản đầu

- Ứng dụng di động native.
- Nhiều cơ sở hoặc nhượng quyền.
- Hệ thống kho hoàn chỉnh.
- Kế toán hai chiều.
- Hóa đơn điện tử pháp lý.
- Tích hợp ngân hàng tự động.
- Tích hợp Zalo hoặc SMS thật.
- Hoàn tiền tự động qua cổng thanh toán.
- Giá động bằng máy học.
- Microservices.

Các chức năng ngoài phạm vi có thể dùng mock hoặc interface để chuẩn bị mở rộng nhưng không được làm phình phiên bản đầu.

---

## 3. Đối tượng sử dụng

### 3.1. Khách vãng lai

Không có tài khoản.

Có thể:

- Xem sân và thông tin dịch vụ.
- Chọn ngày và xem khung giờ trống.
- Tạo booking bằng tên và số điện thoại.
- Chọn dịch vụ và mã giảm giá.
- Chọn cách thanh toán được hỗ trợ.
- Nhận mã booking.
- Tra cứu một booking bằng mã booking và số điện thoại.
- Hủy booking nếu đủ điều kiện và xác thực theo yêu cầu.

Không thể:

- Xem toàn bộ lịch sử chỉ bằng số điện thoại.
- Truy cập khu vực nội bộ.
- Xem dữ liệu của người khác.

### 3.2. Customer

Là khách có tài khoản.

Có thể:

- Thực hiện toàn bộ chức năng của khách vãng lai.
- Lưu hồ sơ cá nhân.
- Xem booking của tài khoản.
- Xem thanh toán và thông báo của mình.
- Đặt sân nhanh hơn.

Tài khoản Customer không bắt buộc để tạo booking.

### 3.3. Staff

Nhân viên vận hành.

Có thể:

- Xem tổng quan công việc hôm nay.
- Xem lịch sân.
- Tìm booking.
- Tạo booking hộ khách.
- Xác nhận booking.
- Check-in khách.
- Chuyển booking sang đang sử dụng và hoàn tất.
- Ghi nhận khách không đến.
- Ghi nhận tiền cọc, thanh toán và dịch vụ phát sinh.
- Hủy booking theo chính sách và quyền được cấp cố định.
- Gửi lại thông tin booking.

Không thể:

- Quản lý tài khoản nhân viên.
- Sửa bảng giá.
- Sửa chính sách hệ thống.
- Xem báo cáo tài chính toàn diện.
- Thực hiện hoàn tiền tùy ý.
- Xóa audit log.

### 3.4. Owner

Chủ sân.

Có toàn bộ quyền của Staff và:

- Quản lý sân và hình ảnh.
- Quản lý giờ hoạt động.
- Quản lý khóa sân và bảo trì.
- Quản lý bảng giá.
- Quản lý dịch vụ.
- Quản lý mã giảm giá.
- Quản lý tài khoản nhân viên.
- Duyệt và ghi nhận hoàn tiền.
- Xem dashboard tài chính.
- Xem và xuất báo cáo.
- Xem nhật ký hoạt động.
- Quản lý cấu hình nghiệp vụ.

---

## 4. Hai khu vực giao diện

### 4.1. Website công khai

URL gốc:

```text
/
```

Mục đích:

- Giới thiệu sân.
- Chuyển đổi khách thành booking.
- Cung cấp tra cứu và tài khoản khách.

Header không có nút “Admin Login”.

### 4.2. Khu vực quản trị

URL gốc:

```text
/admin
```

Đăng nhập:

```text
/admin/login
```

Chỉ Owner và Staff được truy cập.

Nếu chưa đăng nhập và truy cập `/admin/*`, chuyển đến `/admin/login`.

Nếu Customer đăng nhập tại cổng quản trị, từ chối với thông báo không có quyền.

---

## 5. Module chức năng

### 5.1. Authentication và tài khoản

- Đăng ký Customer.
- Đăng nhập Customer.
- Đăng nhập nội bộ.
- Đăng xuất.
- Đổi và quên mật khẩu.
- Khóa/mở tài khoản Staff.
- Role-based authorization.
- Ghi nhận thời điểm đăng nhập cuối.

### 5.2. Quản lý sân

Thông tin sân:

- Mã sân.
- Tên sân.
- Slug.
- Loại sân.
- Sức chứa.
- Mô tả.
- Địa chỉ.
- Tiện ích.
- Hình ảnh.
- Thời lượng booking tối thiểu.
- Trạng thái.

Chức năng:

- Thêm và cập nhật sân.
- Quản lý hình ảnh.
- Kích hoạt, tạm đóng, bảo trì hoặc ngừng khai thác.
- Không xóa cứng sân đã có lịch sử.

### 5.3. Giờ hoạt động

- Cấu hình theo từng thứ trong tuần.
- Đánh dấu ngày đóng cửa.
- Kiểm tra booking nằm trong giờ hoạt động.
- Cho phép ngày đặc biệt thông qua FieldBlock hoặc PricingRule cụ thể.

### 5.4. Khóa sân và bảo trì

- Khóa theo sân, ngày và khoảng phút.
- Loại: Maintenance, InternalEvent, Weather, TechnicalIssue, BusinessClosure, Other.
- Cảnh báo booking bị ảnh hưởng.
- Không cho tạo booking mới trong khoảng khóa.

### 5.5. Bảng giá

- Giá ngày thường.
- Giá cuối tuần.
- Giá ngày lễ hoặc ngày cụ thể.
- Giá theo khung giờ.
- Khoảng hiệu lực.
- Độ ưu tiên.
- Tính theo từng đoạn khi booking đi qua nhiều mức giá.

### 5.6. Dịch vụ đi kèm

- Nước uống.
- Bóng.
- Áo bib.
- Giày.
- Trọng tài.
- Quay video.
- Các dịch vụ khác.

Mỗi booking lưu bản chụp tên và đơn giá dịch vụ tại thời điểm chọn.

### 5.7. Mã giảm giá

- Giảm phần trăm hoặc số tiền cố định.
- Ngày bắt đầu/kết thúc.
- Tổng lượt sử dụng.
- Giới hạn theo số điện thoại.
- Booking tối thiểu.
- Mức giảm tối đa.
- Có thể giới hạn sân, ngày hoặc khung giờ.

### 5.8. Booking

Booking hỗ trợ các nguồn:

- GuestWeb.
- CustomerAccount.
- Staff.
- Owner.
- WalkIn.

Thông tin chính:

- Mã booking.
- Snapshot tên, số điện thoại và email.
- CustomerUserId tùy chọn.
- Sân.
- Ngày.
- StartMinute và EndMinute.
- Các khoản tiền.
- Trạng thái booking.
- Trạng thái thanh toán.
- Thời hạn giữ chỗ.
- Người tạo nội bộ nếu có.

### 5.9. Thanh toán

- Một booking có nhiều payment.
- Ghi nhận tiền mặt hoặc chuyển khoản.
- Có thể đặt cọc, trả thêm và hoàn tiền.
- Không dùng một cờ `IsPaid` đơn giản.
- Payment status được tính từ giao dịch hợp lệ.

### 5.10. Thông báo

Phiên bản đầu:

- Lưu thông báo trong database.
- Có thể gửi email khi cấu hình.
- Giao diện hiển thị trạng thái chờ gửi, thành công hoặc thất bại.

### 5.11. Dashboard và báo cáo

Owner:

- Doanh thu hôm nay và tháng.
- Số booking.
- Số giờ sử dụng.
- Tỷ lệ sử dụng sân.
- Tiền chưa thu.
- Tỷ lệ hủy và no-show.
- Doanh thu dịch vụ.
- Giờ cao điểm.

Staff:

- Lịch hôm nay.
- Booking sắp bắt đầu.
- Booking chờ xử lý.
- Khách còn nợ.
- Dịch vụ cần chuẩn bị.

### 5.12. Nhật ký hoạt động

Ghi append-only cho hành động quan trọng, gồm actor, action, entity, before/after JSON, thời gian UTC, IP, user agent và correlation ID.

---

## 6. Luồng nghiệp vụ chính

### 6.1. Guest booking

```text
Trang chủ
→ Chọn sân
→ Chọn ngày
→ Xem slot trống
→ Chọn giờ
→ Chọn dịch vụ
→ Nhập tên và số điện thoại
→ Áp mã giảm giá
→ Backend kiểm tra lại
→ Tạo PendingPayment
→ Thanh toán/đặt cọc hoặc chọn trả tại sân nếu được phép
→ Confirmed
→ Nhận mã booking
```

### 6.2. Staff tạo booking hộ

```text
/admin/schedule
→ Chọn khoảng trống
→ Nhập thông tin khách
→ Chọn dịch vụ
→ Ghi nhận cọc hoặc thanh toán
→ Confirmed
→ Gửi mã booking
```

### 6.3. Vận hành tại sân

```text
Confirmed
→ CheckedIn
→ InProgress
→ Completed
```

Có thể chuyển `Confirmed → NoShow` khi khách không đến theo chính sách.

### 6.4. Hủy booking

```text
Tra cứu / mở booking
→ Kiểm tra quyền và trạng thái
→ Kiểm tra thời gian còn lại
→ Tính phí hủy
→ Xác nhận
→ Cancelled
→ Tạo yêu cầu hoặc giao dịch hoàn tiền nếu cần
→ Gửi thông báo
```

---

## 7. Yêu cầu phi chức năng

### 7.1. Bảo mật

- Identity quản lý mật khẩu và cookie.
- Authorization ở server.
- Antiforgery cho form thay đổi dữ liệu.
- Rate limiting cho login, lookup và OTP.
- Không commit secrets.
- Không trả Entity trực tiếp qua API.

### 7.2. Hiệu năng

- Pagination cho bảng lớn.
- Chỉ tải event trong khoảng FullCalendar yêu cầu.
- Index theo field/date/status/phone.
- Tránh N+1 queries.
- Async EF Core.

### 7.3. Khả năng sử dụng

- Responsive.
- Guest booking tối ưu điện thoại.
- Lịch nội bộ ưu tiên desktop nhưng thao tác cốt lõi dùng được trên mobile.
- Mọi status có chữ và màu.
- Có loading, empty và error state.

### 7.4. Khả năng mở rộng

- MySQL là database server chính; có thể mở rộng nhiều web instance.
- Cô lập SQL đặc thù MySQL trong Infrastructure.
- Tách external notification/payment qua interface.
- Tách external notification/payment qua interface.
- Không triển khai nhiều cơ sở trong v1 nhưng tránh hard-code tên cơ sở ở logic.

---

## 8. Tiêu chí hoàn thành MVP

MVP đạt yêu cầu khi:

- Owner và Staff đăng nhập được tại `/admin/login`.
- Owner quản lý được sân, giờ hoạt động và giá.
- Khách xem được slot trống.
- Khách đặt được không cần tài khoản.
- Hai booking không thể chiếm cùng một sân và thời gian.
- Staff tạo và xử lý booking được.
- Thanh toán được ghi nhận và tổng tiền đúng.
- Khách tra cứu bằng mã booking và số điện thoại.
- Owner xem dashboard cơ bản và xuất CSV.
- Hành động quan trọng có audit log.
- Build và test tự động vượt qua.
