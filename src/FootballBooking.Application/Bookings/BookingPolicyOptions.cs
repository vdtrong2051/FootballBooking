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

    // GĐ5-B operational policy (Vietnam business timezone, server timestamps).
    public int CheckInEarlyMinutes { get; set; } = 30;
    public int CheckInLateMinutes { get; set; } = 15;
    public int MaxLateStartMinutes { get; set; } = 30;
    public int MaximumExtensionMinutes { get; set; } = 120;
    public int OvertimeGraceMinutes { get; set; } = 5;
    public int OvertimeBillingStepMinutes { get; set; } = 15;
    public int MaxAutoOvertimeMinutes { get; set; } = 180;

}
