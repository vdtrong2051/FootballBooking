# BUSINESS RULES

Các rule có mã cố định để dùng trong code review, test và task Codex.

---

## BR-001 — Field availability prerequisites

Một sân chỉ có thể nhận booking khi:

- `Field.Status == Active`.
- Ngày đó không đóng cửa theo `FieldOperatingHours`.
- Khoảng giờ nằm hoàn toàn trong giờ hoạt động.
- Không giao với `FieldBlock`.
- Không giao với booking đang chiếm lịch.

UI không được coi là nguồn sự thật. Backend phải kiểm tra lại.

---

## BR-002 — Valid booking interval

```text
0 <= StartMinute < EndMinute <= 1440
```

Thời lượng:

```text
EndMinute - StartMinute >= Field.MinimumBookingMinutes
```

StartMinute và EndMinute phải theo bước slot của sân nếu `SlotStepMinutes` được áp dụng.

Ví dụ step 30:

- 18:00 hợp lệ.
- 18:30 hợp lệ.
- 18:10 không hợp lệ.

---

## BR-003 — Booking overlap

Hai khoảng trùng khi:

```text
newStartMinute < existingEndMinute
&& newEndMinute > existingStartMinute
```

Các khoảng sát nhau hợp lệ:

```text
08:00–09:00
09:00–10:00
```

Booking chiếm lịch khi:

- PendingPayment và `ExpiresAtUtc > UtcNow`.
- Confirmed.
- CheckedIn.
- InProgress.

Booking không chiếm lịch khi:

- Cancelled.
- Expired.
- NoShow.
- Completed.
- PendingPayment đã hết hạn.

Completed không chiếm slot tương lai nhưng vẫn là lịch sử. Query ngày quá khứ vẫn hiển thị event nếu cần; availability không coi nó là xung đột mới vì không thể đặt vào quá khứ.

---

## BR-004 — Past booking prevention

Khách và nhân viên không được tạo booking bắt đầu trong quá khứ theo business time zone.

Owner chỉ được tạo dữ liệu quá khứ thông qua công cụ import/admin đặc biệt nếu chức năng đó được triển khai rõ ràng; không cho phép trong form booking thường.

---

## BR-005 — Temporary hold

Guest/customer booking trực tuyến tạo trạng thái `PendingPayment` khi cần giữ chỗ.

- `ExpiresAtUtc = UtcNow + HoldMinutes`.
- Hold còn hạn chiếm lịch.
- Hết hạn chuyển `Expired` hoặc được query như expired trước khi job cập nhật.
- Không được gia hạn vô hạn.
- HoldMinutes lấy từ cấu hình, mặc định 10.

Nếu phương thức “trả tại sân” được phép và không cần cọc, booking có thể chuyển thẳng `Confirmed`.

---

## BR-006 — MySQL booking write coordination

Khi tạo booking cho cùng `FieldId + BookingDate`:

1. Lấy MySQL advisory lock bằng khóa nghiệp vụ.
2. Query lại active overlap sau khi đã giữ lock.
3. Tính lại giá và promo.
4. Insert booking và usage.
5. SaveChanges.
6. Nhả lock cùng connection đã giữ lock.

Nếu không lấy được lock trong timeout hợp lý, trả thông báo thử lại. Advisory lock nằm ở database server nên phối hợp được giữa nhiều web instance dùng cùng MySQL.

---

## BR-007 — Operating hours

Booking phải nằm hoàn toàn trong giờ hoạt động của sân cho ngày đó.

Nếu ngày `IsClosed`, không có slot.

Không cho booking qua nửa đêm trong phiên bản đầu.

---

## BR-008 — Field blocks

Một field block giao booking theo cùng công thức overlap.

BlockType không thay đổi hành vi chặn; chỉ phục vụ lý do và báo cáo.

Khi tạo block giao booking hiện có:

- Không tự hủy booking.
- Hiển thị danh sách booking bị ảnh hưởng.
- Owner phải xử lý hoặc xác nhận quy trình riêng.
- Staff chỉ được tạo block nếu scope quyền cho phép; mặc định Owner quản lý.

---

## BR-009 — Pricing rule eligibility

Một pricing rule hợp lệ khi:

- Đúng FieldId.
- IsActive.
- BookingDate nằm trong EffectiveFrom/EffectiveTo.
- Đúng SpecificDate hoặc DayOfWeek/RuleType.
- Khoảng giá giao với booking interval.

Ưu tiên đề xuất:

```text
SpecificDate / SpecialRange
> Holiday
> Weekend
> Weekday
```

`Priority` số lớn thắng.

Nếu hai rule cùng priority cùng bao phủ một phút và cho giá khác nhau, cấu hình không hợp lệ; PricingService không được chọn ngẫu nhiên.

---

## BR-010 — Pricing across intervals

