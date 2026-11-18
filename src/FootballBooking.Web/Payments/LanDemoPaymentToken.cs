using System.Net;
using System.Security.Cryptography;
using Microsoft.AspNetCore.DataProtection;

namespace FootballBooking.Web.Payments;

/// <summary>
/// DEV-ONLY bearer link for a payment simulation. A GET must never mutate anything.
/// The token is authenticated, encrypted, time-limited and bound to an attempt and amount.
/// </summary>
internal static class LanDemoPaymentToken
{
    private const string Purpose = "FootballBooking.Development.LanDemoPayment.v1";

    internal sealed record Payload(Guid AttemptId, Guid BookingId, long Amount, string RequestCode);

    public static string Protect(IDataProtectionProvider protection, Payload data, DateTimeOffset expiresAtUtc)
    {
        var remaining = expiresAtUtc - DateTimeOffset.UtcNow;
        if (remaining <= TimeSpan.Zero) throw new InvalidOperationException("Attempt expired.");
        var lifetime = remaining < TimeSpan.FromMinutes(8) ? remaining : TimeSpan.FromMinutes(8);
        var plaintext = $"{data.AttemptId:N}|{data.BookingId:N}|{data.Amount}|{data.RequestCode}";
        return protection.CreateProtector(Purpose).ToTimeLimitedDataProtector().Protect(plaintext, lifetime);
    }

    public static bool TryUnprotect(IDataProtectionProvider protection, string? token, out Payload? payload)
    {
        payload = null;
        if (string.IsNullOrEmpty(token) || token.Length > 4096) return false;
        try
        {
            var plain = protection.CreateProtector(Purpose).ToTimeLimitedDataProtector().Unprotect(token);
            var fields = plain.Split('|');
            if (fields.Length != 4
                || !Guid.TryParseExact(fields[0], "N", out var attemptId)
                || !Guid.TryParseExact(fields[1], "N", out var bookingId)
                || !long.TryParse(fields[2], out var amount)
                || amount <= 0 || fields[3].Length is < 4 or > 64)
                return false;
            payload = new Payload(attemptId, bookingId, amount, fields[3]);
            return true;
        }
        catch (CryptographicException) { return false; }
        catch (FormatException) { return false; }
    }

    public static bool TryGetPrivateLanBase(string? raw, out string baseUrl)
    {
        baseUrl = string.Empty;
        if (!Uri.TryCreate(raw, UriKind.Absolute, out var uri)
            || uri.Scheme != Uri.UriSchemeHttp
            || !string.IsNullOrEmpty(uri.UserInfo)
            || !string.IsNullOrEmpty(uri.Query)
            || !string.IsNullOrEmpty(uri.Fragment)
            || uri.AbsolutePath != "/"
            || !IPAddress.TryParse(uri.Host, out var ip)
            || !IsPrivateOrLoopback(ip)) return false;
        baseUrl = uri.GetLeftPart(UriPartial.Authority);
        return true;
    }

    public static bool IsPrivateOrLoopback(IPAddress? ip)
    {
        if (ip is null) return false;
        if (ip.IsIPv4MappedToIPv6) ip = ip.MapToIPv4();
        if (IPAddress.IsLoopback(ip)) return true;
        if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
        {
            var b = ip.GetAddressBytes();
            return b[0] == 10 || (b[0] == 172 && b[1] >= 16 && b[1] <= 31)
                || (b[0] == 192 && b[1] == 168);
        }
        var bytes = ip.GetAddressBytes();
        return bytes.Length == 16 && (bytes[0] & 0xfe) == 0xfc; // IPv6 ULA
    }
}
