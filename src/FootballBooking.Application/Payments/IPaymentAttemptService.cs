using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Payments;

namespace FootballBooking.Application.Payments;

public sealed record PaymentAttemptDto(Guid Id, Guid BookingId, string BookingCode,
    PaymentMethod Method, long Amount, string RequestCode, PaymentAttemptStatus Status,
    DateTimeOffset ExpiresAtUtc, DateTimeOffset CreatedAtUtc,
    string? ExternalReference, long? ReportedAmount);

public sealed record PaymentAttemptResult(bool Succeeded, string? Error, PaymentAttemptDto? Attempt)
{
    public static PaymentAttemptResult Fail(string error) => new(false, error, null);
    public static PaymentAttemptResult Ok(PaymentAttemptDto attempt) => new(true, null, attempt);
}

public interface IPaymentAttemptService
{
    Task<PaymentAttemptResult> StartAsync(Guid bookingId, PaymentMethod method, CancellationToken ct = default);
    Task<IReadOnlyList<PaymentAttemptDto>> ListForBookingAsync(Guid bookingId, CancellationToken ct = default);
    Task<IReadOnlyList<PaymentAttemptDto>> ListRecentAsync(int count = 100, CancellationToken ct = default);
    Task<PaymentAttemptResult> ConfirmAsync(Guid attemptId, string reference, long receivedAmount, Guid? actorId, CancellationToken ct = default);
}
