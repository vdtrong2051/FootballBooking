namespace FootballBooking.Application.Bookings;

/// <summary>
/// Shared GĐ5-A deposit calculation for quotes, manual receipts and simulated checkout.
/// Config-based policy: do not change while there are active holds; GĐ5-E will persist per-booking snapshots.
/// </summary>
public static class BookingDepositPolicy
{
    public static long RequiredAmount(long totalAmount, BookingPolicyOptions policy)
    {
        ArgumentNullException.ThrowIfNull(policy);
        if (policy.DepositPercent is < 0 or > 100 || policy.MinimumDepositAmount < 0)
            throw new InvalidOperationException("BookingPolicy deposit configuration is invalid.");
        if (totalAmount <= 0) return 0;
        var percentAmount = decimal.Ceiling(totalAmount * (decimal)policy.DepositPercent / 100m);
        var required = Math.Max(percentAmount, policy.MinimumDepositAmount);
        return (long)Math.Min(totalAmount, required);
    }

    public static long OutstandingToConfirm(long totalAmount, long paidAmount,
        long refundedAmount, BookingPolicyOptions policy)
    {
        var required = RequiredAmount(totalAmount, policy);
        var netReceived = Math.Max(0, paidAmount - refundedAmount);
        return Math.Max(0, required - netReceived);
    }
}
