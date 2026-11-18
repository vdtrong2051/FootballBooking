# FootballBooking - GĐ5.0 baseline & regression harness

**Base commit (reviewed):** b663ab2e5884f5dc0b2daa866f90868cd35dcef4
**Branch:** feat/footballbooking-gd0-gd4 (no new branch)
**Scope:** test, read-only inspection, reproducible UAT matrix. **No business/UI code changes.**
**Data decision:** NO backup, NO seed, NO demo-data import, NO schema modification in this stage.

## Verified by source review (not runtime claims)

- Public availability uses BookingService + date/field checks; booking creation uses MySQL named lock and overlap validation.
- Pending holds expire by timestamp, and payment confirmation is guarded. No automatic cross-browser refresh when someone else books a slot.
- GuestWeb and CustomerAccount are distinct sources and CustomerUserId is a separate owner identity.
- Booking does not yet store check-in/start/end timestamps with operation actors, Field has no ZoneId, no minimum deposit policy is enforced.
- Development QR uses the LAN simulator and is not supposed to make a bank payment; production real-bank QR is opt-in.
- Existing integration fixture **calls EnsureDeletedAsync()** on its test database. Its guard accepts ONLY `football_booking_gd0_test` on localhost/127.0.0.1. Never point it to `football_booking_demo`.
- Existing development seed in Program.cs can recreate bookings. Do not run `--seed-development-data` on a populated demo database.
- Database may have been created via EnsureCreated, leaving `__EFMigrationsHistory` absent. Inspect before future GD5-A migrations; do not assume `dotnet ef database update` can safely upgrade that DB.

## Files added

- `tests/FootballBooking.Tests/Regression/Gd5BaselineBookingTests.cs` — date/interval overlap, hold expiry, operational-state transitions, Guest/Customer ownership, partial payment/refund.
- `tests/FootballBooking.Tests/Regression/Gd5BaselinePermissionAndConfigTests.cs` — role permissions and disabled-by-default bank QR/LAN settings.
- `tests/FootballBooking.Tests/TestData/GD5_0_ManualMatrix.csv` — 26 mandatory UAT scenarios; statuses are **coverage/risk labels, not Pass**.
- `scripts/gd5/gd5-0-preflight.ps1` — branch, baseline, file contracts, .NET SDK check. Read-only.
- `scripts/gd5/gd5-0-test.ps1` — Unit by default; Integration requires explicit separate test connection, cannot use demo DB.
- `scripts/gd5/gd5-0-schema-readonly.sql` — metadata-only schema inspection.
- `.github/workflows/gd5-baseline.yml` — automatic Linux .NET 10 build + unit-only regressions on pushes to the existing branch.

## Commands (Windows PowerShell)

```powershell
cd E:\Projects\FootballBooking
Set-ExecutionPolicy -Scope Process Bypass -Force
& .\scripts\gd5\gd5-0-preflight.ps1 -Repo (Get-Location).Path
& .\scripts\gd5\gd5-0-test.ps1 -Repo (Get-Location).Path -Mode Unit
```

Unit needs no MySQL, does not reset any DB.

Integration, **only after accepting the dedicated test DB reset**:

```powershell
& .\scripts\gd5\gd5-0-test.ps1 -Repo (Get-Location).Path -Mode Integration
```

This prompts for MySQL password when `FOOTBALLBOOKING_TEST_CONNECTION` is unset. Integration suite will delete/recreate `football_booking_gd0_test`. Never use the live/demo database. To inspect schema read-only:

```text
mysql -h 127.0.0.1 -u root -p football_booking_gd0_test
SOURCE E:/Projects/FootballBooking/scripts/gd5/gd5-0-schema-readonly.sql;
```

## Acceptance gate (GĐ5.0)

1. Preflight passes on the intended branch and baseline.
2. Build and unit test pass locally or in GitHub Actions, with concrete logs.
3. Integration tests pass on an **isolated** test DB (optional until test database is provisioned, must not be claimed passed until actually run).
4. Regression matrix saved, known missing features explicitly marked for GĐ5-A/B/C/D/E.
5. No existing application/domain logic altered, no data seeded, no backup created.

**Environment limitation at assembly:** GitHub source was reviewed, but the artifact-building environment has no .NET SDK/MySQL. The new tests and scripts require actual execution on Windows or CI before assigning Pass. No run results have been fabricated.
