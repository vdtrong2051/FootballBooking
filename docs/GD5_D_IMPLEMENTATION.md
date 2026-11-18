
# FootballBooking GĐ5-D — Guest & Customer Self-Service

## Baseline
- Branch: `feat/footballbooking-gd0-gd4`
- EXACT commit: `cd7d3501064a631ced97bb12dce43d6a014d878f` (GD5-C committed).
- No branch creation, database reset, data seeding, or changes to QR LAN.

## Scope
- D1: Account booking history and recurring navigation.
- D2: Server-authorized Rebook (no reused payment); preserves previous self-service booking flow.
- D3: Reschedule for verified Customer or OTP-authenticated Guest; explicit signed quote+confirm;
  same field+duration; 12h cutoff; at most two self-reschedules; checks booking overlap,
  maintenance, field/zone status, operating hours, price, and deposit; MySQL locks old/new
  dates in deterministic order. History is stored and money refunded is NOT automated.
  Any pending payment instructions are cancelled upon a successful reschedule; paid transactions are never altered.
- D4: 2-12 weekly occurrences, customer-only, each with independent booking/payment hold;
  conflicting weeks are reported separately; no automatic money movements.
- D5: Guest OTP challenge encrypted with Data Protection, 5-min expiry, 60-second cooldown,
  five attempts, IP rate limit, one-time verification, five-minute HttpOnly guest proof cookie.
  Fails closed when SMS provider is not configured.

## Critical business boundary
Recurring creates *new pending-payment bookings* using existing GD5-A hold policy.
By default those holds expire after 10 minutes without deposit, **including future weeks**.
This is a demo/self-service MVP, not a guaranteed long-term reservation contract.
The payment flow does NOT capture/auto-charge a recurring subscription. Implementing a
consolidated multi-week deposit/contract is a separate, more substantial payment change.

## Requirements
- Windows PowerShell 5.1/7, Python 3.12 (or a `python` command with >=3.10), Git,
  .NET 10 SDK; MySQL 8 for integration/UAT.
- Working tree clean and EXACT baseline HEAD. Preflight writes nothing, no DB updates.

## Commands
```powershell
$repo = "E:\\Projects\\FootballBooking"
$setup = "E:\\Projects\\_setup_FB"
$kit = "$setup\\FootballBooking_GD5_D_ApplyKit"
Expand-Archive -LiteralPath "$setup\\FootballBooking_GD5_D_ApplyKit.zip" -DestinationPath $setup -Force
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
& "$kit\\apply-gd5-d.ps1" -Repo $repo -Mode Preflight
# Only after PREFLIGHT OK:
& "$kit\\apply-gd5-d.ps1" -Repo $repo -Mode Apply
& "$kit\\apply-gd5-d.ps1" -Repo $repo -Mode Test
```

## Database — choose ONE path, after Build & Tests pass
1. In MySQL CLI: `USE football_booking; SOURCE E:/Projects/FootballBooking/scripts/gd5/gd5-d-schema-check.sql;`.
2. If DB has EF migrations history, review the existing migration records then run
   the GD5-D EF migration using `dotnet ef database update` with correct project/startup;
   do not use the fallback SQL.
3. If DB was originally created by EnsureCreated, has no migrations history, and none
   of GD5-D's four new tables exist, run SQL *once*:
   `SOURCE E:/Projects/FootballBooking/scripts/gd5/gd5-d-existing-schema.sql;`
4. Verify all four tables appear. NEVER run both EF migration and raw SQL on the same DB.
5. Apply/Test scripts do not execute any SQL or `dotnet ef database update`.

## Verified limits
This package is preflight/synthetic-apply validated. There is **no dotnet runtime**
within the packaging environment; Windows build, xUnit, Razor compilation, integration
and end-to-end testing must pass on your machine before committing.

## Limitations to be addressed in GD5-E
- Customer-driven reschedule deliberately rejects: bookings containing a promo code,
  lower-price reschedules requiring refunds, and higher-price reschedules with insufficient
  paid deposit. Staff-reviewed financial adjustment is required.
- Recurring is an individual-booking MVP; do not market it as guaranteed recurring capacity
  unless a consolidated deposit and acceptance mechanism is implemented.
- Existing Guest sessions cannot be reattached to accounts just by matching phone numbers.
- Migration and data consistency must be verified against the real target MySQL schema.
