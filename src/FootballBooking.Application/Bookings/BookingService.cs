using System.Security.Cryptography;
using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Application.Bookings;

public sealed class BookingService(
    IBookingStore store,
    IBookingWriteLock writeLock,
    ISystemClock clock,
    BookingPolicyOptions? policyOptions = null) : IBookingService
{
    private static readonly TimeSpan LockTimeout = TimeSpan.FromSeconds(5);
    private const int HoldMinutes = 10;
    private readonly BookingPolicyOptions _policy = policyOptions ?? new BookingPolicyOptions();

    public async Task<IReadOnlyList<BookingSlotDto>> GetAvailabilityAsync(Guid fieldId, DateOnly bookingDate, CancellationToken cancellationToken = default)
    {
        var field = await store.GetFieldForBookingAsync(fieldId, cancellationToken);
        if (field is null)
        {
            return [];
        }

        var bookings = await store.ListBookingsForFieldDateAsync(fieldId, bookingDate, cancellationToken);
        var slots = new List<BookingSlotDto>();

        var operatingHour = field.OperatingHours.FirstOrDefault(hour => hour.DayOfWeek == (int)bookingDate.DayOfWeek);
        if (operatingHour is null || operatingHour.IsClosed || operatingHour.OpenMinute is null || operatingHour.CloseMinute is null)
        {
            return slots;
        }

        for (var start = operatingHour.OpenMinute.Value; start + field.MinimumBookingMinutes <= operatingHour.CloseMinute.Value; start += field.SlotStepMinutes)
        {
            var end = start + field.MinimumBookingMinutes;
            var errors = ValidateAvailability(field, bookings, bookingDate, start, end, allowPast: false);
            slots.Add(new BookingSlotDto(start, end, errors.Count == 0, $"{FormatMinute(start)} - {FormatMinute(end)}", errors.FirstOrDefault()));
        }

        return slots;
    }

    public async Task<PricingQuoteDto?> GetPricingQuoteAsync(Guid fieldId, DateOnly bookingDate, int startMinute, int endMinute, CancellationToken cancellationToken = default)
    {
        var field = await store.GetFieldForBookingAsync(fieldId, cancellationToken);
        return field is null ? null : CalculatePrice(field, bookingDate, startMinute, endMinute);
    }

    public async Task<IReadOnlyList<ServiceItemDto>> ListActiveServicesAsync(CancellationToken cancellationToken = default)
    {
        var services = await store.ListActiveServicesAsync(cancellationToken);
        return services.Select(ToServiceDto).ToArray();
    }

    public async Task<IReadOnlyList<ServiceItemDto>> ListAdminServicesAsync(CancellationToken cancellationToken = default)
    {
        var services = await store.ListServicesAsync(cancellationToken);
        return services.Select(ToServiceDto).ToArray();
    }

    public async Task<ServiceItemDto?> GetServiceAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await store.GetServiceAsync(id, cancellationToken);
        return service is null ? null : ToServiceDto(service);
    }

    public async Task<BookingCommandResult> SaveServiceAsync(ServiceItemUpsertCommand command, CancellationToken cancellationToken = default)
    {
        var errors = ValidateServiceCommand(command);
        if (errors.Count > 0)
        {
            return BookingCommandResult.Failure(errors);
        }

        var now = clock.UtcNow;
        var code = string.IsNullOrWhiteSpace(command.Code)
            ? await GenerateCatalogCodeAsync("DV", store.GetServiceByCodeAsync, cancellationToken)
            : command.Code.Trim().ToUpperInvariant();
        var existingByCode = await store.GetServiceByCodeAsync(code, cancellationToken);
        if (existingByCode is not null && existingByCode.Id != command.Id)
        {
            return BookingCommandResult.Failure(["Mã dịch vụ đã tồn tại. Vui lòng dùng mã khác."]);
        }

        if (command.Id is null)
        {
            var service = new ServiceItem(
                Guid.NewGuid(),
                code,
                command.Name,
                command.Description,
                command.UnitName,
                command.UnitPrice,
                command.IsQuantityTracked,
                command.IsQuantityTracked ? command.AvailableQuantity : null,
                command.IsActive,
                command.SortOrder,
                now);
            await store.AddServiceAsync(service, cancellationToken);
            await store.SaveChangesAsync(cancellationToken);
            return BookingCommandResult.Success(service.Code, service.Id);
        }

        var current = await store.GetServiceAsync(command.Id.Value, cancellationToken);
        if (current is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy dịch vụ cần cập nhật."]);
        }

        current.Update(
            code,
            command.Name,
            command.Description,
            command.UnitName,
            command.UnitPrice,
            command.IsQuantityTracked,
            command.IsQuantityTracked ? command.AvailableQuantity : null,
            command.IsActive,
            command.SortOrder,
            now);
        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(current.Code, current.Id);
    }

    public async Task<BookingCommandResult> SetServiceActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken = default)
    {
        var service = await store.GetServiceAsync(id, cancellationToken);
        if (service is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy dịch vụ."]);
        }

        service.SetActive(isActive, clock.UtcNow);
        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(service.Code, service.Id);
    }

    public async Task<IReadOnlyList<PromoCodeDto>> ListActivePromotionsAsync(CancellationToken cancellationToken = default)
    {
        var promotions = await store.ListPromotionsAsync(cancellationToken);
        var now = clock.UtcNow;
        return promotions
            .Where(promotion => promotion.IsActive && promotion.StartsAtUtc <= now && promotion.EndsAtUtc >= now)
            .Select(ToPromoDto)
            .ToArray();
    }

    public async Task<IReadOnlyList<PromoCodeDto>> ListAdminPromotionsAsync(CancellationToken cancellationToken = default)
    {
        var promotions = await store.ListPromotionsAsync(cancellationToken);
        return promotions.Select(ToPromoDto).ToArray();
    }

    public async Task<PromoCodeDto?> GetPromotionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var promotion = await store.GetPromotionAsync(id, cancellationToken);
        return promotion is null ? null : ToPromoDto(promotion);
    }

    public async Task<BookingCommandResult> SavePromotionAsync(PromoCodeUpsertCommand command, CancellationToken cancellationToken = default)
    {
        var errors = ValidatePromotionCommand(command);
        if (errors.Count > 0)
        {
            return BookingCommandResult.Failure(errors);
        }

        var now = clock.UtcNow;
        var code = string.IsNullOrWhiteSpace(command.Code)
            ? await GenerateCatalogCodeAsync("KM", store.GetPromotionByCodeAsync, cancellationToken)
            : command.Code.Trim().ToUpperInvariant();
        var existingByCode = await store.GetPromotionByCodeAsync(code, cancellationToken);
        if (existingByCode is not null && existingByCode.Id != command.Id)
        {
            return BookingCommandResult.Failure(["Mã khuyến mãi đã tồn tại. Vui lòng dùng mã khác."]);
        }

        if (command.Id is null)
        {
            var promotion = new PromoCode(
                Guid.NewGuid(),
                code,
                command.Name,
                command.DiscountType,
                command.DiscountValue,
                command.MaximumDiscountAmount,
                command.MinimumOrderAmount,
                command.StartsAtUtc,
                command.EndsAtUtc,
                command.TotalUsageLimit,
                command.PerPhoneUsageLimit,
                null,
                null,
                null,
                command.IsActive,
                now);
            await store.AddPromotionAsync(promotion, cancellationToken);
            await store.SaveChangesAsync(cancellationToken);
            return BookingCommandResult.Success(promotion.Code, promotion.Id);
        }

        var current = await store.GetPromotionAsync(command.Id.Value, cancellationToken);
        if (current is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy khuyến mãi cần cập nhật."]);
        }

        current.Update(
            code,
            command.Name,
            command.DiscountType,
            command.DiscountValue,
            command.MaximumDiscountAmount,
            command.MinimumOrderAmount,
            command.StartsAtUtc,
            command.EndsAtUtc,
            command.TotalUsageLimit,
            command.PerPhoneUsageLimit,
            null,
            null,
            null,
            command.IsActive,
            now);
        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(current.Code, current.Id);
    }

    public async Task<BookingCommandResult> SetPromotionActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken = default)
    {
        var promotion = await store.GetPromotionAsync(id, cancellationToken);
        if (promotion is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy khuyến mãi."]);
        }

        promotion.SetActive(isActive, clock.UtcNow);
        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(promotion.Code, promotion.Id);
    }

    public async Task<BookingCommandResult> CreateBookingAsync(BookingCreateCommand command, CancellationToken cancellationToken = default)
    {
        var field = await store.GetFieldForBookingAsync(command.FieldId, cancellationToken);
        if (field is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy sân cần đặt."]);
        }

        await using var acquiredLock = await writeLock.TryAcquireAsync(command.FieldId, command.BookingDate, LockTimeout, cancellationToken);
        if (acquiredLock is null)
        {
            return BookingCommandResult.Failure(["Sân đang có thao tác đặt lịch khác. Vui lòng thử lại sau."]);
        }

        var bookings = await store.ListBookingsForFieldDateAsync(command.FieldId, command.BookingDate, cancellationToken);
        var errors = ValidateCreateCommand(command, field, bookings);
        if (errors.Count > 0)
        {
            return BookingCommandResult.Failure(errors);
        }

        var quote = CalculatePrice(field, command.BookingDate, command.StartMinute, command.EndMinute);
        if (quote is null)
        {
            return BookingCommandResult.Failure(["Chưa cấu hình giá phù hợp cho khung giờ đã chọn."]);
        }

        var bookingId = Guid.NewGuid();
        var serviceResult = await BuildServiceLinesAsync(command, bookingId, cancellationToken);
        errors.AddRange(serviceResult.Errors);
        if (errors.Count > 0)
        {
            return BookingCommandResult.Failure(errors);
        }

        var now = clock.UtcNow;
        var subtotal = quote.CourtAmount + serviceResult.ServiceAmount;
        var promotionResult = await CalculatePromotionAsync(command, subtotal, cancellationToken);
        if (promotionResult.Errors.Count > 0)
        {
            return BookingCommandResult.Failure(promotionResult.Errors);
        }

        var status = command.Source is BookingSource.GuestWeb or BookingSource.CustomerAccount
            ? BookingStatus.PendingPayment
            : BookingStatus.Confirmed;
        DateTimeOffset? expiresAtUtc = status == BookingStatus.PendingPayment ? now.AddMinutes(HoldMinutes) : null;
        var bookingCode = await GenerateBookingCodeAsync(command.BookingDate, cancellationToken);
        var effectiveNote = BuildBookingNote(command.Note, command.PreferredPaymentMethod);

        var booking = new Booking(
            bookingId,
            bookingCode,
            command.FieldId,
            command.BookingDate,
            command.StartMinute,
            command.EndMinute,
            command.CustomerName,
            command.CustomerPhone,
            NormalizePhone(command.CustomerPhone),
            command.CustomerEmail,
            command.CustomerUserId,
            command.CreatedByUserId,
            command.Source,
            status,
            PaymentStatus.Unpaid,
            quote.CourtAmount,
            serviceResult.ServiceAmount,
            promotionResult.DiscountAmount,
            Math.Max(0, subtotal - promotionResult.DiscountAmount),
            promotionResult.Promotion?.Id,
            promotionResult.Promotion?.Code,
            expiresAtUtc,
            now,
            effectiveNote);
        booking.ApplyCommercialSnapshot(serviceResult.Lines, promotionResult.Promotion?.Id, promotionResult.Promotion?.Code, serviceResult.ServiceAmount, promotionResult.DiscountAmount, now);

        await store.AddBookingAsync(booking, cancellationToken);
        if (promotionResult.Promotion is not null && promotionResult.DiscountAmount > 0)
        {
            await store.AddPromotionUsageAsync(new PromoCodeUsage(Guid.NewGuid(), promotionResult.Promotion.Id, booking.Id, NormalizePhone(command.CustomerPhone), promotionResult.DiscountAmount, now), cancellationToken);
        }

        await store.SaveChangesAsync(cancellationToken);

        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingDetailDto?> LookupBookingAsync(BookingLookupQuery query, CancellationToken cancellationToken = default)
    {
        var booking = await store.GetBookingDetailByCodeAsync(query.BookingCode.Trim(), cancellationToken);
        if (booking is null || !string.Equals(NormalizePhone(booking.CustomerPhone), NormalizePhone(query.CustomerPhone), StringComparison.Ordinal))
        {
            return null;
        }

        return booking;
    }

    public Task<BookingDetailDto?> GetBookingByCodeAsync(string bookingCode, CancellationToken cancellationToken = default)
        => store.GetBookingDetailByCodeAsync(bookingCode.Trim(), cancellationToken);

    public Task<IReadOnlyList<BookingSummaryDto>> ListCustomerBookingsAsync(Guid customerUserId, string? customerPhone, CancellationToken cancellationToken = default)
        => store.ListCustomerBookingsAsync(customerUserId, null, cancellationToken);

    public Task<IReadOnlyList<BookingSummaryDto>> ListAdminBookingsAsync(DateOnly? bookingDate, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken = default)
        => store.ListBookingsAsync(bookingDate, fieldId, status, cancellationToken);

    public Task<IReadOnlyList<ScheduleEventDto>> ListScheduleEventsAsync(
        DateOnly startDate,
        DateOnly endDateExclusive,
        Guid? fieldId,
        CancellationToken cancellationToken = default)
        => ListScheduleEventsAsync(startDate, endDateExclusive, fieldId, null, cancellationToken);

    public async Task<IReadOnlyList<ScheduleEventDto>> ListScheduleEventsAsync(
        DateOnly startDate,
        DateOnly endDateExclusive,
        Guid? fieldId,
        BookingStatus? status,
        CancellationToken cancellationToken = default)
    {
        if (endDateExclusive <= startDate)
        {
            return [];
        }

        var bookings = await store.ListScheduleBookingsAsync(startDate, endDateExclusive, fieldId, cancellationToken);
        bookings = status is null
            ? bookings.Where(booking => booking.Status != BookingStatus.Cancelled && booking.Status != BookingStatus.Expired).ToArray()
            : bookings.Where(booking => booking.Status == status.Value).ToArray();

        var blocks = await store.ListScheduleBlocksAsync(startDate, endDateExclusive, fieldId, cancellationToken);
        var events = new List<ScheduleEventDto>();

        events.AddRange(bookings.Select(booking => new ScheduleEventDto(
            $"booking-{booking.Id}",
            $"{booking.FieldName} · {booking.CustomerName}",
            booking.BookingDate,
            booking.StartMinute,
            booking.EndMinute,
            booking.FieldName,
            booking.BookingCode,
            booking.Status,
            BookingLabels.ScheduleTone(booking.Status),
            $"/admin/bookings/{booking.Id}",
            false,
            $"{BookingLabels.Status(booking.Status)} · {BookingLabels.PaymentStatus(booking.PaymentStatus)}",
            booking.FieldId,
            booking.CustomerPhone,
            BookingLabels.PaymentStatus(booking.PaymentStatus))));

        if (status is null)
        {
            events.AddRange(blocks.Select(block => new ScheduleEventDto(
                $"block-{block.Id}",
                $"{block.FieldName} · Khóa sân",
                block.BlockDate,
                block.StartMinute,
                block.EndMinute,
                block.FieldName,
                null,
                null,
                "neutral",
                string.Empty,
                true,
                block.Reason,
                block.FieldId)));
        }

        return events
            .OrderBy(scheduleEvent => scheduleEvent.EventDate)
            .ThenBy(scheduleEvent => scheduleEvent.StartMinute)
            .ToArray();
    }

    public Task<BookingDetailDto?> GetAdminBookingAsync(Guid id, CancellationToken cancellationToken = default)
        => store.GetBookingDetailByIdAsync(id, cancellationToken);

    public async Task<BookingCommandResult> ChangeStatusAsync(Guid id, BookingStatus targetStatus, CancellationToken cancellationToken = default)
    {
        var booking = await store.GetBookingForUpdateAsync(id, cancellationToken);
        if (booking is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy booking."]);
        }

        var now = clock.UtcNow;
        // Any transition from a hold to Confirmed must share the booking creation lock.
        await using var confirmationLock = targetStatus == BookingStatus.Confirmed
            ? await writeLock.TryAcquireAsync(booking.FieldId, booking.BookingDate, LockTimeout, cancellationToken)
            : null;
        if (targetStatus == BookingStatus.Confirmed && confirmationLock is null)
            return BookingCommandResult.Failure(["Sân đang được xử lý. Vui lòng thử lại."]);
        if (targetStatus == BookingStatus.Confirmed)
        {
            booking = await store.GetBookingForUpdateAsync(id, cancellationToken) ?? booking;
            if (booking.ExpireIfNeeded(now))
            {
                await store.SaveChangesAsync(cancellationToken);
                return BookingCommandResult.Failure(["Booking đã hết hạn giữ sân."]);
            }
            var conflicts = await store.ListBookingsForFieldDateAsync(booking.FieldId, booking.BookingDate, cancellationToken);
            if (conflicts.Any(other => other.Id != booking.Id && other.BlocksAvailability(now)
                && other.Overlaps(booking.BookingDate, booking.StartMinute, booking.EndMinute)))
                return BookingCommandResult.Failure(["Khung giờ đã được booking khác giữ hoặc xác nhận."]);
        }
        var previousStatus = booking.Status;
        switch (targetStatus)
        {
            case BookingStatus.Confirmed:
                booking.Confirm(now);
                break;
            case BookingStatus.CheckedIn:
                booking.MarkCheckedIn(now);
                break;
            case BookingStatus.InProgress:
                booking.Start(now);
                break;
            case BookingStatus.Completed:
                booking.Complete(now);
                break;
            case BookingStatus.Cancelled:
                booking.Cancel(now, "Hủy bởi nhân viên vận hành");
                break;
            case BookingStatus.NoShow:
                if (!CanMarkNoShow(booking))
                {
                    return BookingCommandResult.Failure(["Chỉ có thể ghi nhận khách không đến sau giờ bắt đầu và thời gian chờ theo chính sách."]);
                }

                booking.MarkNoShow(now);
                break;
            default:
                return BookingCommandResult.Failure(["Trạng thái này chưa được hỗ trợ trong lát hiện tại."]);
        }

        if (booking.Status == previousStatus)
        {
            return BookingCommandResult.Failure(["Không thể chuyển booking sang trạng thái đã chọn."]);
        }

        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingCommandResult> RecordPaymentAsync(BookingPaymentCommand command, CancellationToken cancellationToken = default)
    {
        if (command.Amount <= 0)
        {
            return BookingCommandResult.Failure(["Số tiền ghi nhận phải lớn hơn 0."]);
        }

        var booking = await store.GetBookingForPaymentAsync(command.BookingId, cancellationToken);
        if (booking is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy booking."]);
        }

        // Synchronize with CreateBookingAsync using the exact same MySQL named lock.
        await using var paymentLock = await writeLock.TryAcquireAsync(
            booking.FieldId, booking.BookingDate, LockTimeout, cancellationToken);
        if (paymentLock is null)
            return BookingCommandResult.Failure(["Sân đang được xử lý. Vui lòng thử lại."]);
        booking = await store.GetBookingForPaymentAsync(command.BookingId, cancellationToken) ?? booking;
        var now = clock.UtcNow;
        if (booking.ExpireIfNeeded(now))
        {
            await store.SaveChangesAsync(cancellationToken);
            return BookingCommandResult.Failure(["Booking đã hết hạn giữ sân, không thể ghi nhận thanh toán."]);
        }
        if (booking.Status is BookingStatus.Cancelled or BookingStatus.Expired or BookingStatus.NoShow)
            return BookingCommandResult.Failure(["Không thể ghi nhận thanh toán cho booking ở trạng thái hiện tại."]);
        if (command.PaymentType == PaymentRecordType.Payment && booking.Status == BookingStatus.PendingPayment)
        {
            var conflicts = await store.ListBookingsForFieldDateAsync(booking.FieldId, booking.BookingDate, cancellationToken);
            if (conflicts.Any(other => other.Id != booking.Id && other.BlocksAvailability(now)
                && other.Overlaps(booking.BookingDate, booking.StartMinute, booking.EndMinute)))
                return BookingCommandResult.Failure(["Khung giờ đã được booking khác giữ hoặc xác nhận."]);
        }
        if (!string.IsNullOrWhiteSpace(command.TransactionCode)
            && booking.Payments.Any(existing => existing.PaymentType == command.PaymentType
                && existing.Status == PaymentRecordStatus.Succeeded
                && existing.TransactionCode == command.TransactionCode))
            return BookingCommandResult.Failure(["Mã giao dịch này đã được ghi nhận."]);
        var payment = booking.RecordPayment(command.PaymentType, command.Method, command.Amount, PaymentRecordStatus.Succeeded, command.TransactionCode, command.Note, command.RecordedByUserId, now);
        await store.AddPaymentAsync(payment, cancellationToken);
        if (command.PaymentType == PaymentRecordType.Payment && booking.Status == BookingStatus.PendingPayment)
        {
            booking.Confirm(now);
        }

        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingCommandResult> CancelBookingAsync(BookingCancellationCommand command, CancellationToken cancellationToken = default)
    {
        var booking = await store.GetBookingForPaymentAsync(command.BookingId, cancellationToken);
        if (booking is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy booking."]);
        }

        if (string.IsNullOrWhiteSpace(command.Reason))
        {
            return BookingCommandResult.Failure(["Vui lòng nhập lý do hủy booking."]);
        }

        var now = clock.UtcNow;
        var previousStatus = booking.Status;
        booking.Cancel(now, command.Reason, CalculateCancellationFee(booking));
        if (booking.Status == previousStatus)
        {
            return BookingCommandResult.Failure(["Không thể hủy booking ở trạng thái hiện tại."]);
        }

        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingCommandResult> CancelPublicBookingAsync(PublicBookingCancellationCommand command, CancellationToken cancellationToken = default)
    {
        var bookingDetail = await LookupBookingAsync(new BookingLookupQuery(command.BookingCode, command.CustomerPhone), cancellationToken);
        if (bookingDetail is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy booking phù hợp để hủy."]);
        }

        var booking = await store.GetBookingForPaymentAsync(bookingDetail.Id, cancellationToken);
        if (booking is null)
        {
            return BookingCommandResult.Failure(["Không tìm thấy booking."]);
        }

        if (booking.Status is not (BookingStatus.PendingPayment or BookingStatus.Confirmed))
        {
            return BookingCommandResult.Failure(["Booking này không còn đủ điều kiện hủy trực tuyến."]);
        }

        if (!HasEnoughTimeBeforeStart(booking))
        {
            return BookingCommandResult.Failure(["Booking đã gần giờ sử dụng nên không thể hủy trực tuyến. Vui lòng liên hệ nhân viên sân."]);
        }

        var now = clock.UtcNow;
        booking.Cancel(now, string.IsNullOrWhiteSpace(command.Reason) ? "Khách tự hủy qua tra cứu booking" : command.Reason, CalculateCancellationFee(booking));
        await store.SaveChangesAsync(cancellationToken);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    private static string? BuildBookingNote(string? note, PaymentMethod? preferredPaymentMethod)
    {
        if (preferredPaymentMethod is null)
        {
            return note;
        }

        var methodLabel = $"Hình thức TT: {BookingLabels.PaymentMethod(preferredPaymentMethod.Value)}";
        if (string.IsNullOrWhiteSpace(note))
        {
            return methodLabel;
        }

        return note.Contains(methodLabel, StringComparison.OrdinalIgnoreCase)
            ? note
            : $"{note.Trim()} | {methodLabel}";
    }

    private List<string> ValidateCreateCommand(BookingCreateCommand command, Field field, IReadOnlyList<Booking> bookings)
    {
        var errors = new List<string>();
        Required(command.CustomerName, "Vui lòng nhập họ tên khách.", errors);
        Required(command.CustomerPhone, "Vui lòng nhập số điện thoại.", errors);
        if (NormalizePhone(command.CustomerPhone).Length < 9)
        {
            errors.Add("Số điện thoại chưa hợp lệ.");
        }

        errors.AddRange(ValidateAvailability(field, bookings, command.BookingDate, command.StartMinute, command.EndMinute, allowPast: false));
        return errors;
    }

    private async Task<ServiceSelectionResult> BuildServiceLinesAsync(BookingCreateCommand command, Guid bookingId, CancellationToken cancellationToken)
    {
        var requested = (command.Services ?? [])
            .Where(service => service.Quantity > 0)
            .GroupBy(service => service.ServiceId)
            .Select(group => new BookingServiceSelectionCommand(group.Key, group.Sum(item => item.Quantity)))
            .ToArray();

        if (requested.Length == 0)
        {
            return new ServiceSelectionResult([], 0, []);
        }

        var catalog = await store.ListActiveServicesAsync(cancellationToken);
        var errors = new List<string>();
        var lines = new List<BookingServiceLine>();

        foreach (var item in requested)
        {
            var service = catalog.FirstOrDefault(service => service.Id == item.ServiceId);
            if (service is null)
            {
                errors.Add("Dịch vụ đã chọn không còn khả dụng.");
                continue;
            }

            if (service.IsQuantityTracked && service.AvailableQuantity is not null && item.Quantity > service.AvailableQuantity.Value)
            {
                errors.Add($"Dịch vụ {service.Name} chỉ còn {service.AvailableQuantity.Value} {service.UnitName}.");
                continue;
            }

            lines.Add(new BookingServiceLine(Guid.NewGuid(), bookingId, service.Id, service.Code, service.Name, service.UnitName, service.UnitPrice, item.Quantity, command.CreatedByUserId, clock.UtcNow));
        }

        return new ServiceSelectionResult(lines, lines.Sum(line => line.LineTotal), errors);
    }

    private async Task<PromotionResult> CalculatePromotionAsync(BookingCreateCommand command, long eligibleAmount, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(command.PromotionCode))
        {
            return new PromotionResult(null, 0, []);
        }

        var code = command.PromotionCode.Trim().ToUpperInvariant();
        var promotion = await store.GetPromotionByCodeAsync(code, cancellationToken);
        if (promotion is null)
        {
            return new PromotionResult(null, 0, ["Mã khuyến mãi không tồn tại hoặc đã ngừng áp dụng."]);
        }

        var errors = await ValidatePromotionAsync(promotion, command, eligibleAmount, cancellationToken);
        if (errors.Count > 0)
        {
            return new PromotionResult(null, 0, errors);
        }

        return new PromotionResult(promotion, promotion.CalculateDiscount(eligibleAmount), []);
    }

    private async Task<List<string>> ValidatePromotionAsync(PromoCode promotion, BookingCreateCommand command, long eligibleAmount, CancellationToken cancellationToken)
    {
        var errors = new List<string>();
        var now = clock.UtcNow;
        if (!promotion.IsActive || promotion.StartsAtUtc > now || promotion.EndsAtUtc < now)
        {
            errors.Add("Mã khuyến mãi chưa đến thời gian áp dụng hoặc đã hết hạn.");
        }

        if (eligibleAmount < promotion.MinimumOrderAmount)
        {
            errors.Add("Booking chưa đạt giá trị tối thiểu để áp dụng mã khuyến mãi.");
        }

        if (promotion.ApplicableFieldId is not null && promotion.ApplicableFieldId.Value != command.FieldId)
        {
            errors.Add("Mã khuyến mãi không áp dụng cho sân đã chọn.");
        }

        if (promotion.ApplicableStartMinute is not null && command.StartMinute < promotion.ApplicableStartMinute.Value)
        {
            errors.Add("Mã khuyến mãi không áp dụng cho khung giờ đã chọn.");
        }

        if (promotion.ApplicableEndMinute is not null && command.EndMinute > promotion.ApplicableEndMinute.Value)
        {
            errors.Add("Mã khuyến mãi không áp dụng cho khung giờ đã chọn.");
        }

        if (promotion.TotalUsageLimit is not null)
        {
            var totalUsages = await store.CountPromotionUsagesAsync(promotion.Id, null, cancellationToken);
            if (totalUsages >= promotion.TotalUsageLimit.Value)
            {
                errors.Add("Mã khuyến mãi đã hết lượt sử dụng.");
            }
        }

        if (promotion.PerPhoneUsageLimit is not null)
        {
            var phoneUsages = await store.CountPromotionUsagesAsync(promotion.Id, NormalizePhone(command.CustomerPhone), cancellationToken);
            if (phoneUsages >= promotion.PerPhoneUsageLimit.Value)
            {
                errors.Add("Số điện thoại này đã dùng hết lượt của mã khuyến mãi.");
            }
        }

        return errors;
    }

    private long CalculateCancellationFee(Booking booking)
    {
        if (_policy.LateCancellationFeePercent <= 0 || HasEnoughTimeBeforeStart(booking))
        {
            return 0;
        }

        return booking.PaidAmount * _policy.LateCancellationFeePercent / 100;
    }

    private bool HasEnoughTimeBeforeStart(Booking booking)
    {
        var localNow = TimeZoneInfo.ConvertTime(clock.UtcNow, BusinessTimeZone()).DateTime;
        var bookingStart = booking.BookingDate.ToDateTime(TimeOnly.MinValue).AddMinutes(booking.StartMinute);
        return bookingStart - localNow >= TimeSpan.FromHours(_policy.PublicCancellationHoursBeforeStart);
    }

    private bool CanMarkNoShow(Booking booking)
    {
        if (booking.Status != BookingStatus.Confirmed)
        {
            return false;
        }

        var localNow = TimeZoneInfo.ConvertTime(clock.UtcNow, BusinessTimeZone()).DateTime;
        var bookingStart = booking.BookingDate.ToDateTime(TimeOnly.MinValue).AddMinutes(booking.StartMinute + _policy.NoShowGraceMinutes);
        return localNow >= bookingStart;
    }

    private List<string> ValidateAvailability(Field field, IReadOnlyList<Booking> bookings, DateOnly bookingDate, int startMinute, int endMinute, bool allowPast)
    {
        var errors = new List<string>();
        if (field.Status != FieldStatus.Active)
        {
            errors.Add("Sân hiện không nhận đặt lịch.");
        }

        if (!IsValidInterval(startMinute, endMinute))
        {
            errors.Add("Khung giờ đặt sân không hợp lệ.");
            return errors;
        }

        if (endMinute - startMinute < field.MinimumBookingMinutes)
        {
            errors.Add($"Thời lượng đặt sân tối thiểu là {field.MinimumBookingMinutes} phút.");
        }

        if (startMinute % field.SlotStepMinutes != 0 || endMinute % field.SlotStepMinutes != 0)
        {
            errors.Add($"Khung giờ cần theo bước {field.SlotStepMinutes} phút.");
        }

        if (!allowPast && StartsInPast(bookingDate, startMinute))
        {
            errors.Add("Không thể đặt sân cho thời điểm đã qua.");
        }

        var operatingHour = field.OperatingHours.FirstOrDefault(hour => hour.DayOfWeek == (int)bookingDate.DayOfWeek);
        if (operatingHour is null || operatingHour.IsClosed || operatingHour.OpenMinute is null || operatingHour.CloseMinute is null)
        {
            errors.Add("Sân đóng cửa vào ngày đã chọn.");
        }
        else if (startMinute < operatingHour.OpenMinute.Value || endMinute > operatingHour.CloseMinute.Value)
        {
            errors.Add("Khung giờ nằm ngoài giờ hoạt động của sân.");
        }

        if (field.Blocks.Any(block => block.BlockDate == bookingDate && startMinute < block.EndMinute && endMinute > block.StartMinute))
        {
            errors.Add("Khung giờ này đang được khóa để bảo trì hoặc sự kiện nội bộ.");
        }

        if (bookings.Any(booking => booking.BlocksAvailability(clock.UtcNow) && booking.Overlaps(bookingDate, startMinute, endMinute)))
        {
            errors.Add("Khung giờ này đã có booking khác.");
        }

        return errors;
    }

    private PricingQuoteDto? CalculatePrice(Field field, DateOnly bookingDate, int startMinute, int endMinute)
    {
        if (!IsValidInterval(startMinute, endMinute))
        {
            return null;
        }

        var points = new SortedSet<int> { startMinute, endMinute };
        foreach (var rule in field.PricingRules.Where(rule => IsEligible(rule, bookingDate) && startMinute < rule.EndMinute && endMinute > rule.StartMinute))
        {
            points.Add(Math.Max(startMinute, rule.StartMinute));
            points.Add(Math.Min(endMinute, rule.EndMinute));
        }

        var ordered = points.ToArray();
        var segments = new List<PricingSegmentDto>();
        for (var i = 0; i < ordered.Length - 1; i++)
        {
            var segmentStart = ordered[i];
            var segmentEnd = ordered[i + 1];
            if (segmentStart == segmentEnd)
            {
                continue;
            }

            var matches = field.PricingRules
                .Where(rule => IsEligible(rule, bookingDate) && segmentStart >= rule.StartMinute && segmentEnd <= rule.EndMinute)
                .OrderByDescending(rule => rule.Priority)
                .ThenByDescending(RuleSpecificity)
                .ToArray();

            if (matches.Length == 0)
            {
                return null;
            }

            var selected = matches[0];
            if (matches.Skip(1).Any(rule => rule.Priority == selected.Priority && RuleSpecificity(rule) == RuleSpecificity(selected) && rule.PricePerHour != selected.PricePerHour))
            {
                return null;
            }

            var amount = (long)Math.Round(selected.PricePerHour * ((segmentEnd - segmentStart) / 60m), MidpointRounding.AwayFromZero);
            segments.Add(new PricingSegmentDto(segmentStart, segmentEnd, selected.PricePerHour, amount, selected.Name));
        }

        return segments.Count == 0 ? null : new PricingQuoteDto(segments.Sum(segment => segment.Amount), segments);
    }

    private async Task<string> GenerateBookingCodeAsync(DateOnly bookingDate, CancellationToken cancellationToken)
    {
        for (var attempt = 0; attempt < 8; attempt++)
        {
            var code = $"FB-{bookingDate:yyMMdd}-{RandomSuffix()}";
            if (!await store.BookingCodeExistsAsync(code, cancellationToken))
            {
                return code;
            }
        }

        throw new InvalidOperationException("Không tạo được mã booking duy nhất.");
    }

    private static List<string> ValidateServiceCommand(ServiceItemUpsertCommand command)
    {
        var errors = new List<string>();
        Required(command.Name, "Vui lòng nhập tên dịch vụ.", errors);
        Required(command.UnitName, "Vui lòng nhập đơn vị tính.", errors);
        if (command.UnitPrice < 0)
        {
            errors.Add("Đơn giá dịch vụ không được âm.");
        }

        if (command.IsQuantityTracked && command.AvailableQuantity is < 0)
        {
            errors.Add("Số lượng khả dụng không được âm.");
        }

        if (!string.IsNullOrWhiteSpace(command.Code) && command.Code.Trim().Length > 30)
        {
            errors.Add("Mã dịch vụ tối đa 30 ký tự.");
        }

        return errors;
    }

    private static List<string> ValidatePromotionCommand(PromoCodeUpsertCommand command)
    {
        var errors = new List<string>();
        Required(command.Name, "Vui lòng nhập tên khuyến mãi.", errors);
        if (command.DiscountValue <= 0)
        {
            errors.Add("Giá trị giảm phải lớn hơn 0.");
        }

        if (command.DiscountType == PromoDiscountType.Percentage && command.DiscountValue > 10000)
        {
            errors.Add("Phần trăm giảm không được vượt quá 100%.");
        }

        if (command.MinimumOrderAmount < 0 || command.MaximumDiscountAmount is < 0)
        {
            errors.Add("Giá trị đơn tối thiểu và mức giảm tối đa không được âm.");
        }

        if (command.EndsAtUtc <= command.StartsAtUtc)
        {
            errors.Add("Thời gian kết thúc phải sau thời gian bắt đầu.");
        }

        if (command.TotalUsageLimit is < 0 || command.PerPhoneUsageLimit is < 0)
        {
            errors.Add("Giới hạn lượt dùng không được âm.");
        }

        if (!string.IsNullOrWhiteSpace(command.Code) && command.Code.Trim().Length > 50)
        {
            errors.Add("Mã khuyến mãi tối đa 50 ký tự.");
        }

        return errors;
    }

    private static async Task<string> GenerateCatalogCodeAsync<T>(
        string prefix,
        Func<string, CancellationToken, Task<T?>> lookupAsync,
        CancellationToken cancellationToken)
        where T : class
    {
        for (var attempt = 0; attempt < 8; attempt++)
        {
            var code = $"{prefix}-{RandomSuffix(6)}";
            if (await lookupAsync(code, cancellationToken) is null)
            {
                return code;
            }
        }

        throw new InvalidOperationException("Không tạo được mã danh mục duy nhất.");
    }

    private bool StartsInPast(DateOnly bookingDate, int startMinute)
    {
        var localNow = TimeZoneInfo.ConvertTime(clock.UtcNow, BusinessTimeZone()).DateTime;
        var today = DateOnly.FromDateTime(localNow);
        var currentMinute = localNow.Hour * 60 + localNow.Minute;
        return bookingDate < today || (bookingDate == today && startMinute <= currentMinute);
    }

    private static TimeZoneInfo BusinessTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        }
    }

    private static bool IsEligible(PricingRule rule, DateOnly bookingDate)
    {
        if (!rule.IsActive || bookingDate < rule.EffectiveFrom || (rule.EffectiveTo is not null && bookingDate > rule.EffectiveTo))
        {
            return false;
        }

        return rule.RuleType switch
        {
            PricingRuleType.SpecificDate => rule.SpecificDate == bookingDate,
            PricingRuleType.SpecialRange => true,
            PricingRuleType.Weekend => bookingDate.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday,
            PricingRuleType.Weekday => bookingDate.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday,
            PricingRuleType.Holiday => rule.SpecificDate == bookingDate,
            _ => false
        };
    }

    private static int RuleSpecificity(PricingRule rule)
        => rule.RuleType switch
        {
            PricingRuleType.SpecificDate => 50,
            PricingRuleType.SpecialRange => 40,
            PricingRuleType.Holiday => 30,
            PricingRuleType.Weekend => 20,
            PricingRuleType.Weekday => 10,
            _ => 0
        };

    private static bool IsValidInterval(int startMinute, int endMinute)
        => startMinute >= 0 && startMinute < endMinute && endMinute <= 1440;

    private static string NormalizePhone(string phone)
        => new(phone.Where(char.IsDigit).ToArray());

    private static string FormatMinute(int minute)
        => $"{minute / 60:00}:{minute % 60:00}";

    private static string RandomSuffix()
        => RandomSuffix(4);

    private static string RandomSuffix(int length)
    {
        const string alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        Span<char> chars = stackalloc char[length];
        Span<byte> bytes = stackalloc byte[length];
        RandomNumberGenerator.Fill(bytes);
        for (var i = 0; i < chars.Length; i++)
        {
            chars[i] = alphabet[bytes[i] % alphabet.Length];
        }

        return new string(chars);
    }

    private static void Required(string? value, string message, List<string> errors)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors.Add(message);
        }
    }

    private static ServiceItemDto ToServiceDto(ServiceItem service)
        => new(service.Id, service.Code, service.Name, service.Description, service.UnitName, service.UnitPrice, service.IsQuantityTracked, service.AvailableQuantity, service.IsActive, service.SortOrder);

    private static PromoCodeDto ToPromoDto(PromoCode promotion)
        => new(promotion.Id, promotion.Code, promotion.Name, promotion.DiscountType, promotion.DiscountValue, promotion.MaximumDiscountAmount, promotion.MinimumOrderAmount, promotion.StartsAtUtc, promotion.EndsAtUtc, promotion.TotalUsageLimit, promotion.PerPhoneUsageLimit, promotion.IsActive);

    private sealed record ServiceSelectionResult(IReadOnlyList<BookingServiceLine> Lines, long ServiceAmount, IReadOnlyList<string> Errors);

    private sealed record PromotionResult(PromoCode? Promotion, long DiscountAmount, IReadOnlyList<string> Errors);
}
