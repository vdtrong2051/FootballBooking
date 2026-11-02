# IMPLEMENTATION PLAN

## Nguyên tắc

- Làm theo pha, không all-in-one.
- Mỗi pha build/test xanh trước khi sang pha sau.
- Chỉ Codex thực hiện task đang nằm trong `TASKS.md`.
- Ưu tiên vertical slice nhỏ nhưng giữ architecture.
- Không làm đẹp sâu trước khi nghiệp vụ cốt lõi chạy.

---

## Phase 0 — Repository và tooling

### Kết quả

- Git repository.
- Solution và projects.
- Project references đúng.
- Tài liệu ở root/docs.
- `.gitignore`, `.editorconfig`.
- Build/test chạy.

### Tasks

- [ ] Tạo `FootballBooking.sln`.
- [ ] Tạo bốn project trong `src`.
- [ ] Tạo test project.
- [ ] Thêm project references.
- [ ] Bật nullable và warnings phù hợp.
- [ ] Cài EF CLI.
- [ ] Tạo package.json và Tailwind pipeline tối thiểu.
- [ ] Tích hợp Preline cơ bản.
- [ ] Tạo public/admin placeholder layout.
- [ ] Commit baseline.

### Gate

```text
dotnet build = pass
dotnet test = pass
npm run build = pass
```

---

## Phase 1 — Persistence và Identity foundation

### Kết quả

- MySQL.
- Identity Guid.
- Roles.
- Owner seed.
- Admin login.
- Customer login/register cơ bản.

### Tasks

- [ ] ApplicationUser.
- [ ] ApplicationDbContext.
- [ ] MySQL connection.
- [ ] Role seed idempotent.
- [ ] Owner seed qua secrets/env.
- [ ] Identity cookie paths.
- [ ] `/admin/login`.
- [ ] `/login`, `/register`.
- [ ] Authorization policies OwnerOnly, InternalUser.
- [ ] Initial migration.
- [ ] Identity integration tests.

### Gate

- Owner login admin.
- Staff/Customer behavior đúng.
- Database tạo từ migration.

---

## Phase 2 — Field management

### Kết quả

Owner quản lý sân, giờ hoạt động và khóa sân.

### Tasks

- [ ] Field entity/configuration.
- [ ] FieldImage.
- [ ] FieldOperatingHour.
- [ ] FieldBlock.
- [ ] Owner CRUD pages.
- [ ] Upload validation.
- [ ] Status deactivation.
- [ ] Public field list/details skeleton.
- [ ] Unit/integration tests.

---

## Phase 3 — Pricing

### Kết quả

Cấu hình và tính giá server-side.

### Tasks

- [ ] PricingRule entity.
- [ ] Owner pricing UI.
- [ ] PricingService.
- [ ] Priority/ambiguity validation.
- [ ] Cross-interval pricing.
- [ ] Price breakdown DTO.
- [ ] Tests.

---

## Phase 4 — Booking core

### Kết quả

Guest booking và chống trùng.

### Tasks

- [ ] Booking entity.
- [ ] Enums.
- [ ] AvailabilityService.
- [ ] Keyed write coordinator.
- [ ] Booking code generator.
- [ ] Guest booking form.
- [ ] Availability JSON endpoint.
- [ ] Pending hold/expiration behavior.
- [ ] Lookup code + phone.
- [ ] Concurrency tests.

### Gate

Không thể tạo hai active bookings trùng trên cùng field/date.

---

## Phase 5 — Customer và internal booking

- [ ] Customer-linked booking.
- [ ] `/account/bookings`.
- [ ] Staff create booking.
- [ ] Admin booking list/details.
- [ ] Status transitions.
- [ ] Check-in/start/complete/no-show.
- [ ] Audit.

---

## Phase 6 — Services và promotions

- [ ] Service entity/UI.
- [ ] BookingService snapshot lines.
- [ ] Additional service flow.
- [ ] PromoCode và usage.
- [ ] PromotionService.
- [ ] Tests.

---

## Phase 7 — Payments và cancellation

- [ ] Payment entity.
- [ ] Record cash/bank transfer.
- [ ] Payment aggregation.
- [ ] Payment status.
- [ ] Cancellation policy settings.
- [ ] CancellationService.
- [ ] Refund record/Owner action.
- [ ] Tests.

---

## Phase 8 — Admin schedule

- [ ] FullCalendar bundle/config.
- [ ] Event endpoint.
- [ ] Field filter.
- [ ] Status colors.
- [ ] Field block background events.
- [ ] Click slot → create booking.
- [ ] Click event → details.

Không bật drag/drop thay đổi booking ở MVP.

---

## Phase 9 — Dashboard, reports và CSV

- [ ] Owner metrics.
- [ ] Staff operational dashboard.
- [ ] Chart.js endpoints.
- [ ] Revenue report.
- [ ] Utilization report.
- [ ] Cancellation/no-show report.
- [ ] CSV export.
- [ ] Authorization tests.

---

## Phase 10 — Notifications, OTP và review

Tùy chọn sau MVP:

- [ ] In-app notification.
- [ ] Email implementation.
- [ ] OTP hash/rate limit.
- [ ] Customer history OTP.
- [ ] Review after Completed.
- [ ] Reminder background service.

---

## Phase 11 — Hardening

- [ ] Security review.
- [ ] Rate limiting.
- [ ] Error handling/correlation ID.
- [ ] Query/index review.
- [ ] Backup/restore guide.
- [ ] Production configuration.
- [ ] Accessibility pass.
- [ ] End-to-end smoke test.

---

## Prompt pattern cho Codex

### Foundation task

```text
Read AGENTS.md, TASKS.md, docs/ARCHITECTURE.md and docs/SETUP_AND_RUN.md.
Implement only the current Phase 0 task.
Do not implement business modules yet.
Run restore, build and tests. Update TASKS.md only for completed work.
```

### Feature task

```text
Read AGENTS.md and the relevant requirements/business/database/testing docs.
Implement the current task as a vertical slice with server-side validation,
authorization and tests. Do not change the chosen architecture or add unrelated packages.
```

### Review task

```text
Review the current diff against AGENTS.md and the relevant docs.
Identify correctness, authorization, data integrity, concurrency and testing gaps.
Do not rewrite unrelated code.
```

---

## Commit strategy

Commit nhỏ theo milestone:

```text
chore: initialize solution structure
feat(identity): add internal authentication and roles
feat(fields): add field management
feat(pricing): calculate field pricing by intervals
feat(bookings): add guest booking and overlap protection
```

Không gộp toàn bộ dự án vào một commit nếu có thể tránh.
