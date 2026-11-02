using FootballBooking.Domain.Bookings;

namespace FootballBooking.Application.Bookings;

public interface IBookingService
{
    Task<IReadOnlyList<BookingSlotDto>> GetAvailabilityAsync(Guid fieldId, DateOnly bookingDate, CancellationToken cancellationToken = default);
    Task<PricingQuoteDto?> GetPricingQuoteAsync(Guid fieldId, DateOnly bookingDate, int startMinute, int endMinute, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ServiceItemDto>> ListActiveServicesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ServiceItemDto>> ListAdminServicesAsync(CancellationToken cancellationToken = default);
    Task<ServiceItemDto?> GetServiceAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> SaveServiceAsync(ServiceItemUpsertCommand command, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> SetServiceActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PromoCodeDto>> ListActivePromotionsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PromoCodeDto>> ListAdminPromotionsAsync(CancellationToken cancellationToken = default);
    Task<PromoCodeDto?> GetPromotionAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> SavePromotionAsync(PromoCodeUpsertCommand command, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> SetPromotionActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> CreateBookingAsync(BookingCreateCommand command, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> GetBookingByCodeAsync(string bookingCode, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> LookupBookingAsync(BookingLookupQuery query, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BookingSummaryDto>> ListCustomerBookingsAsync(Guid customerUserId, string? customerPhone, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BookingSummaryDto>> ListAdminBookingsAsync(DateOnly? bookingDate, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ScheduleEventDto>> ListScheduleEventsAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ScheduleEventDto>> ListScheduleEventsAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> GetAdminBookingAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> ChangeStatusAsync(Guid id, BookingStatus targetStatus, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> RecordPaymentAsync(BookingPaymentCommand command, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> CancelBookingAsync(BookingCancellationCommand command, CancellationToken cancellationToken = default);
    Task<BookingCommandResult> CancelPublicBookingAsync(PublicBookingCancellationCommand command, CancellationToken cancellationToken = default);
}
