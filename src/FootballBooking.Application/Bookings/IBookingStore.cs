using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Application.Bookings;

public interface IBookingStore
{
    Task<Field?> GetFieldForBookingAsync(Guid fieldId, CancellationToken cancellationToken);
    Task<Field?> GetFieldForBookingBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceItem>> ListActiveServicesAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<ServiceItem>> ListServicesAsync(CancellationToken cancellationToken);
    Task<ServiceItem?> GetServiceAsync(Guid id, CancellationToken cancellationToken);
    Task<ServiceItem?> GetServiceByCodeAsync(string code, CancellationToken cancellationToken);
    Task<IReadOnlyList<PromoCode>> ListPromotionsAsync(CancellationToken cancellationToken);
    Task<PromoCode?> GetPromotionAsync(Guid id, CancellationToken cancellationToken);
    Task<PromoCode?> GetPromotionByCodeAsync(string code, CancellationToken cancellationToken);
    Task<int> CountPromotionUsagesAsync(Guid promoCodeId, string? phoneNormalized, CancellationToken cancellationToken);
    Task<IReadOnlyList<Booking>> ListBookingsForFieldDateAsync(Guid fieldId, DateOnly bookingDate, CancellationToken cancellationToken);
    Task<IReadOnlyList<BookingSummaryDto>> ListBookingsAsync(DateOnly? bookingDate, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken);
    Task<IReadOnlyList<BookingSummaryDto>> ListCustomerBookingsAsync(Guid customerUserId, string? customerPhoneNormalized, CancellationToken cancellationToken);
    Task<IReadOnlyList<BookingSummaryDto>> ListScheduleBookingsAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken);
    Task<IReadOnlyList<ScheduleBlockDto>> ListScheduleBlocksAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken);
    Task<BookingDetailDto?> GetBookingDetailByCodeAsync(string bookingCode, CancellationToken cancellationToken);
    Task<BookingDetailDto?> GetBookingDetailByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Booking?> GetBookingForUpdateAsync(Guid id, CancellationToken cancellationToken);
    Task<Booking?> GetBookingForPaymentAsync(Guid id, CancellationToken cancellationToken);
    Task AddServiceAsync(ServiceItem service, CancellationToken cancellationToken);
    Task AddPromotionAsync(PromoCode promotion, CancellationToken cancellationToken);
    Task AddBookingAsync(Booking booking, CancellationToken cancellationToken);
    Task AddPaymentAsync(PaymentRecord payment, CancellationToken cancellationToken);
    Task AddPromotionUsageAsync(PromoCodeUsage usage, CancellationToken cancellationToken);
    Task<bool> BookingCodeExistsAsync(string bookingCode, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
