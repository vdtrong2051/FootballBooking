# FootballBooking — GĐ0 MySQL & Security ApplyKit

Baseline: `dev` @ `4b22793` (11/11/2026). Same upgrade branch for GĐ0–GĐ4:
`feat/footballbooking-gd0-gd4`.

## Scope
- MySQL-only production/development and integration tests. SQLite source implementation and dependencies removed.
- `football_booking` is never dropped or reset by this kit.
- Integration tests require separate local `football_booking_gd0_test`, which tests intentionally recreate.
- New customer registration is inactive until SMS OTP verified; old customer accounts without `FootballBooking.Phone` reservation **fail closed** and need manual re-verification in a subsequent account recovery flow.
- Phone uniqueness uses existing UNIQUE(LoginProvider, ProviderKey) in `AspNetUserLogins`, thus NO schema DDL or data migration.
- Customer booking listing requires matching authenticated `CustomerUserId`, not phone.
- Success details require matching authenticated customer or protected same-browser creation TempData.
- Guest cancellation is temporarily blocked to avoid unauthorized cancellation until a phone-OTP cancellation flow is added. Staff still handles guest cancellations.
- Holds expire; confirmed/payment transitions use the same named MySQL lock as creation.
- MySqlConnector upgraded to patched 2.6.2.

## Applying
```powershell
$kit = 'E:\Projects\_setup_FB\FootballBooking_GD0_ApplyKit'
& "$kit\apply-gd0.ps1" -Repo 'E:\Projects\FootballBooking'
```
The script refuses dirty tracked files and unexpected baseline SHA. It DOES NOT auto-commit or push. It does not delete the local SQLite files, only ignores them.

## Tests
```powershell
& "$kit\test-gd0.ps1" -Repo 'E:\Projects\FootballBooking'
```
The test script prompts for your local MySQL root password, sets an in-process test-only connection string, and runs dotnet tests. Its only destructive action is on `football_booking_gd0_test`. NEVER point it at `football_booking`.

## SMS modes
- Local Development: `Sms:Provider = Console` logs the OTP in the *app console* for testing only; this does NOT prove ownership of a real phone. Treat these registrations as development/test accounts only.
- Production: configure `Sms__Provider=Twilio`, `Sms__Twilio__AccountSid`, `Sms__Twilio__AuthToken`, `Sms__Twilio__From` securely. Without these, registration stays inactive and returns a useful failure rather than faking verification.
- Password reset, email confirmation and guest cancellation OTP are not implemented in GĐ0. A verified Twilio account may have trial sending limitations.

## Known limits / verification gates
- No .NET runtime was available in the artifact-building container; the ApplyKit is statically validated, **not** claimed as compiled/test-passed. Local `dotnet test` determines acceptance.
- Current application MySQL connection string remains in appsettings from baseline. Move production secrets to User Secrets/environment before deployment.
- No background expiry worker: lazy expiry is persisted upon staff confirmation/payment attempts; pending records may still appear pending in some admin lists after TTL until a sweep exists. Availability correctly releases based on expiry timestamp.
- Existing customer accounts automatically marked phone verified by earlier versions are blocked until real verification/rehabilitation is implemented. This avoids retroactively trusting unreliable flags without modifying data.
- The rate limiter is IP-based and trusts direct connection IP; configure forwarded headers carefully behind a proxy.
- A first successful payment recorded by staff can confirm a pending booking. Verify this meets your deposit policy in GĐ2.

## Acceptance
```powershell
git status -sb
dotnet restore FootballBooking.slnx
# then run test-gd0.ps1
dotnet list src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj package --vulnerable --include-transitive
```
Commit only after all tests and manual scenarios pass:
`git add -A` (local SQLite files are ignored), `git commit -m 'feat(gd0): enforce mysql and booking account security'`.
