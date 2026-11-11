using FootballBooking.Application.Common.Time;
using FootballBooking.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Identity;

/// <summary>
/// Verified phone-number changes for an authenticated user. Uses AspNetUserTokens;
/// the existing unique FootballBooking.Phone external-login reservation remains authoritative.
/// This is intentionally separate from activation OTP (PhoneOtpService).
/// </summary>
public sealed class PhoneChangeOtpService(
    UserManager<ApplicationUser> users,
    IPhoneSmsSender sms,
    ISystemClock clock,
    ApplicationDbContext db)
{
    private const string Provider = "FootballBooking.PhoneChange";
    private const string TokenKey = "Pending";
    private const string LoginProvider = "FootballBooking.Phone";
    private const int MaxAttempts = 5;
    private static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan Cooldown = TimeSpan.FromSeconds(60);

    public async Task<(bool Success, string Error)> BeginAsync(
        ApplicationUser user, string? input, CancellationToken ct = default)
    {
        var phone = VietnamPhone.Normalize(input);
        if (phone is null) return (false, "Số điện thoại Việt Nam không hợp lệ.");
        if (phone == VietnamPhone.Normalize(user.PhoneNumber))
            return (false, "Số điện thoại mới phải khác số hiện tại.");
        if (!user.PhoneNumberConfirmed) return (false, "Tài khoản chưa được xác thực số điện thoại.");
        if (!sms.IsConfigured) return (false, "Chưa cấu hình dịch vụ SMS.");

        var previous = await users.GetAuthenticationTokenAsync(user, Provider, TokenKey);
        if (TryParse(previous, out _, out _, out var sent, out _)
            && clock.UtcNow - sent < Cooldown)
            return (false, "Vui lòng chờ 60 giây trước khi yêu cầu OTP mới.");

        if (await IsReservedByAnotherUserAsync(user.Id, phone, ct))
            return (false, "Số điện thoại đã được sử dụng.");

        var code = await users.GenerateChangePhoneNumberTokenAsync(user, phone);
        var now = clock.UtcNow;
        var stored = await users.SetAuthenticationTokenAsync(user, Provider, TokenKey,
            $"{phone}|{now.Add(Lifetime).ToUnixTimeSeconds()}|{now.ToUnixTimeSeconds()}|0");
        if (!stored.Succeeded) return (false, "Không thể tạo phiên xác thực OTP.");
        try
        {
            await sms.SendAsync(phone,
                $"FootballBooking: ma doi so dien thoai {code}. Hieu luc 5 phut. Khong chia se ma nay.", ct);
        }
        catch
        {
            await users.RemoveAuthenticationTokenAsync(user, Provider, TokenKey);
            return (false, "Không gửi được OTP. Vui lòng thử lại.");
        }
        return (true, string.Empty);
    }

    public async Task<string?> MaskedPendingPhoneAsync(ApplicationUser user)
    {
        var pending = await users.GetAuthenticationTokenAsync(user, Provider, TokenKey);
        return TryParse(pending, out var phone, out var expires, out _, out _)
            && clock.UtcNow < expires
            ? $"******{phone[^4..]}" : null;
    }

    public async Task<(bool Success, string Error)> VerifyAsync(
        ApplicationUser user, string? code, CancellationToken ct = default)
    {
        var pending = await users.GetAuthenticationTokenAsync(user, Provider, TokenKey);
        if (!TryParse(pending, out var phone, out var expires, out var sent, out var attempts))
            return (false, "Không có yêu cầu đổi số điện thoại đang chờ.");
        if (clock.UtcNow >= expires) return (false, "Mã OTP đã hết hạn. Vui lòng yêu cầu lại.");
        if (attempts >= MaxAttempts) return (false, "Đã vượt quá số lần nhập sai.");
        if (string.IsNullOrWhiteSpace(code) || code.Length != 6 || !code.All(char.IsAsciiDigit)
            || !await users.VerifyChangePhoneNumberTokenAsync(user, code, phone))
        {
            await users.SetAuthenticationTokenAsync(user, Provider, TokenKey,
                $"{phone}|{expires.ToUnixTimeSeconds()}|{sent.ToUnixTimeSeconds()}|{attempts + 1}");
            return (false, "Mã OTP không hợp lệ.");
        }
        if (await IsReservedByAnotherUserAsync(user.Id, phone, ct))
            return (false, "Số điện thoại đã được sử dụng.");

        var oldPhone = VietnamPhone.Normalize(user.PhoneNumber);
        try
        {
            // Identity operations share the scoped ApplicationDbContext. A DB transaction
            // keeps the phone reservation, Identity update and token removal consistent.
            await using var transaction = await db.Database.BeginTransactionAsync(ct);
            var reserved = await users.AddLoginAsync(user,
                new UserLoginInfo(LoginProvider, phone, "Verified phone"));
            if (!reserved.Succeeded) return (false, "Không thể đăng ký số điện thoại mới.");
            var changed = await users.ChangePhoneNumberAsync(user, phone, code);
            if (!changed.Succeeded) return (false, "Không thể xác nhận số điện thoại mới.");
            if (oldPhone is not null)
            {
                var removed = await users.RemoveLoginAsync(user, LoginProvider, oldPhone);
                if (!removed.Succeeded) return (false, "Không thể cập nhật quyền sở hữu số điện thoại.");
            }
            var clear = await users.RemoveAuthenticationTokenAsync(user, Provider, TokenKey);
            if (!clear.Succeeded) return (false, "Không thể hoàn tất xác thực.");
            await transaction.CommitAsync(ct);
            return (true, string.Empty);
        }
        catch (DbUpdateException)
        {
            return (false, "Không thể đổi số điện thoại; có thể số mới đã được sử dụng.");
        }
    }

    private async Task<bool> IsReservedByAnotherUserAsync(Guid userId, string phone, CancellationToken ct)
    {
        var account = await users.FindByLoginAsync(LoginProvider, phone);
        if (account is not null && account.Id != userId) return true;
        return await users.Users.AnyAsync(x => x.Id != userId && x.PhoneNumber == phone, ct);
    }

    private static bool TryParse(string? raw, out string phone, out DateTimeOffset expires,
        out DateTimeOffset sent, out int attempts)
    {
        phone = string.Empty;
        expires = sent = DateTimeOffset.MinValue;
        attempts = 0;
        var parts = raw?.Split('|');
        if (parts is not { Length: 4 } || VietnamPhone.Normalize(parts[0]) != parts[0]
            || !long.TryParse(parts[1], out var exp)
            || !long.TryParse(parts[2], out var time)
            || !int.TryParse(parts[3], out attempts)) return false;
        phone = parts[0];
        expires = DateTimeOffset.FromUnixTimeSeconds(exp);
        sent = DateTimeOffset.FromUnixTimeSeconds(time);
        return true;
    }
}
