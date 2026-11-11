using FootballBooking.Domain.Payments;

namespace FootballBooking.Infrastructure.Payments;

public static class VietQrInstructions
{
    /// <summary>Creates an unsigned VietQR image URL, not a payment confirmation or bank API integration.</summary>
    public static string? BuildImageUrl(PaymentOptions options, PaymentAttempt attempt)
    {
        if (!options.HasBankAccount || attempt.Amount <= 0) return null;
        return $"https://img.vietqr.io/image/{options.BankBin}-{options.AccountNumber}-compact2.png" +
            $"?amount={attempt.Amount}&addInfo={Uri.EscapeDataString(attempt.RequestCode)}" +
            $"&accountName={Uri.EscapeDataString(options.AccountName!)}";
    }
}
