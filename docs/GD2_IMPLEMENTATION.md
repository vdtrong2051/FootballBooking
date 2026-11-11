# GĐ2 — Payment Core & QR (engineering handover)

## Boundary

- GĐ0: MySQL only, field/date named lock, booking hold expiry, account ownership.
- GĐ1: duration-aware slots, authoritative quotation.
- GĐ2: payment instructions and attempts; verified operator payment; signed development callback. **No real bank transaction feed, MoMo merchant API, or ZaloPay merchant API is enabled.**

### State machine

`PaymentAttempt: Pending -> Succeeded / Expired / Cancelled / NeedsReconciliation`.

`Bookings: PendingPayment -> Confirmed` only after a trusted confirmation (manual bank-statement verification or development-only signed demo callback), under GĐ0 field-date lock, with amount and conflict re-check.

`Payments`: only durable *succeeded* receipts; one receipt created in the same EF Core SaveChanges transaction as the attempt status and Booking confirmation.

Late transfers: `NeedsReconciliation` on attempt, **not** a booking confirmation. `ReportedAmount` records the amount reported by the verifying source, but does not represent booked revenue or a completed refund. Admin must carry out independent reconciliation / refund steps.

### Routes

- GET `/booking/pay/{code}` — guest newly created booking in current protected TempData or authenticated owning user.
- POST `/booking/pay/{code}/start` — antiforgery + ownership + rate-limit; create/reuse attempt.
- GET `/booking/pay/{code}/status` — ownership + `no-store`, read-only status.
- GET `/admin/payments` — attempts, existing booking payments listing (authorized).
- POST `/admin/payments/attempts/{id}/confirm` — Admin `CanManagePayments` + antiforgery; server verifies amount/reference/hold/conflict.
- POST `/dev/payments/notify` — development-only, config-gated, HMAC-SHA256 + timestamp. Not a provider callback.

### Secrets and bank account

```powershell
cd E:\Projects\FootballBooking
dotnet user-secrets set 'Payments:BankBin' '970436' --project src/FootballBooking.Web
dotnet user-secrets set 'Payments:AccountNumber' '<your-real-bank-account>' --project src/FootballBooking.Web
dotnet user-secrets set 'Payments:AccountName' '<your-account-name>' --project src/FootballBooking.Web
```

VietQR image Quick Link: https://www.vietqr.io/qr-dong . The PNG is fetched by the browser from img.vietqr.io. The rendered QR is instructions **only**. No automatic bank confirmation.

To enable signed demo gateway (optional, development only):

```powershell
dotnet user-secrets set 'Payments:EnableDemoGateway' 'true' --project src/FootballBooking.Web
dotnet user-secrets set 'Payments:DemoWebhookSecret' '<random-secret-at-least-32-chars>' --project src/FootballBooking.Web
```

**Do not enable mock gateway on a publicly reachable development server.** Rejects in Production regardless of config. The request JSON is `{"attemptId":"<GUID>","amount":250000,"reference":"DEMO-...","timestamp":<unix-seconds>}`. HMAC hex is computed from `<guid:N>|<amount>|<reference>|<unix-seconds>`, UTF8, HMACSHA256 secret, header `X-FB-Demo-Signature`. Five-minute maximum clock skew.

## Schema setup

The ApplyKit modifies code only. Back up the real `football_booking` database first; then apply **only** the `CREATE TABLE IF NOT EXISTS PaymentAttempts` SQL via mysql client or use EF migration if the existing database is already managed by EF migrations. Do not do both methods in succession without inspecting migration history. The schema script does not delete/update existing rows.

The initial GĐ0 testing harness uses `EnsureCreatedAsync` and creates `PaymentAttempts` automatically on **football_booking_gd0_test only**. Main database must have table before app exercises checkout/admin-payment routes.

## Manual checks

1. A guest creates booking, visits success then checkout in same browser. Other browsers cannot guess a booking code and see its checkout.
2. An authenticated account sees only owned bookings.
3. Changing payment method cancels previous live attempt. Unpaid QR never marks booking confirmed.
4. Admin verifies the real statement / POS receipt and enters a reference + exact amount. Transaction confirms only once; retry with same ref is idempotent.
5. Simulate late confirmation: attempt goes `NeedsReconciliation`; booking is not resurrected; no `Payments` ledger entry is added.
6. Invalid signature/timestamp is rejected by the development webhook.
7. Production never activates demo webhook or fake wallet settlement.
8. All previous GĐ0/GĐ1 tests remain green.

## Deferred real integrations

Real MoMo/ZaloPay IPN requires merchant accounts, official signature verification with provider-specific canonical signing, callback authentication, replay prevention, provider reconciliation, and often refund workflows. Not claimed implemented in this kit. Configure actual merchant integrations in a later dedicated phase.
