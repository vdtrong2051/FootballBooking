namespace FootballBooking.Application.Bookings;

/// <summary>Actor data must be derived from authenticated server-side claims, never from form input.</summary>
public sealed record BookingOperator(Guid UserId, string DisplayName, string Role)
{
    public bool IsValid => UserId != Guid.Empty && (Role is "Owner" or "Staff")
        && !string.IsNullOrWhiteSpace(DisplayName) && DisplayName.Length <= 120;
}

public interface IBookingOperationsService
{
    Task<BookingCommandResult> CheckInAsync(Guid bookingId, BookingOperator actor, CancellationToken ct = default);
    Task<BookingCommandResult> StartAsync(Guid bookingId, BookingOperator actor, CancellationToken ct = default);
    Task<BookingCommandResult> ExtendAsync(Guid bookingId, int newEndMinute, BookingOperator actor, CancellationToken ct = default);
    Task<BookingCommandResult> FinishAsync(Guid bookingId, BookingOperator actor, CancellationToken ct = default);
}
