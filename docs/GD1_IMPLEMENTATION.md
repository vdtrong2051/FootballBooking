# FootballBooking GĐ1 — Booking Core & Availability

Base branch: `feat/footballbooking-gd0-gd4` at `ae66b9f26dd4f9d16689c4672187e1af3ea50be2`.

## Scope

- Dynamic duration-aware availability: 60/90/120 minutes (field min/step still enforced).
- Server-owned booking end time; no independent end-time input on public booking form.
- POST `/booking/quote` with anti-forgery token; uses the SAME pricing, service, promotion and availability rules as booking creation; server revalidates at final CreateBookingAsync.
- Interactive radio-slot grid, refetch on field/date/duration changes, update summary and total on service/promo/phone changes.
- Real homepage field/service/promotion data, correct `fieldId` + `date` deep links.
- No new database tables, migrations, or data resets.

## Public API

`GET /fields/{guid}/availability?date=dd/MM/yyyy&durationMinutes=90`

Response: `{ fieldId, date: "yyyy-MM-dd", durationMinutes, slots: [{startMinute,endMinute,isAvailable,label,unavailableReason}] }`.

Without `durationMinutes`, returns the old JSON array for backwards compatibility.

`POST /booking/quote` with `Content-Type: application/json` AND `RequestVerificationToken` header containing the hidden ASP.NET anti-forgery token:

```
{
  "fieldId": "<GUID>",
  "bookingDateText": "15/11/2026",
  "startMinute": 1080,
  "durationMinutes": 90,
  "customerPhone": "0901234567",
  "promotionCode": "",
  "services": [{"serviceId":"<GUID>","quantity":2}]
}
```

Result `{isValid,courtAmount,serviceAmount,discountAmount,totalAmount,segments,errors}`. The quote is advisory; it creates NO hold and MUST NOT be used as a payment authorization.

## QA scenarios

1. Home selects a real field/date and redirects to `/booking?fieldId=...&date=...`.
2. Public booking shows 60min slots; 90min and 120min duration recompute availability.
3. Select 18:00 for 90 minutes, summary reads 18:00–19:30. There is no editable end field.
4. Pick a booked/blocked slot, or a slot overlapping a hold. Button remains disabled.
5. Change field or date. Old selection and quote disappear; new availability arrives.
6. Change services, promotion or phone. Quote recomputes using the same backend rules.
7. Submit a slot that another customer took moments ago. Server rejects and preserves entered contact data.
8. Two browsers attempt same slot: only one hold succeeds.
9. Browser at 375/390/768/1440 px: no horizontal overflow; summary is accessible.
10. With JS disabled, booking still validates server-side; for normal usage JS is required to refresh quote and enable the action.

## Important boundary

Booking success remains a PENDING booking (10-minute hold). Actual QR payment, PaymentAttempt, idempotent callback and reconciliation belong to GĐ2. The payment choices are only preferences. Do not claim payment is completed.

## Test DB safety

Run the existing GD0 test runner, using ONLY `football_booking_gd0_test` on localhost. NEVER point it at `football_booking`.
