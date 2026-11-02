using FootballBooking.Domain.Bookings;

namespace FootballBooking.Application.Bookings;

public sealed record BookingCreateCommand(
    Guid FieldId,
    DateOnly BookingDate,
    int StartMinute,
    int EndMinute,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    string? Note,
    BookingSource Source,
    Guid? CreatedByUserId,
    IReadOnlyList<BookingServiceSelectionCommand>? Services = null,
    string? PromotionCode = null,
    Guid? CustomerUserId = null,
    PaymentMethod? PreferredPaymentMethod = null);

public sealed record BookingLookupQuery(string BookingCode, string CustomerPhone);

public sealed record BookingServiceSelectionCommand(Guid ServiceId, int Quantity);

public sealed record BookingPaymentCommand(
    Guid BookingId,
    PaymentRecordType PaymentType,
    PaymentMethod Method,
    long Amount,
    string? TransactionCode,
    string? Note,
    Guid? RecordedByUserId);

public sealed record BookingCancellationCommand(Guid BookingId, string? Reason, Guid? ActorUserId);

public sealed record PublicBookingCancellationCommand(string BookingCode, string CustomerPhone, string? Reason);

public sealed record ServiceItemUpsertCommand(
    Guid? Id,
    string? Code,
    string Name,
    string? Description,
    string UnitName,
    long UnitPrice,
    bool IsQuantityTracked,
    int? AvailableQuantity,
    bool IsActive,
    int SortOrder);

public sealed record PromoCodeUpsertCommand(
    Guid? Id,
    string? Code,
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
