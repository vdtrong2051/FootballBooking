namespace FootballBooking.Domain.Bookings;

/// <summary>Immutable audit of a confirmed booking's schedule change.</summary>
public sealed class BookingRescheduleHistory
{
    private BookingRescheduleHistory() { }
    public BookingRescheduleHistory(Guid id, Guid bookingId, Guid? actorUserId, bool viaGuestOtp,
        DateOnly oldDate, int oldStart, int oldEnd, DateOnly newDate, int newStart, int newEnd,
        long oldCourtAmount, long newCourtAmount, long oldTotalAmount, long newTotalAmount, DateTimeOffset createdAtUtc)
    {
        Id = id; BookingId = bookingId; ActorUserId = actorUserId; ViaGuestOtp = viaGuestOtp;
        OldDate = oldDate; OldStartMinute = oldStart; OldEndMinute = oldEnd;
        NewDate = newDate; NewStartMinute = newStart; NewEndMinute = newEnd;
        OldCourtAmount = oldCourtAmount; NewCourtAmount = newCourtAmount;
        OldTotalAmount = oldTotalAmount; NewTotalAmount = newTotalAmount; CreatedAtUtc = createdAtUtc;
    }
    public Guid Id { get; private set; }
    public Guid BookingId { get; private set; }
    public Guid? ActorUserId { get; private set; }
    public bool ViaGuestOtp { get; private set; }
    public DateOnly OldDate { get; private set; }
    public int OldStartMinute { get; private set; }
    public int OldEndMinute { get; private set; }
    public DateOnly NewDate { get; private set; }
    public int NewStartMinute { get; private set; }
    public int NewEndMinute { get; private set; }
    public long OldCourtAmount { get; private set; }
    public long NewCourtAmount { get; private set; }
    public long OldTotalAmount { get; private set; }
    public long NewTotalAmount { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
}

/// <summary>Group of independently payable weekly bookings; no automatic charging.</summary>
public sealed class RecurringBookingSeries
{
    private RecurringBookingSeries() { }
    public RecurringBookingSeries(Guid id, Guid customerUserId, Guid fieldId, DateOnly firstDate,
        int startMinute, int durationMinutes, int weeks, DateTimeOffset createdAtUtc)
    {
        Id = id; CustomerUserId = customerUserId; FieldId = fieldId; FirstDate = firstDate;
        StartMinute = startMinute; DurationMinutes = durationMinutes; Weeks = weeks; CreatedAtUtc = createdAtUtc;
    }
    public Guid Id { get; private set; }
    public Guid CustomerUserId { get; private set; }
    public Guid FieldId { get; private set; }
    public DateOnly FirstDate { get; private set; }
    public int StartMinute { get; private set; }
    public int DurationMinutes { get; private set; }
    public int Weeks { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
}

public sealed class RecurringBookingOccurrence
{
    private RecurringBookingOccurrence() { }
    public RecurringBookingOccurrence(Guid id, Guid seriesId, DateOnly bookingDate,
        Guid? bookingId, string? failureReason, DateTimeOffset createdAtUtc)
    {
        Id = id; SeriesId = seriesId; BookingDate = bookingDate; BookingId = bookingId;
        FailureReason = failureReason is null ? null : failureReason[..Math.Min(300, failureReason.Length)];
        CreatedAtUtc = createdAtUtc;
    }
    public Guid Id { get; private set; }
    public Guid SeriesId { get; private set; }
    public DateOnly BookingDate { get; private set; }
    public Guid? BookingId { get; private set; }
    public string? FailureReason { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
}

/// <summary>Single outstanding OTP per guest booking, encrypted by ASP.NET Data Protection.</summary>
public sealed class GuestBookingOtpChallenge
{
    private GuestBookingOtpChallenge() { }
    public GuestBookingOtpChallenge(Guid bookingId, string phoneNormalized, string protectedCode,
        DateTimeOffset sentAtUtc)
    {
        BookingId = bookingId; PhoneNormalized = phoneNormalized; ProtectedCode = protectedCode;
        SentAtUtc = sentAtUtc; ExpiresAtUtc = sentAtUtc.AddMinutes(5); Attempts = 0;
    }
    public Guid BookingId { get; private set; }
    public string PhoneNormalized { get; private set; } = string.Empty;
    public string ProtectedCode { get; private set; } = string.Empty;
    public DateTimeOffset SentAtUtc { get; private set; }
    public DateTimeOffset ExpiresAtUtc { get; private set; }
    public int Attempts { get; private set; }
    public void Renew(string phoneNormalized, string protectedCode, DateTimeOffset sentAtUtc)
    {
        PhoneNormalized = phoneNormalized; ProtectedCode = protectedCode; SentAtUtc = sentAtUtc;
        ExpiresAtUtc = sentAtUtc.AddMinutes(5); Attempts = 0;
    }
    public void RegisterFailure() => Attempts = Math.Min(Attempts + 1, 5);
}
