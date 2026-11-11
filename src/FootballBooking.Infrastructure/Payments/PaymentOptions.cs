using System.Text.RegularExpressions;

namespace FootballBooking.Infrastructure.Payments;

public sealed class PaymentOptions
{
    public const string SectionName = "Payments";
    public string? BankBin { get; set; }
    public string? AccountNumber { get; set; }
    public string? AccountName { get; set; }
    public bool EnableDemoGateway { get; set; }
    public string? DemoWebhookSecret { get; set; }

    public bool HasBankAccount => Regex.IsMatch(BankBin ?? string.Empty, @"^\d{6}$")
        && Regex.IsMatch(AccountNumber ?? string.Empty, @"^\d{6,25}$")
        && !string.IsNullOrWhiteSpace(AccountName);
}
