using System.Text.RegularExpressions;

namespace FootballBooking.Infrastructure.Payments;

public sealed class PaymentOptions
{
    public const string SectionName = "Payments";
    public string? BankBin { get; set; }
    public string? AccountNumber { get; set; }
    public string? AccountName { get; set; }
    public bool EnableDemoGateway { get; set; }
    // Fail-safe: real bank QR is disabled unless explicitly enabled in non-DEV.
    public bool EnableRealBankQr { get; set; }
    // Development only, with an explicit RFC1918 IPv4 base URL supplied on launch.
    public bool EnableLanDemo { get; set; }
    public string? LanBaseUrl { get; set; }
    public string? DemoWebhookSecret { get; set; }

    public bool HasBankAccount => Regex.IsMatch(BankBin ?? string.Empty, @"^\d{6}$")
        && Regex.IsMatch(AccountNumber ?? string.Empty, @"^\d{6,25}$")
        && !string.IsNullOrWhiteSpace(AccountName);
}