Nếu booking đi qua nhiều khung giá, chia thành các đoạn liên tục.

Ví dụ:

```text
17:00–18:00: 200,000 VND/giờ
18:00–20:00: 300,000 VND/giờ
Booking 17:30–19:00
```

Kết quả:

- 30 phút × 200,000/giờ.
- 60 phút × 300,000/giờ.

Tính theo phút:

```text
segmentAmount = PricePerHour * segmentMinutes / 60
```

Quy tắc làm tròn phải thống nhất. Với giá VND và slot chia hết hợp lý, ưu tiên cấu hình tránh số lẻ; nếu phát sinh, làm tròn đến VND gần nhất theo `MidpointRounding.AwayFromZero`.

Lưu CourtAmount snapshot trong booking.

---

## BR-011 — Service pricing snapshot

Mỗi BookingService lưu:

- Tên.
- Mã.
- Đơn vị.
- Đơn giá.
- Số lượng.
- LineTotal.

Sửa giá Service sau này không thay booking cũ.

```text
LineTotal = UnitPrice × Quantity
```

Quantity phải > 0.

---

## BR-012 — Promotion validation

Promotion chỉ áp dụng khi:

- Active.
- Trong thời gian hiệu lực.
- Chưa vượt total usage limit.
- Chưa vượt per-phone usage limit.
- Đạt minimum order amount.
- Đúng sân/khung giờ nếu có giới hạn.

Mỗi booking tối đa một promo trong v1.

Promotion được kiểm tra lại trong transaction.

---

## BR-013 — Percentage discount

Đề xuất lưu phần trăm bằng basis points:

```text
1500 = 15.00%
10000 = 100.00%
```

```text
rawDiscount = eligibleAmount × basisPoints / 10000
```

Áp `MaximumDiscountAmount` nếu có.

Discount không vượt eligible amount.

---

## BR-014 — Fixed discount

Fixed discount không vượt eligible amount.

```text
DiscountAmount = min(FixedAmount, EligibleAmount)
```

---

## BR-015 — Booking total

Trong booking bình thường:

```text
Subtotal = CourtAmount + ServiceAmount
TotalAmount = max(0, Subtotal - DiscountAmount)
```

Cancellation fee và refund được xử lý riêng; nếu mô hình lưu cancellation fee trong Booking thì total obligation phải được mô tả nhất quán và test.

Không lấy tổng tiền từ client.

---

## BR-016 — Guest booking identity

Guest booking:

- CustomerUserId = null.
- Bắt buộc CustomerName và CustomerPhone.
- Lưu CustomerPhoneNormalized.
- BookingSource = GuestWeb hoặc WalkIn.

Không tự tạo tài khoản Customer từ guest booking.

---

## BR-017 — Customer account booking

Nếu Customer đã đăng nhập:

- CustomerUserId = current user ID.
- Vẫn lưu snapshot tên, phone, email trong booking.
- Thay đổi profile sau này không thay snapshot booking cũ.

---

## BR-018 — Staff-created booking

- CreatedByUserId = current Staff/Owner.
- BookingSource = Staff hoặc Owner.
- Staff phải nhập snapshot khách.
- Có thể Confirmed ngay khi chính sách và hình thức thanh toán cho phép.
- Audit bắt buộc.

---

## BR-019 — Booking code

BookingCode:

- Unique.
- Không chứa dữ liệu nhạy cảm.
- Không chỉ là ID tuần tự dễ đoán.
- Có thể gồm ngày + random component.

Ví dụ hiển thị:

```text
FB-260725-X7K9
```

Uniqueness được bảo vệ bởi unique index và retry giới hạn khi collision.

---

## BR-020 — Booking status transitions

Cho phép:

```text
PendingPayment → Confirmed
PendingPayment → Expired
PendingPayment → Cancelled
Confirmed → CheckedIn
Confirmed → Cancelled
Confirmed → NoShow
CheckedIn → InProgress
CheckedIn → Cancelled chỉ Owner/exception policy
InProgress → Completed
```

Không cho phép thông thường:

```text
Completed → InProgress
Cancelled → Confirmed
Expired → Confirmed
NoShow → CheckedIn
```

Sửa trạng thái lịch sử cần workflow đặc biệt của Owner, audit đầy đủ, không phải update tùy ý.

---

## BR-021 — Payment aggregation

Chỉ payment/refund `Succeeded` tham gia tổng.

```text
GrossPaid = sum(Succeeded Payment)
Refunded = sum(Succeeded Refund)
NetPaid = GrossPaid - Refunded
```

Booking.PaidAmount và RefundedAmount là dữ liệu tổng hợp được cập nhật cùng transaction.

---

## BR-022 — Payment status calculation

Gợi ý:

