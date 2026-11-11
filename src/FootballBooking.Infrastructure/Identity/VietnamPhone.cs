namespace FootballBooking.Infrastructure.Identity;

public static class VietnamPhone
{
    public static string? Normalize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        var digits = new string(input.Where(char.IsAsciiDigit).ToArray());
        if (digits.Length == 11 && digits.StartsWith("84", StringComparison.Ordinal))
            digits = "0" + digits[2..];
        if (digits.Length != 10 || digits[0] != '0' || "35789".IndexOf(digits[1]) < 0)
            return null;
        return digits;
    }
}
