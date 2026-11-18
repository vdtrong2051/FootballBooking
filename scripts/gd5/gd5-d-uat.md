
# GD5-D Terminal UAT / acceptance checklist

[ ] D-01 Customer A cannot rebook/read Customer B booking by guessed GUID (404).
[ ] D-02 Rebook prefills field and slot, creating a NEW booking and payment attempt.
[ ] D-03 Reschedule GET only Customer owner or Guest with valid OTP proof.
[ ] D-04 Preview shows total and difference; edited form cannot bypass signed preview.
[ ] D-05 Confirmed, 12+ hours ahead, free slot and sufficient deposit => rescheduled.
[ ] D-06 BookingRescheduleHistory holds old/new date, slot, price, actor and timestamp.
[ ] D-07 Same booking reschedule twice from two browsers => stale request rejected.
[ ] D-08 Two concurrent reschedules from different reservations to same slot => exactly one succeeds.
[ ] D-09 Reschedule into existing booking, maintenance, closed zone, past => rejected.
[ ] D-10 CheckedIn/InProgress/Completed/Cancelled booking => cannot reschedule.
[ ] D-11 Price decrease below net received => reject, no refund movement.
[ ] D-12 Price increase needing extra deposit => reject; unchanged booking and payments.
[ ] D-13 SMS disabled => OTP send fails closed with no authorization cookie.
[ ] D-14 Guest bad code 5 times => rejected; 60s resend cooldown and 5m expiry.
[ ] D-15 Guest OTP cannot modify a different code/phone or Customer booking.
[ ] D-16 Guest auth cookie expires after 5 minutes and is deleted after success.
[ ] D-17 Recurring two weeks, both free => two distinct PendingPayment bookings.
[ ] D-18 Recurring partial availability => errors listed per conflicting week.
[ ] D-19 Double-submit same SeriesId does not create another series.
[ ] D-20 Other customer's recurring series URL => 404.
[ ] D-21 Unpaid recurring holds expire per GD5-A (10 minutes); no automatic payment.
[ ] D-22 No regression GD5-A: deposit, duplicate payment, QR LAN.
[ ] D-23 No regression GD5-B: check-in, extension, overtime and settlement.
[ ] D-24 No regression GD5-C: zones, availability, field blocks.

All UI interactions through browser; DB inspection via mysql CLI only.
[ ] D-25 Reschedule cancels only pending payment attempts; successful receipts remain untouched.
