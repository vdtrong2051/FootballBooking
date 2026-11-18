# FootballBooking — GĐ5-C Field Zones

Baseline: `dc9bd87e1fe0793763e754bb5038af692362d99d` on `feat/footballbooking-gd0-gd4`.

## Business behavior

- Owner creates zones at `/admin/zones`. Codes unique, owner-only. No delete endpoint.
- Field create/edit requires selecting an **active** zone. Existing unassigned fields remain accessible (nullable `ZoneId`) and can be explicitly assigned; no guessed mapping by field name.
- Public `/fields` accepts `zoneId`, `fieldType`, `date=YYYY-MM-DD`, `time=HH:mm`, `durationMinutes=60|90|120`.
- The availability filter consults server availability for each field. Zone counts mean available *fields*, not number of bookings or slot count.
- Inactive zones are removed from public field listing and rejected by booking availability/create validation. Existing bookings are retained unchanged.
- Field-block creation acquires the **same field/date MySQL named lock** as booking creation; conflicts with confirmed, checked-in, in-progress or live pending holds are rejected. It also rejects overlapping blocks. Disabling a zone DOES NOT automatically cancel existing reservations; an operator must handle them.
- Booking IDs, financial tables, sessions and QR LAN remain unchanged. GĐ5-A/B regression testing remains mandatory.

## Test matrix

| ID | Scenario | Required result |
| --- | --- | --- |
| C-01 | Owner creates A/B | Both zone codes unique, list shown |
| C-02 | Owner edits zone name | Field assignments preserved |
| C-03 | Guest accesses admin zones | Auth denied |
| C-04 | Staff without Owner accesses zones | Auth denied |
| C-05 | New field without zone | Rejected |
| C-06 | Existing field moved A to B | Booking history preserved |
| C-07 | Public selects zone A | Only fields in A listed |
| C-08 | Public selects date, time, duration | Accurate available count |
| C-09 | Inactive zone | Cannot create a new booking |
| C-10 | Booked slot vs maintenance block | Block rejected |
| C-11 | Overlapping maintenance blocks | Block rejected |
| C-12 | Booking concurrently created vs block | Only one under MySQL lock |
| C-13 | Existing unassigned fields after upgrade | Still accessible until assigned |
| C-14 | QR LAN + deposit | No regression |
| C-15 | Check-in/extension/overtime | No regression |

## Schema operation from terminal

Preflight and Apply do NOT alter the database.

`mysql -u root -p -D football_booking -e "SELECT DATABASE(); SHOW TABLES LIKE '__EFMigrationsHistory';"`

If EF migration history exists AND previous migrations were fully applied, run the GĐ5-C migration using `dotnet ef database update` after building. **Verify status first**; do not mix with SQL below.

For legacy `EnsureCreated` database with no history and no FieldZones/Fields.ZoneId, only after reviewing `scripts/gd5/gd5-c-existing-schema.sql`:

In interactive `mysql>` use `SOURCE E:/Projects/FootballBooking/scripts/gd5/gd5-c-existing-schema.sql;` after selecting the intended database.

PowerShell interactive alternative: inside `mysql>` issue `SOURCE E:/Projects/FootballBooking/scripts/gd5/gd5-c-existing-schema.sql;` after selecting target with `USE football_booking;`.

Do NOT run both schema methods on the same database. Existing demo/production data is not reset or automatically backed up.

## Known limitations

- Zone deactivation is a catalog state switch, not a bulk cancellation or machine shutdown. Ongoing bookings remain assigned to the same field.
- Public live availability is request-time (no websocket); refresh the browser to see other customers' new holds.
- Existing legacy fields without zones remain bookable for backwards compatibility, but must be assigned manually in Admin.
- The new zones have no bulk transfer or map-view UI. No production claim until MySQL integration and manual acceptance pass.
