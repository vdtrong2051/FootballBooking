namespace FootballBooking.Domain.Payments;

public enum PaymentAttemptStatus
{
    Pending = 1,
    Succeeded = 2,
    Failed = 3,
    Expired = 4,
    NeedsReconciliation = 5,
    Cancelled = 6
}
