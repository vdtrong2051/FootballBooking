# FootballBooking — GĐ5-B: Check-in, Session, Extension & Overtime

Baseline: `feat/footballbooking-gd0-gd4` commit `b04aad227db8da844f401ffdaf274099990525a1`.

## Scope / invariants

- No branch change; no backup/seed/reset/delete of demo data in this kit.
- QR TEST LAN, GĐ5-A availability, deposit minimum, payment reconciliation remain unchanged.
- New records: `BookingSessions` (one per booking) and `BookingExtraCharges` (separate financial lines).
- `Booking.StartMinute` is the original start; `Booking.EndMinute` is the effective reserved end after approved extension. `BookingSession.OriginalEndMinute` preserves the planned end at check-in.
- Check-in only for `Confirmed` within `[-30m,+15m]` around scheduled start; check-in is recorded with UTC time, operator user ID, display name and Owner/Staff role.
- Starting requires check-in and is recorded only once. Finishing requires start and is recorded only once. All mutations share the field/day MySQL named lock.
- Extension allowed during `CheckedIn` or `InProgress`, subject to opening hours, slot step, maintenance blocks, occupied slots and pricing rules. Adds a separate immutable charge, increases booking total and updates payment status. No extension across midnight.
- Overtime is measured at actual finish against the **effective** reserved end, after a grace period. It rounds **chargeable minutes** to a billing block using a per-hour price snapshot captured at check-in (updated to the final rule after extension). The fee is recorded as a separate line, not a duplicate extension fee.
- Finish with overtime greater than 180 minutes fails closed, requiring operational review. Current milestone does not include manual exceptional settlement for >180min cases.
- Owner/Staff identity derives from authenticated claims, not client POST values. Customer/Guest can read a limited timeline through already-authorized pages; operator personal names are displayed only in Admin.
- Financial charges are **not** bank confirmations; recorded deposit and QR LAN remain in GĐ5-A.
- Cancel after check-in is blocked: the customer must be settled via the operational workflow, preventing cancellation from removing charged services.

## Database (important)

This kit introduces new tables and a manual EF migration. **Apply does not execute it.** Do not run the website with old schema after applying code.

**Path A — fresh, empty database with EF migrations:** configure a NEW empty local MySQL database, ensure migration history has been created by EF, run `dotnet ef database update --project src/FootballBooking.Infrastructure --startup-project src/FootballBooking.Web`. Do not combine `EnsureCreated` and `Migrate` on the same database.

**Path B — existing database created with `EnsureCreated` (no `__EFMigrationsHistory`):** First run `scripts/gd5/gd5-b-schema-check.sql` as a read-only query. If *both* tables are absent and the database has no migration history, inspect then run the additive `scripts/gd5/gd5-b-existing-schema.sql` once against the explicitly selected local database. This creates **only** the two tables; no existing rows are changed. Do not also run EF's migration for this database, or tables will conflict.

**If the database already has migration history**: do not run the manual SQL; use reviewed EF migration tooling, and ensure the history matches current schema. Never automate a database reset to resolve schema mismatch.

The integration harness **does** intentionally reset only `football_booking_gd0_test` on localhost when explicitly run; its connection guard disallows other DB names.

## Manual acceptance scenarios

| ID | Action | Required result |
|---|---|---|
| B-01 | Staff checks in 20min before play | Success, UTC timestamp, actor and role saved |
| B-02 | Staff checks in outside [-30,+15] minutes | Rejected, no session created |
| B-03 | Check-in repeated by second staff account | Rejected, no second session |
| B-04 | Start without check-in or start twice | Rejected |
| B-05 | Start after check-in | InProgress, timestamp and actor saved |
| B-06 | Extend by 30min into free working hours | Booking end extends; new extra charge; current amount due recalculates |
| B-07 | Extend into occupied slot or maintenance | Rejected, no fee or interval changed |
| B-08 | End inside grace period (<=5min) | Completed with 0 overtime charge |
| B-09 | End 6min late, 200k/hour snapshot | Bills 15min = 50k; customer sees line |
| B-10 | End 21min late, 200k/hour snapshot | Bills 30min = 100k; customer sees line |
| B-11 | Finish twice via Details and Settlement | Only first succeeds, fee never duplicated |
| B-12 | Cashier-only Staff tries to finish | Authorization denied unless can manage schedule |
| B-13 | Customer/Guest tries POST admin check-in/extend | Unauthorized/redirected, no mutations |
| B-14 | Customer signs in/guest lookup | Only associated booking shows session times and charges; no operator names |
| B-15 | Existing confirmed booking without check-in session | Cannot start/complete directly; requires check-in |
| B-16 | Existing legacy InProgress record without session | Fails closed; manual reconciliation required |
| B-17 | Existing booking with paid total, then extension/overtime | Payment becomes partially paid, amount due shown |
| B-18 | Booking previously fully paid, finishing under grace | No extra amount, status remains paid |

Manual test timing: schedule a valid slot on today's local date with a start near current time; check-in uses actual server UTC time converted to Vietnam timezone, not a fake timestamp. For non-live schedules, test with the xUnit/controlled clock harness instead.

## Release gates

1. `apply-gd5-b.ps1 -Mode Preflight` all 16 original blobs / all replacement anchors match, **no writes**.
2. `apply-gd5-b.ps1 -Mode Apply` only alters source files; database untouched.
3. `apply-gd5-b.ps1 -Mode Test`: restore, build Release, xUnit non-integration, JS syntax (existing), whitespace validation.
4. Apply schema on isolated development DB **only after** reviewing schema state.
5. Run integration tests against `football_booking_gd0_test` with the known safety guard.
6. Execute B-01...B-18 manual UAT. Only then commit and push the existing branch.

## Known limits / not in GĐ5-B

- Customer self-service cancellation/renewal, booking recurrence and loyalty: GĐ5-D.
- Manual Owner dispute/override for >180min overtime, refund workflows and comprehensive audit: GĐ5-E.
- External bank/payment connectors are not implemented; LAN QR is simulated.
- Rate snapshot uses the last pricing segment at check-in (or an average booked rate fallback when original pricing has been removed). If pricing rules change *before* check-in, check-in price snapshot reflects the current rule. GĐ5-E should formalize a price snapshot at booking creation.
- Overtime amount is committed when staff finishes; the public-facing charge is visible in the booking receipt and lookup after that action, not a push notification while the customer is playing.
