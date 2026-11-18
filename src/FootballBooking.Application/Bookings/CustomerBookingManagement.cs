namespace FootballBooking.Application.Bookings;

public sealed record RescheduleRequest(Guid BookingId, Guid? CustomerUserId, bool VerifiedGuest,
    DateOnly NewDate, int NewStartMinute, int DurationMinutes, long? ExpectedNewTotalAmount = null);

public sealed record ReschedulePreview(bool Succeeded, long OldTotal, long NewTotal,
    long OldCourt, long NewCourt, IReadOnlyList<string> Errors)
{
    public long Difference => NewTotal - OldTotal;
    public static ReschedulePreview Fail(string message) => new(false, 0, 0, 0, 0, [message]);
}

public sealed record RescheduleOutcome(bool Succeeded, IReadOnlyList<string> Errors)
{
    public static RescheduleOutcome Ok() => new(true, []);
    public static RescheduleOutcome Fail(string message) => new(false, [message]);
}

public sealed record RecurringRequest(Guid SeriesId, Guid CustomerUserId, Guid FieldId,
    DateOnly FirstDate, int StartMinute, int DurationMinutes, int Weeks,
    string CustomerName, string CustomerPhone, string? CustomerEmail);

public sealed record RecurringOccurrenceDto(DateOnly Date, string? BookingCode, string? Error);
public sealed record RecurringSeriesDto(Guid Id, Guid FieldId, DateOnly FirstDate,
    int StartMinute, int DurationMinutes, int Weeks, IReadOnlyList<RecurringOccurrenceDto> Occurrences);
public sealed record RecurringSeriesSummaryDto(Guid Id, DateOnly FirstDate, int Weeks, int SuccessCount, int TotalCount);
public sealed record RecurringOutcome(bool Succeeded, Guid? SeriesId, IReadOnlyList<string> Errors)
{
    public static RecurringOutcome Ok(Guid id) => new(true, id, []);
    public static RecurringOutcome Fail(string message) => new(false, null, [message]);
}

public interface ICustomerBookingManagementService
{
    Task<ReschedulePreview> PreviewAsync(RescheduleRequest request, CancellationToken ct = default);
    Task<RescheduleOutcome> RescheduleAsync(RescheduleRequest request, CancellationToken ct = default);
    Task<RecurringOutcome> CreateRecurringAsync(RecurringRequest request, CancellationToken ct = default);
    Task<RecurringSeriesDto?> GetSeriesAsync(Guid seriesId, Guid customerUserId, CancellationToken ct = default);
    Task<IReadOnlyList<RecurringSeriesSummaryDto>> ListSeriesAsync(Guid customerUserId, CancellationToken ct = default);
}
