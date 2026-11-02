# TESTING STRATEGY

## 1. Mục tiêu

Kiểm thử tập trung vào rủi ro lớn nhất:

- Double booking.
- Tính giá sai.
- Thanh toán và hoàn tiền sai.
- Chuyển trạng thái sai.
- Staff vượt quyền.
- Guest xem dữ liệu người khác.
- Audit thiếu.

---

## 2. Công cụ

- xUnit.
- `Microsoft.AspNetCore.Mvc.Testing`.
- EF Core SQLite in-memory cho test integration nhanh, không phải provider production.
- MySQL test database/Testcontainers cho migration và hành vi đặc thù provider.
- Built-in assertions; chỉ thêm FluentAssertions/Moq/NSubstitute nếu team chọn và ghi rõ.
- TestClock thay cho thời gian thật.

Không dùng EF Core InMemory provider cho test cần kiểm tra behavior relational, unique index hoặc transaction. Hành vi đặc thù MySQL phải được kiểm tra bằng MySQL thật trong CI.

---

## 3. Cấu trúc test

```text
tests/FootballBooking.Tests/
├── Domain/
├── Application/
├── Integration/
├── Authorization/
├── Fixtures/
└── TestData/
```

Naming:

```text
Method_Scenario_ExpectedResult
```

Ví dụ:

```text
CreateBooking_WhenTimeOverlapsConfirmedBooking_ReturnsConflict
```

---

## 4. Unit tests — Availability

### AV-001 Adjacent intervals

Existing 08:00–09:00, new 09:00–10:00 → allowed.

### AV-002 Partial overlap left

Existing 09:00–10:00, new 08:30–09:30 → rejected.

### AV-003 Partial overlap right

Existing 09:00–10:00, new 09:30–10:30 → rejected.

### AV-004 Contained

Existing 09:00–11:00, new 09:30–10:00 → rejected.

### AV-005 Contains existing

Existing 09:30–10:00, new 09:00–11:00 → rejected.

### AV-006 Cancelled does not block

### AV-007 Expired hold does not block

### AV-008 Active hold blocks

### AV-009 Field block blocks

### AV-010 Outside operating hours rejected

### AV-011 Closed day rejected

### AV-012 Inactive field rejected

---

## 5. Unit tests — Pricing

### PR-001 Weekday rule

### PR-002 Weekend rule

### PR-003 Specific date wins

### PR-004 Higher priority wins

### PR-005 Equal-priority ambiguity returns configuration error

### PR-006 Cross two intervals

### PR-007 Price snapshot unchanged after rule edit

### PR-008 Rounding behavior

---

## 6. Unit tests — Promotions

- Expired code rejected.
- Inactive code rejected.
- Minimum order enforced.
- Total limit enforced.
- Per-phone limit enforced.
- Field restriction enforced.
- Time restriction enforced.
- Percentage maximum cap.
- Fixed amount capped at eligible subtotal.
- Only one promo per booking.
- Usage created atomically with booking.

---

## 7. Unit tests — Booking status

Test every allowed transition.

Test forbidden transitions:

- Cancelled → Confirmed.
- Completed → InProgress.
- Expired → Confirmed.
- PendingPayment → CheckedIn directly.

Test role constraints if transition service receives actor context.

---

## 8. Unit tests — Payments

- No succeeded payment → Unpaid.
- Partial payment → PartiallyPaid.
- Net paid >= total → Paid.
- Partial refund → PartiallyRefunded.
- Full refund → Refunded.
- Failed payment not included.
- Pending refund → RefundPending.
- Amount cannot be negative or zero as configured.
- PaidAmount/RefundedAmount aggregate correctly.

---

## 9. Unit tests — Cancellation

- Pending/Confirmed before cutoff allowed.
- CheckedIn rejected for customer.
- InProgress rejected.
- Completed rejected.
- Correct fee tier.
- Owner cancellation due to field issue.
- Refund amount derived correctly.
- Audit created.

---

## 10. Integration tests

### INT-001 Guest booking

- Anonymous POST valid form.
- Booking created with CustomerUserId null.
- Snapshot saved.
- Code unique.
- Correct source.

### INT-002 Customer booking

- Authenticated Customer.
- CustomerUserId saved.
- Snapshot saved.

### INT-003 Staff booking

- Staff can access create.
- CreatedByUserId saved.
- Audit created.

### INT-004 Owner-only route

- Staff receives 403/AccessDenied for `/admin/staff` and reports requiring Owner.

### INT-005 Customer cannot access admin

### INT-006 Anonymous redirects to admin login

### INT-007 Lookup ownership

- Correct code + phone returns limited view.
- Wrong phone returns not found/general error without leaking existence.

### INT-008 Payment recording

- Payment row.
- Aggregate update.
- Status update.
- Audit.

### INT-009 MySQL unique constraints

### INT-010 Migration creates database

---

## 11. Concurrency test

Hai request đồng thời đặt cùng Field/Date/interval.

Expected:

- Chỉ một booking thành công.
- Request còn lại nhận conflict.
- Không có hai active bookings trùng.

Test production-level dùng MySQL advisory lock với hai connection độc lập.

Test SQLite in-memory chỉ bao phủ luồng MVC và persistence chung, không chứng minh multi-instance safety.

---

## 12. UI smoke tests thủ công

Trước milestone:

### Public

- Trang chủ tải không lỗi.
- Mobile navbar.
- Field list/details.
- Chọn ngày và slot.
- Booking submit disabled khi đang gửi.
- Success page và lookup.

### Admin

- `/admin/login`.
- Owner menu.
- Staff menu khác Owner.
- FullCalendar tải event.
- Booking details/actions.
- Dashboard chart không lỗi console.

### Browser checks

- Không có lỗi JavaScript console nghiêm trọng.
- Không có request 404 asset.
- Form validation hiển thị rõ.

---

## 13. Test data

Dùng builder/factory trong tests:

- FieldBuilder.
- BookingBuilder.
- PricingRuleBuilder.
- UserBuilder.

Không phụ thuộc seed production.

TestClock cho thời gian ổn định.

---

## 14. Commands

```powershell
dotnet restore
dotnet build --no-restore
dotnet test --no-build
```

Test filter:

```powershell
dotnet test --filter FullyQualifiedName~Availability
```

Coverage có thể thêm sau; không biến coverage thành mục tiêu thay cho test đúng rủi ro.

---

## 15. Definition of Done

Một task code hoàn thành khi:

- Đúng acceptance criteria.
- Có test phù hợp.
- Build thành công.
- Test thành công.
- Không vi phạm authorization.
- Migration được review nếu có.
- UI có loading/error/empty nếu liên quan.
- Tài liệu/TASKS cập nhật nếu behavior thay đổi.
- Không claim đã kiểm tra những gì chưa chạy.
