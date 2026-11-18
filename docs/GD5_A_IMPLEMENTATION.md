# FootballBooking — GĐ5-A: Booking consistency and deposit gate

Baseline: `feat/footballbooking-gd0-gd4` @ `a5f4e65542e6bd9ada5c9ce2cbcf1789bac32e42`.

## Changes delivered

1. Booking remains protected by a named MySQL field/date lock and overlap validation.
2. Public booking page refreshes available slots every 15 seconds while active and on focus/visibility. It rechecks the quote before submitting; backend validates again under lock.
3. Admin booking replaces raw `StartMinute` number input with available-slot select and refreshes it. Duration is validated (60/90/120).
4. Deposit: `min(total, max(total*30%, 50,000 VND))` by default; `BookingPolicy` appsettings allows changes. Example 300,000 -> 90,000; 100,000 -> 50,000.
5. Guest, Customer, Staff and Owner bookings all start PendingPayment (10-minute hold). No Staff/Owner deposit bypass yet. Sufficient net deposit confirms automatically.
6. Manual payments below the threshold keep booking pending; manual overpayments and over-refunds rejected. Nonempty successful transaction references checked across bookings.
7. QR TEST LAN requests the outstanding deposit only and never displays a real bank account in Development.
8. Quote, checkout, booking success page and staff booking detail display deposit and balance.
9. No DB migrations, reset, seed, backup, SQL or database settings changes.

## Known limitations (not yet production-ready)

- Deposit is calculated from the *current config*, not snapshotted in `Bookings`. **Do not change deposit settings while pending holds exist.** Owner policy UI and durable deposit snapshot need a subsequent increment.
- Manual payment duplicate references are checked via query but do **not** yet have DB-level unique enforcement for parallel transactions on *different* fields/dates. MySQL concurrency integration must test this before production release.
- A payment below the threshold can stay pending until hold expiry; staff must reconcile or refund it manually. No automatic refund.
- Existing historical `Confirmed` bookings remain unchanged.
- Client refresh is polling (15 seconds), not push-based real-time; server lock is authoritative.
- Total amount zero yields zero deposit. Automatic free booking confirmation is not implemented.
- Check-in time, overtime, zones and Customer self-service remain GĐ5-B/C/D.

## Automated acceptance

```powershell
dotnet restore FootballBooking.slnx
dotnet build FootballBooking.slnx -c Release --no-restore
dotnet test tests/FootballBooking.Tests/FootballBooking.Tests.csproj -c Release --no-build --filter "FullyQualifiedName!~FootballBooking.Tests.Integration"
node --check src/FootballBooking.Web/wwwroot/js/booking-gd1.js
node --check src/FootballBooking.Web/wwwroot/js/gd5a-admin-booking.js
git diff --check
```

## Manual acceptance: two browser sessions + phone LAN

| ID | Scenario | Expected outcome |
|---|---|---|
| A-01 | Two sessions reserve same field/date/time simultaneously | Exactly one active booking; second rejected |
| A-02 | Guest B keeps the page open while guest A books | B's slot becomes unavailable within 15s or when tab focused |
| A-03 | Fresh anonymous browser after A booked | Server returns latest availability; no stale HTML |
| A-04 | B submits a previously selected, now-occupied slot | Quote rejects or server lock returns conflict |
| A-05 | Staff opens Create | Select valid starts; changes field/duration update slots |
| A-06 | Total 300,000; manual payment 1 VND | Still PendingPayment; ledger records 1 VND |
| A-07 | Total 300,000; manual 90,000 VND | Confirmed; remaining 210,000 VND |
| A-08 | Total 300,000; QR TEST LAN | QR shows 90,000, phone completes mock confirmation only once |
| A-09 | Staff/Owner creates a booking without payment | PendingPayment, not automatically Confirmed |
| A-10 | Staff attempts Confirm before sufficient deposit | UI disabled + server rejects forged direct POST |
| A-11 | Payment larger than remaining | Rejected with no new payment record |
| A-12 | Duplicate transaction code used on a second booking | Rejected (also run MySQL concurrency stress for cross-field race) |
| A-13 | 10-minute hold expires | Slot released, old QR cannot auto-confirm |
| A-14 | Unauthorized customer tries admin booking/payment | Forbidden or login redirect |
| A-15 | Existing QR LAN and `/admin/payments` | No regression |

**Do not commit/push until build, regression tests and manually relevant scenarios pass.**
