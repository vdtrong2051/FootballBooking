namespace FootballBooking.Domain.Bookings;

/// <summary>One real-world playing session per booking. No synthetic timestamps.</summary>
public sealed class BookingSession
{
    private BookingSession() { }

    public BookingSession(Guid id, Guid bookingId, int originalEndMinute,
        long overtimeRatePerHour, int graceMinutes, int billingStepMinutes,
        DateTimeOffset checkedInAtUtc, Guid checkedInByUserId,
        string checkedInByName, string checkedInByRole)
    {
        if (bookingId == Guid.Empty || checkedInByUserId == Guid.Empty)
            throw new ArgumentException("Booking and operator are required.");
        if (originalEndMinute is <= 0 or > 1440 || overtimeRatePerHour < 0
            || graceMinutes < 0 || billingStepMinutes is < 1 or > 60)
            throw new ArgumentOutOfRangeException(nameof(originalEndMinute));
        Id = id;
        BookingId = bookingId;
        OriginalEndMinute = originalEndMinute;
        EffectiveEndMinute = originalEndMinute;
        OvertimeRatePerHour = overtimeRatePerHour;
        GraceMinutes = graceMinutes;
        BillingStepMinutes = billingStepMinutes;
        CheckedInAtUtc = checkedInAtUtc;
        CheckedInByUserId = checkedInByUserId;
        CheckedInByName = checkedInByName;
        CheckedInByRole = checkedInByRole;
    }

    public Guid Id { get; private set; }
    public Guid BookingId { get; private set; }
    public int OriginalEndMinute { get; private set; }
    public int EffectiveEndMinute { get; private set; }
    public DateTimeOffset CheckedInAtUtc { get; private set; }
    public Guid CheckedInByUserId { get; private set; }
    public string CheckedInByName { get; private set; } = string.Empty;
    public string CheckedInByRole { get; private set; } = string.Empty;
    public DateTimeOffset? StartedAtUtc { get; private set; }
    public Guid? StartedByUserId { get; private set; }
    public string? StartedByName { get; private set; }
    public string? StartedByRole { get; private set; }
    public DateTimeOffset? EndedAtUtc { get; private set; }
    public Guid? EndedByUserId { get; private set; }
    public string? EndedByName { get; private set; }
    public string? EndedByRole { get; private set; }
    public long OvertimeRatePerHour { get; private set; }
    public int GraceMinutes { get; private set; }
    public int BillingStepMinutes { get; private set; }
    public int OvertimeMinutes { get; private set; }
    public int BilledOvertimeMinutes { get; private set; }
    public long OvertimeAmount { get; private set; }

    public void Start(DateTimeOffset atUtc, Guid userId, string name, string role)
    {
        if (StartedAtUtc is not null || EndedAtUtc is not null || atUtc < CheckedInAtUtc)
            throw new InvalidOperationException("Session cannot be started twice or before check-in.");
        StartedAtUtc = atUtc;
        StartedByUserId = userId;
        StartedByName = name;
        StartedByRole = role;
    }

    public void Extend(int newEndMinute, long newOvertimeRatePerHour)
    {
        if (EndedAtUtc is not null || newEndMinute <= EffectiveEndMinute
            || newEndMinute > 1440 || newOvertimeRatePerHour < 0)
            throw new InvalidOperationException("Invalid extension or finished session.");
        EffectiveEndMinute = newEndMinute;
        OvertimeRatePerHour = newOvertimeRatePerHour;
    }

    public void Finish(DateTimeOffset atUtc, Guid userId, string name, string role,
        int overtimeMinutes, int billedMinutes, long amount)
    {
        if (StartedAtUtc is null || EndedAtUtc is not null || atUtc < StartedAtUtc
            || overtimeMinutes < 0 || billedMinutes < 0 || amount < 0)
            throw new InvalidOperationException("Invalid finish, duplicate finish, or missing start.");
        EndedAtUtc = atUtc;
        EndedByUserId = userId;
        EndedByName = name;
        EndedByRole = role;
        OvertimeMinutes = overtimeMinutes;
        BilledOvertimeMinutes = billedMinutes;
        OvertimeAmount = amount;
    }
}
