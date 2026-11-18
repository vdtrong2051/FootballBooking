namespace FootballBooking.Domain.Bookings;

public enum BookingExtraChargeKind
{
    Extension = 1,
    Overtime = 2
}

/// <summary>Immutable financial line item; repeated finish/extension cannot duplicate a charge.</summary>
public sealed class BookingExtraCharge
{
    private BookingExtraCharge() { }

    public BookingExtraCharge(Guid id, Guid bookingId, BookingExtraChargeKind kind,
        int fromMinute, int toMinute, int billedMinutes, long ratePerHour,
        long amount, string note, Guid actorUserId, DateTimeOffset createdAtUtc)
    {
        if (bookingId == Guid.Empty || actorUserId == Guid.Empty || amount < 0 || ratePerHour < 0
            || billedMinutes < 0 || fromMinute < 0 || toMinute < fromMinute || toMinute > 1440)
            throw new ArgumentOutOfRangeException(nameof(amount));
        Id = id;
        BookingId = bookingId;
        Kind = kind;
        FromMinute = fromMinute;
        ToMinute = toMinute;
        BilledMinutes = billedMinutes;
        RatePerHour = ratePerHour;
        Amount = amount;
        Note = note;
        ActorUserId = actorUserId;
        CreatedAtUtc = createdAtUtc;
    }

    public Guid Id { get; private set; }
    public Guid BookingId { get; private set; }
    public BookingExtraChargeKind Kind { get; private set; }
    public int FromMinute { get; private set; }
    public int ToMinute { get; private set; }
    public int BilledMinutes { get; private set; }
    public long RatePerHour { get; private set; }
    public long Amount { get; private set; }
    public string Note { get; private set; } = string.Empty;
    public Guid ActorUserId { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
}
