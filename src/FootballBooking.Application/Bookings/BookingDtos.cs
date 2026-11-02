using FootballBooking.Domain.Bookings;

namespace FootballBooking.Application.Bookings;

public sealed record BookingSlotDto(int StartMinute, int EndMinute, bool IsAvailable, string Label, string? UnavailableReason);

public sealed record PricingSegmentDto(int StartMinute, int EndMinute, long PricePerHour, long Amount, string RuleName);

public sealed record PricingQuoteDto(long CourtAmount, IReadOnlyList<PricingSegmentDto> Segments);

public sealed record ServiceItemDto(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    string UnitName,
    long UnitPrice,
    bool IsQuantityTracked,
    int? AvailableQuantity,
    bool IsActive,
    int SortOrder);

public sealed record BookingServiceLineDto(string ServiceCode, string ServiceName, string UnitName, long UnitPrice, int Quantity, long LineTotal);

public sealed record PaymentRecordDto(
    Guid Id,
    PaymentRecordType PaymentType,
    PaymentMethod Method,
    long Amount,
    PaymentRecordStatus Status,
    string? TransactionCode,
    string? Note,
    DateTimeOffset? ProcessedAtUtc,
    DateTimeOffset CreatedAtUtc);

public sealed record PromoCodeDto(
    Guid Id,
    string Code,
    string Name,
    PromoDiscountType DiscountType,
    long DiscountValue,
    long? MaximumDiscountAmount,
    long MinimumOrderAmount,
    DateTimeOffset StartsAtUtc,
    DateTimeOffset EndsAtUtc,
    int? TotalUsageLimit,
    int? PerPhoneUsageLimit,
    bool IsActive);

public sealed record ScheduleEventDto(
    string Id,
    string Title,
    DateOnly EventDate,
    int StartMinute,
    int EndMinute,
    string FieldName,
    string? BookingCode,
    BookingStatus? Status,
    string Tone,
    string Url,
    bool IsBackground,
    string? Description,
    Guid? FieldId = null,
    string? CustomerPhone = null,
    string? PaymentStatusLabel = null);

public sealed record ScheduleBlockDto(
    Guid Id,
    Guid FieldId,
    string FieldName,
    DateOnly BlockDate,
    int StartMinute,
    int EndMinute,
    string Reason);

public sealed record BookingSummaryDto(
    Guid Id,
    string BookingCode,
    string FieldName,
    DateOnly BookingDate,
    int StartMinute,
    int EndMinute,
    string CustomerName,
    string CustomerPhone,
    BookingStatus Status,
    PaymentStatus PaymentStatus,
    long TotalAmount,
    DateTimeOffset CreatedAtUtc,
    Guid? FieldId = null);

public sealed record BookingDetailDto(
    Guid Id,
    string BookingCode,
    Guid FieldId,
    string FieldName,
    string FieldSlug,
    DateOnly BookingDate,
    int StartMinute,
    int EndMinute,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    BookingSource Source,
    BookingStatus Status,
    PaymentStatus PaymentStatus,
    long CourtAmount,
    long ServiceAmount,
    long DiscountAmount,
    long CancellationFeeAmount,
    long RefundedAmount,
    long TotalAmount,
    long PaidAmount,
    string? PromoCodeSnapshot,
    string? CancellationReason,
    DateTimeOffset? ExpiresAtUtc,
    string? Note,
    DateTimeOffset CreatedAtUtc,
    IReadOnlyList<PricingSegmentDto> PriceSegments,
    IReadOnlyList<BookingServiceLineDto> ServiceLines,
    IReadOnlyList<PaymentRecordDto> Payments)
{
    public long RemainingAmount => Math.Max(0, TotalAmount - PaidAmount + RefundedAmount);

    public PaymentMethod PreferredPaymentMethod
    {
        get
        {
            var latestPayment = Payments.OrderByDescending(payment => payment.CreatedAtUtc).FirstOrDefault();
            if (latestPayment is not null)
            {
                return latestPayment.Method;
            }

            if (!string.IsNullOrWhiteSpace(Note))
            {
                foreach (var method in Enum.GetValues<PaymentMethod>())
                {
                    if (Note.Contains(BookingLabels.PaymentMethod(method), StringComparison.OrdinalIgnoreCase))
                    {
                        return method;
                    }
                }
            }

            return PaymentMethod.VietQr;
        }
    }
}

public sealed record BookingCommandResult(bool Succeeded, string? BookingCode, Guid? BookingId, IReadOnlyList<string> Errors)
{
    public static BookingCommandResult Success(string bookingCode, Guid bookingId)
        => new(true, bookingCode, bookingId, []);

    public static BookingCommandResult Failure(IReadOnlyList<string> errors)
        => new(false, null, null, errors);
}
