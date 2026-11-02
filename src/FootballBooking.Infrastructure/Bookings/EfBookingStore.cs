using FootballBooking.Application.Bookings;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Bookings;

public sealed class EfBookingStore(ApplicationDbContext dbContext) : IBookingStore
{
    public Task<Field?> GetFieldForBookingAsync(Guid fieldId, CancellationToken cancellationToken)
        => QueryField()
            .FirstOrDefaultAsync(field => field.Id == fieldId, cancellationToken);

    public Task<Field?> GetFieldForBookingBySlugAsync(string slug, CancellationToken cancellationToken)
        => QueryField()
            .FirstOrDefaultAsync(field => field.Slug == slug, cancellationToken);

    public async Task<IReadOnlyList<ServiceItem>> ListActiveServicesAsync(CancellationToken cancellationToken)
        => await dbContext.Services
            .AsNoTracking()
            .Where(service => service.IsActive)
            .OrderBy(service => service.SortOrder)
            .ThenBy(service => service.Name)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<ServiceItem>> ListServicesAsync(CancellationToken cancellationToken)
        => await dbContext.Services
            .AsNoTracking()
            .OrderBy(service => service.SortOrder)
            .ThenBy(service => service.Name)
            .ToListAsync(cancellationToken);

    public Task<ServiceItem?> GetServiceAsync(Guid id, CancellationToken cancellationToken)
        => dbContext.Services.FirstOrDefaultAsync(service => service.Id == id, cancellationToken);

    public Task<ServiceItem?> GetServiceByCodeAsync(string code, CancellationToken cancellationToken)
        => dbContext.Services.FirstOrDefaultAsync(service => service.Code == code.Trim().ToUpper(), cancellationToken);

    public async Task<IReadOnlyList<PromoCode>> ListPromotionsAsync(CancellationToken cancellationToken)
    {
        var promotions = await dbContext.PromoCodes
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return promotions
            .OrderByDescending(promotion => promotion.StartsAtUtc)
            .ThenBy(promotion => promotion.Code)
            .ToArray();
    }

    public Task<PromoCode?> GetPromotionAsync(Guid id, CancellationToken cancellationToken)
        => dbContext.PromoCodes.FirstOrDefaultAsync(promotion => promotion.Id == id, cancellationToken);

    public Task<PromoCode?> GetPromotionByCodeAsync(string code, CancellationToken cancellationToken)
        => dbContext.PromoCodes.FirstOrDefaultAsync(promotion => promotion.Code == code.Trim().ToUpper(), cancellationToken);

    public Task<int> CountPromotionUsagesAsync(Guid promoCodeId, string? phoneNormalized, CancellationToken cancellationToken)
    {
        var query = dbContext.PromoCodeUsages.Where(usage => usage.PromoCodeId == promoCodeId);
        if (!string.IsNullOrWhiteSpace(phoneNormalized))
        {
            query = query.Where(usage => usage.CustomerPhoneNormalized == phoneNormalized);
        }

        return query.CountAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Booking>> ListBookingsForFieldDateAsync(Guid fieldId, DateOnly bookingDate, CancellationToken cancellationToken)
        => await dbContext.Bookings
            .Where(booking => booking.FieldId == fieldId && booking.BookingDate == bookingDate)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<BookingSummaryDto>> ListBookingsAsync(DateOnly? bookingDate, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken)
    {
        var query = dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Field)
            .AsQueryable();

        if (bookingDate is not null)
        {
            query = query.Where(booking => booking.BookingDate == bookingDate.Value);
        }

        if (fieldId is not null)
        {
            query = query.Where(booking => booking.FieldId == fieldId.Value);
        }

        if (status is not null)
        {
            query = query.Where(booking => booking.Status == status.Value);
        }

        var bookings = await query
            .OrderByDescending(booking => booking.BookingDate)
            .ThenBy(booking => booking.StartMinute)
            .Take(100)
            .ToListAsync(cancellationToken);

        return bookings.Select(ToSummaryDto).ToArray();
    }

    public async Task<IReadOnlyList<BookingSummaryDto>> ListCustomerBookingsAsync(Guid customerUserId, string? customerPhoneNormalized, CancellationToken cancellationToken)
    {
        var query = dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Field)
            .Where(booking => booking.CustomerUserId == customerUserId
                || (!string.IsNullOrWhiteSpace(customerPhoneNormalized) && booking.CustomerPhoneNormalized == customerPhoneNormalized));

        var bookings = await query
            .OrderByDescending(booking => booking.BookingDate)
            .ThenByDescending(booking => booking.StartMinute)
            .Take(50)
            .ToListAsync(cancellationToken);

