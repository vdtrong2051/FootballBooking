using System.Security.Cryptography;
using System.Text;

namespace FootballBooking.Infrastructure.Payments;

public static class DemoPaymentSignature
{
    public static string Compute(string secret, Guid attemptId, long amount, string reference, long unixSeconds)
    {
        var message = $"{attemptId:N}|{amount}|{reference}|{unixSeconds}";
        var hash = HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(message));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    public static bool Verify(string secret, Guid attemptId, long amount, string reference,
        long unixSeconds, string? suppliedHex, DateTimeOffset now)
    {
        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32
            || string.IsNullOrWhiteSpace(suppliedHex) || suppliedHex.Length != 64
            || unixSeconds < now.ToUnixTimeSeconds() - 300
            || unixSeconds > now.ToUnixTimeSeconds() + 300)
            return false;
        byte[] supplied;
        try { supplied = Convert.FromHexString(suppliedHex); }
        catch (FormatException) { return false; }
        var expected = Convert.FromHexString(Compute(secret, attemptId, amount, reference, unixSeconds));
        return CryptographicOperations.FixedTimeEquals(expected, supplied);
    }
}
