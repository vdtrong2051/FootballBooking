using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace FootballBooking.Infrastructure.Identity;

// Uses ASP.NET Identity's existing AspNetUserTokens table. No new schema is required.
public sealed class PhoneOtpService(
    UserManager<ApplicationUser> users,
    IPhoneSmsSender sms,
    ISystemClock clock)
{
    private const string Provider = "FootballBooking.PhoneOtp";
    private const string ChallengeKey = "Challenge";
    private const int MaxAttempts = 5;
    private static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan Cooldown = TimeSpan.FromSeconds(60);

    public async Task<(bool Success, string Error)> SendAsync(ApplicationUser user, CancellationToken cancellationToken = default)
    {
        if (user.AccountStatus != AccountStatus.Inactive || user.PhoneNumberConfirmed || string.IsNullOrWhiteSpace(user.PhoneNumber))
            return (false, "Tài khoản không thuộc trạng thái chờ xác thực.");
        if (!sms.IsConfigured)
            return (false, "Chưa cấu hình dịch vụ SMS. Vui lòng liên hệ quản trị viên.");

        var info = await users.GetAuthenticationTokenAsync(user, Provider, ChallengeKey);
        if (TryParse(info, out _, out var sentAt, out _) && clock.UtcNow - sentAt < Cooldown)
            return (false, "Vui lòng chờ 60 giây trước khi gửi lại OTP.");

        var code = await users.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);
        try
        {
            await sms.SendAsync(user.PhoneNumber, $"FootballBooking: ma xac thuc {code}. Hieu luc 5 phut. Khong chia se ma nay.", cancellationToken);
        }
        catch
        {
            return (false, "Không gửi được SMS. Vui lòng thử lại hoặc liên hệ quản trị viên.");
        }
        var expires = clock.UtcNow.Add(Lifetime);
        var result = await users.SetAuthenticationTokenAsync(user, Provider, ChallengeKey,
            $"{expires.ToUnixTimeSeconds()}|{clock.UtcNow.ToUnixTimeSeconds()}|0");
        return result.Succeeded ? (true, string.Empty) : (false, "Không thể lưu trạng thái OTP.");
    }

    public async Task<(bool Success, string Error)> VerifyAsync(ApplicationUser user, string? code)
    {
        if (user.AccountStatus != AccountStatus.Inactive || user.PhoneNumberConfirmed || string.IsNullOrWhiteSpace(user.PhoneNumber))
            return (false, "Tài khoản không ở trạng thái cần xác thực.");

        var info = await users.GetAuthenticationTokenAsync(user, Provider, ChallengeKey);
        if (!TryParse(info, out var expiresAt, out var sentAt, out var attempts))
            return (false, "Chưa có OTP. Vui lòng yêu cầu gửi mã.");
        if (clock.UtcNow >= expiresAt)
            return (false, "OTP đã hết hạn. Vui lòng gửi mã mới.");
        if (attempts >= MaxAttempts)
            return (false, "Đã vượt quá số lần nhập sai. Vui lòng gửi mã mới sau thời gian chờ.");

        if (string.IsNullOrWhiteSpace(code) || code.Length != 6 || !code.All(char.IsAsciiDigit)
            || !await users.VerifyChangePhoneNumberTokenAsync(user, code, user.PhoneNumber))
        {
            await users.SetAuthenticationTokenAsync(user, Provider, ChallengeKey,
                $"{expiresAt.ToUnixTimeSeconds()}|{sentAt.ToUnixTimeSeconds()}|{attempts + 1}");
            return (false, "OTP không hợp lệ.");
        }

        var changed = await users.ChangePhoneNumberAsync(user, user.PhoneNumber, code);
        if (!changed.Succeeded)
            return (false, "Không thể xác nhận số điện thoại.");
        user.AccountStatus = AccountStatus.Active;
        user.UpdatedAtUtc = clock.UtcNow;
        var updated = await users.UpdateAsync(user);
        if (!updated.Succeeded)
            return (false, "Không thể kích hoạt tài khoản.");
        await users.RemoveAuthenticationTokenAsync(user, Provider, ChallengeKey);
        return (true, string.Empty);
    }

    private static bool TryParse(string? data, out DateTimeOffset expires, out DateTimeOffset sent, out int attempts)
    {
        expires = sent = DateTimeOffset.MinValue;
        attempts = 0;
        var parts = data?.Split('|');
        if (parts is not { Length: 3 } || !long.TryParse(parts[0], out var exp)
            || !long.TryParse(parts[1], out var started) || !int.TryParse(parts[2], out attempts))
            return false;
        expires = DateTimeOffset.FromUnixTimeSeconds(exp);
        sent = DateTimeOffset.FromUnixTimeSeconds(started);
        return true;
    }
}
