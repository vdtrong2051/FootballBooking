# GD3 Technical dossier

## Architectural baseline

- Identity: `ApplicationUser`, Identity `AspNetUsers` + `AspNetUserLogins`, GĐ0 phone ownership and OTP.
- Booking access: strictly `CustomerUserId`; never imported from matching contact phone.
- Payment ledger: `Payments` records actual amounts, `PaymentAttempts` is not evidence of funds received.
- Styles: Tailwind 4 + Preline; JS: esbuild; existing components `fb-*` preserved.

## Routes / permissions

| Route | Verb | Role | Action |
|---|---|---|---|
| `/account` | GET | authenticated | CustomerCenter.Index |
| `/account/profile` | GET/POST | authenticated | CustomerCenter.Profile |
| `/account/security` | GET/POST | authenticated | CustomerCenter.Security |
| `/account/change-phone` | GET/POST | authenticated | CustomerCenter.ChangePhone |
| `/account/verify-new-phone` | GET/POST | authenticated | CustomerCenter.VerifyNewPhone |
| `/account/payments` | GET | authenticated | CustomerCenter.Payments |
| `/account/help` | GET | authenticated | CustomerCenter.Help |
| `/account/bookings` | GET | authenticated | existing AccountController.Bookings |
| `/account/logout` | POST | authenticated | existing AccountController.Logout |

All mutating operations use antiforgery. Phone/password changes also use existing rate limiting. Authentication derives the account ID from Identity and does not accept a posted user ID. The new page controller repeats the GĐ0 verified-phone reservation check for Customer accounts.

## Phone-change protocol

1. POST current password, new mobile number.
2. Normalize to verified Vietnamese phone syntax; reject old number and duplicates using `AspNetUserLogins` + `AspNetUsers`.
3. Rate-limited OTP session is saved in `AspNetUserTokens` under `FootballBooking.PhoneChange/Pending`, valid 5 minutes, resend cooldown 60 seconds, 5 failed attempts.
4. OTP is based on Identity ChangePhoneNumber token, sent by configured `IPhoneSmsSender` (Console only in Development).
5. On successful verification, use one MySQL transaction for new-phone reservation, Identity phone update, old-phone login removal and OTP token removal; refresh auth cookie.
6. Bookings retain their preexisting `CustomerUserId`, not moved by phone update.

## UI design conventions

- One public primary navigation system: 6 existing links, book-now CTA, one login **or** account avatar. Never both.
- `<details>` account popover can be operated by keyboard, JavaScript closes it on Escape/outside click. Logout remains a protected POST form.
- One account layout with sticky desktop sidebar and horizontal compact nav on mobile. Respects existing brand greens, neutral background, 8/12/16/24 spacing, shared input/button classes.
- Filter/search on the 50 recent bookings already fetched by GĐ0. This is not a full database search.
- No external theme code copied. Preline/TailAdmin used as design inspiration only; reusable Tailwind components are hand-authored.

## Known gaps for GD4 / future maintenance

- Email changes require verified email delivery and update-token flow (not implemented in GD3).
- Uploaded avatars require storage/security controls (default initials until then).
- Dashboard counts are based on recent 50 bookings only, not full aggregate history.
- Pagination and server-side search can be added when usage grows.
- Unit/integration tests are a safety net, not a substitute for actual SMS, Razor, browser and MySQL verification on Windows.