- Failed nếu giao dịch đang xử lý thất bại và không có net payment, tùy context.
- Refunded nếu RefundedAmount >= GrossPaid và GrossPaid > 0.
- PartiallyRefunded nếu 0 < RefundedAmount < GrossPaid.
- RefundPending nếu có refund pending cần xử lý.
- Paid nếu NetPaid >= TotalAmount và không refund pending.
- PartiallyPaid nếu 0 < NetPaid < TotalAmount.
- Unpaid nếu NetPaid <= 0.

Một booking Confirmed có thể PartiallyPaid.

---

## BR-023 — Check-in

Chỉ Confirmed booking được check-in thông thường.

Staff/Owner thực hiện.

Ghi audit.

Không bắt buộc paid đủ nếu chính sách cho phép trả tại sân, nhưng UI phải cảnh báo số tiền còn lại.

---

## BR-024 — Start and complete

- CheckedIn → InProgress khi khách bắt đầu dùng sân.
- InProgress → Completed khi kết thúc.
- Trước Complete, hiển thị tiền còn thiếu và dịch vụ phát sinh.
- Completed không đồng nghĩa Paid; hệ thống có thể cảnh báo công nợ.

---

## BR-025 — No-show

Confirmed booking có thể chuyển NoShow sau thời điểm bắt đầu cộng grace period.

Không tự động no-show trước giờ.

NoShow giải phóng slot cho thời gian tương lai còn lại chỉ khi workflow cho phép; v1 có thể chỉ ghi nhận sau khi khoảng booking đã qua để tránh booking chồng không kiểm soát.

---

## BR-026 — Customer lookup

Tra cứu một booking công khai yêu cầu:

- BookingCode.
- CustomerPhone khớp sau normalize.

Không trả dữ liệu nhạy cảm không cần thiết.

Giới hạn tần suất request.

---

## BR-027 — Customer history

Không hiển thị toàn bộ lịch sử chỉ bằng số điện thoại.

Cần một trong:

- Customer đăng nhập và CustomerUserId khớp.
- OTP hợp lệ cho phone.

---

## BR-028 — Cancellation eligibility

Guest/Customer chỉ tự hủy khi:

- PendingPayment hoặc Confirmed.
- Chưa bắt đầu.
- Thời gian còn lại đáp ứng policy.
- Xác thực booking ownership.

Staff hủy theo policy vận hành.

Owner có thể hủy vì sự cố sân nhưng phải nhập lý do.

---

## BR-029 — Cancellation fee

Policy từ cấu hình hoặc database:

Ví dụ mặc định:

- Trước 24 giờ: phí 0%.
- 12–24 giờ: phí 30%.
- Dưới 12 giờ: phí 100% tiền cọc hoặc theo chính sách.

Con số thực tế phải nằm trong cấu hình, không hard-code trong Controller.

Hiển thị phí trước khi xác nhận hủy.

---

## BR-030 — Refund

Không coi đổi PaymentStatus là hoàn tiền.

Hoàn tiền phải tạo Payment record loại Refund.

- Staff có thể tạo yêu cầu nếu được thiết kế.
- Owner duyệt/ghi nhận trong v1.
- Audit bắt buộc.

---

## BR-031 — Field deactivation

Field đã có booking không được hard-delete.

- TemporarilyClosed: không nhận booking mới.
- Maintenance: không nhận booking mới và hiển thị trạng thái.
- Inactive: ngừng khai thác, giữ lịch sử.

Booking hiện có phải được xử lý riêng, không tự hủy khi đổi status.

---

## BR-032 — Activity logging

Bắt buộc với:

- Booking create/update/status/cancel.
- Payment/refund.
- Pricing changes.
- Field block.
- Staff account changes.
- Promotion changes.
- Settings changes.

Không lưu password, OTP plaintext hoặc secret trong before/after JSON.

---

## BR-033 — CSV reports

CSV export:

- Dùng UTF-8 BOM để mở tốt trong Excel tiếng Việt nếu cần.
- Filter theo khoảng ngày và quyền.
- Owner-only cho báo cáo tài chính đầy đủ.
- Không xuất dữ liệu khách không cần thiết.

---

## BR-034 — Data changes and recalculation

Sau khi booking được tạo:

- Sửa PricingRule không đổi CourtAmount cũ.
- Sửa Service không đổi BookingService cũ.
- Sửa PromoCode không đổi DiscountAmount cũ.

Chỉ thao tác “recalculate booking” rõ ràng và có audit mới thay snapshot trước khi booking bắt đầu, nếu được Owner cho phép.

---

## BR-035 — Validation authority

Client-side validation cải thiện trải nghiệm.

Server-side validation là bắt buộc.

Database constraints là lớp bảo vệ cuối.

Không chấp nhận giá, discount, role, status hoặc ownership từ hidden input mà không kiểm tra lại.
