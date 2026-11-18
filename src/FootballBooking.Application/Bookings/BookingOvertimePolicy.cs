namespace FootballBooking.Application.Bookings;

public sealed record BookingOvertimeQuote(int OvertimeMinutes, int BilledMinutes, long Amount);

/// <summary>Pure deterministic overtime calculator. Billing starts after grace; rounds to a block.</summary>
public static class BookingOvertimePolicy
{
    public static BookingOvertimeQuote Calculate(int overtimeMinutes, long ratePerHour,
        int graceMinutes, int billingStepMinutes)
    {
        if (overtimeMinutes < 0 || ratePerHour < 0 || graceMinutes < 0
            || billingStepMinutes is < 1 or > 60)
            throw new ArgumentOutOfRangeException(nameof(overtimeMinutes));
        var chargeable = Math.Max(0, overtimeMinutes - graceMinutes);
        if (chargeable == 0) return new(overtimeMinutes, 0, 0);
        var billed = checked(((chargeable + billingStepMinutes - 1) / billingStepMinutes) * billingStepMinutes);
        var amount = checked((long)decimal.Ceiling(ratePerHour * (decimal)billed / 60m));
        return new(overtimeMinutes, billed, amount);
    }
}