        return bookings.Select(ToSummaryDto).ToArray();
    }

    public async Task<IReadOnlyList<BookingSummaryDto>> ListScheduleBookingsAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken)
    {
        var query = dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Field)
            .Where(booking => booking.BookingDate >= startDate && booking.BookingDate < endDateExclusive)
            .Where(booking => booking.Status != BookingStatus.Expired)
            .AsQueryable();

        if (fieldId is not null)
        {
            query = query.Where(booking => booking.FieldId == fieldId.Value);
        }

        var bookings = await query
            .OrderBy(booking => booking.BookingDate)
            .ThenBy(booking => booking.StartMinute)
            .ToListAsync(cancellationToken);

        return bookings.Select(ToSummaryDto).ToArray();
    }

    public async Task<IReadOnlyList<ScheduleBlockDto>> ListScheduleBlocksAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken)
    {
        var query = dbContext.FieldBlocks
            .AsNoTracking()
            .Include(block => block.Field)
            .Where(block => block.BlockDate >= startDate && block.BlockDate < endDateExclusive)
            .AsQueryable();

        if (fieldId is not null)
        {
            query = query.Where(block => block.FieldId == fieldId.Value);
        }

        var blocks = await query
            .OrderBy(block => block.BlockDate)
            .ThenBy(block => block.StartMinute)
            .ToListAsync(cancellationToken);

        return blocks
            .Select(block => new ScheduleBlockDto(block.Id, block.FieldId, block.Field.Name, block.BlockDate, block.StartMinute, block.EndMinute, block.Reason))
            .ToArray();
    }

    public async Task<BookingDetailDto?> GetBookingDetailByCodeAsync(string bookingCode, CancellationToken cancellationToken)
    {
        var booking = await QueryBookingDetail()
            .FirstOrDefaultAsync(booking => booking.BookingCode == bookingCode, cancellationToken);

        return booking is null ? null : ToDetailDto(booking);
    }

    public async Task<BookingDetailDto?> GetBookingDetailByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var booking = await QueryBookingDetail()
            .FirstOrDefaultAsync(booking => booking.Id == id, cancellationToken);

        return booking is null ? null : ToDetailDto(booking);
    }

    public Task<Booking?> GetBookingForUpdateAsync(Guid id, CancellationToken cancellationToken)
        => dbContext.Bookings.FirstOrDefaultAsync(booking => booking.Id == id, cancellationToken);

    public Task<Booking?> GetBookingForPaymentAsync(Guid id, CancellationToken cancellationToken)
        => dbContext.Bookings
            .Include(booking => booking.ServiceLines)
            .Include(booking => booking.Payments)
            .FirstOrDefaultAsync(booking => booking.Id == id, cancellationToken);

    public async Task AddServiceAsync(ServiceItem service, CancellationToken cancellationToken)
        => await dbContext.Services.AddAsync(service, cancellationToken);

    public async Task AddPromotionAsync(PromoCode promotion, CancellationToken cancellationToken)
        => await dbContext.PromoCodes.AddAsync(promotion, cancellationToken);

    public async Task AddBookingAsync(Booking booking, CancellationToken cancellationToken)
        => await dbContext.Bookings.AddAsync(booking, cancellationToken);

    public async Task AddPaymentAsync(PaymentRecord payment, CancellationToken cancellationToken)
        => await dbContext.Payments.AddAsync(payment, cancellationToken);

    public async Task AddPromotionUsageAsync(PromoCodeUsage usage, CancellationToken cancellationToken)
        => await dbContext.PromoCodeUsages.AddAsync(usage, cancellationToken);

    public Task<bool> BookingCodeExistsAsync(string bookingCode, CancellationToken cancellationToken)
        => dbContext.Bookings.AnyAsync(booking => booking.BookingCode == bookingCode, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken)
        => dbContext.SaveChangesAsync(cancellationToken);

    private IQueryable<Field> QueryField()
        => dbContext.Fields
            .Include(field => field.OperatingHours)
            .Include(field => field.Blocks)
            .Include(field => field.PricingRules);

    private IQueryable<Booking> QueryBookingDetail()
        => dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Field)
            .ThenInclude(field => field.PricingRules)
            .Include(booking => booking.ServiceLines)
            .Include(booking => booking.Payments);

    private static BookingSummaryDto ToSummaryDto(Booking booking)
        => new(
            booking.Id,
            booking.BookingCode,
            booking.Field.Name,
            booking.BookingDate,
            booking.StartMinute,
            booking.EndMinute,
            booking.CustomerName,
            booking.CustomerPhone,
            booking.Status,
            booking.PaymentStatus,
            booking.TotalAmount,
            booking.CreatedAtUtc,
            booking.FieldId);

    private static BookingDetailDto ToDetailDto(Booking booking)
        => new(
            booking.Id,
            booking.BookingCode,
            booking.FieldId,
            booking.Field.Name,
            booking.Field.Slug,
            booking.BookingDate,
            booking.StartMinute,
            booking.EndMinute,
            booking.CustomerName,
            booking.CustomerPhone,
            booking.CustomerEmail,
            booking.Source,
            booking.Status,
            booking.PaymentStatus,
            booking.CourtAmount,
            booking.ServiceAmount,
            booking.DiscountAmount,
            booking.CancellationFeeAmount,
            booking.RefundedAmount,
            booking.TotalAmount,
            booking.PaidAmount,
            booking.PromoCodeSnapshot,
            booking.CancellationReason,
            booking.ExpiresAtUtc,
            booking.Note,
            booking.CreatedAtUtc,
            [],
            booking.ServiceLines
                .OrderBy(line => line.ServiceNameSnapshot)
                .Select(line => new BookingServiceLineDto(line.ServiceCodeSnapshot, line.ServiceNameSnapshot, line.UnitNameSnapshot, line.UnitPrice, line.Quantity, line.LineTotal))
                .ToArray(),
            booking.Payments
                .OrderByDescending(payment => payment.CreatedAtUtc)
                .Select(payment => new PaymentRecordDto(payment.Id, payment.PaymentType, payment.Method, payment.Amount, payment.Status, payment.TransactionCode, payment.Note, payment.ProcessedAtUtc, payment.CreatedAtUtc))
                .ToArray());
}
