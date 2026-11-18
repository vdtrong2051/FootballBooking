using System.Security.Cryptography;
using System.Text;
using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Bookings;
using FootballBooking.Infrastructure.Data;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Identity;

public sealed class GuestBookingOtpService(ApplicationDbContext db, IPhoneSmsSender sms,
    IDataProtectionProvider protection, ISystemClock clock)
{
    private readonly IDataProtector _protector = protection.CreateProtector("FootballBooking.GD5D.GuestOTP.v1");

    public async Task<(bool Ok, string Message)> SendAsync(string bookingCode, string? phone, CancellationToken ct)
    {
        if (!sms.IsConfigured) return (false, "SMS chưa được cấu hình. Vui lòng liên hệ nhân viên.");
        var normalized = VietnamPhone.Normalize(phone);
        // Uniform message to avoid revealing which booking codes or phone numbers exist.
        const string generic = "Nếu mã đặt và số điện thoại khớp, OTP sẽ được gửi trong ít phút.";
        if (normalized is null) return (true, generic);
        var booking = await db.Bookings.AsNoTracking()
            .FirstOrDefaultAsync(x => x.BookingCode == bookingCode &&
                x.CustomerPhoneNormalized == normalized && x.Source == BookingSource.GuestWeb &&
                x.CustomerUserId == null && x.Status == BookingStatus.Confirmed, ct);
        if (booking is null) return (true, generic);

        var old = await db.GuestBookingOtpChallenges.FindAsync([booking.Id], ct);
        var now = clock.UtcNow;
        if (old is not null && now - old.SentAtUtc < TimeSpan.FromSeconds(60)) return (true, generic);
        var code = RandomNumberGenerator.GetInt32(0, 1000000).ToString("D6");
        try
        {
            await sms.SendAsync(normalized,
                $"FootballBooking: ma doi lich {code}, hieu luc 5 phut. Khong chia se ma.", ct);
        }
        catch
        {
            return (false, "Không gửi được SMS; vui lòng thử lại.");
        }
        var encrypted = _protector.Protect(code);
        if (old is null)
            db.GuestBookingOtpChallenges.Add(new GuestBookingOtpChallenge(booking.Id, normalized, encrypted, now));
        else
            old.Renew(normalized, encrypted, now);
        await db.SaveChangesAsync(ct);
        return (true, generic);
    }

    public async Task<Guid?> VerifyAsync(string bookingCode, string? phone, string? suppliedCode, CancellationToken ct)
    {
        var normalized = VietnamPhone.Normalize(phone);
        if (normalized is null || suppliedCode is null || suppliedCode.Length != 6 ||
            !suppliedCode.All(char.IsAsciiDigit)) return null;
        var booking = await db.Bookings.AsNoTracking()
            .FirstOrDefaultAsync(x => x.BookingCode == bookingCode &&
                x.CustomerPhoneNormalized == normalized && x.Source == BookingSource.GuestWeb &&
                x.CustomerUserId == null && x.Status == BookingStatus.Confirmed, ct);
        if (booking is null) return null;
        var challenge = await db.GuestBookingOtpChallenges.FindAsync([booking.Id], ct);
        if (challenge is null || challenge.PhoneNormalized != normalized ||
            clock.UtcNow >= challenge.ExpiresAtUtc || challenge.Attempts >= 5) return null;
        string expected;
        try { expected = _protector.Unprotect(challenge.ProtectedCode); }
        catch (CryptographicException) { return null; }
        if (!CryptographicOperations.FixedTimeEquals(Encoding.ASCII.GetBytes(expected),
            Encoding.ASCII.GetBytes(suppliedCode)))
        {
            challenge.RegisterFailure();
            await db.SaveChangesAsync(ct);
            return null;
        }
        db.GuestBookingOtpChallenges.Remove(challenge);
        await db.SaveChangesAsync(ct);
        return booking.Id;
    }
}
