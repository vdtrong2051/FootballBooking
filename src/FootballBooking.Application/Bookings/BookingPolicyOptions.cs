namespace FootballBooking.Application.Bookings;

public sealed class BookingPolicyOptions
{
    public int PublicCancellationHoursBeforeStart { get; set; } = 12;
    public int LateCancellationFeePercent { get; set; } = 0;
    public int NoShowGraceMinutes { get; set; } = 15;

    // GĐ5-A demo policy. Keep stable for existing pending bookings.
    // Minimum deposit: max(percentage of total, fixed minimum), capped at total.
    public int DepositPercent { get; set; } = 30;
    public long MinimumDepositAmount { get; set; } = 50_000;

}
